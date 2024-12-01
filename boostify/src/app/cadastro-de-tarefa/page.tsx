'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, RefreshCw } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { getAllTasksByUserId, createTask, deleteTask as deleteTaskService, alterStatusTask, alterTask } from "@/services/tasksService"

interface Task {
  id: number;
  title: string;
  description: string;
  prioridade: string;
  completed: boolean;
  isDaily: boolean;
  status: string;
}

// Definindo a enumeração para os status das tarefas
enum TaskStatus {
    COMPLETED = "COMPLETED",
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
}

function TaskItem({ task, onEdit, onDelete, onToggle }: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}) {

  if(task.status === TaskStatus.COMPLETED) {
    task.completed = true;
  }else {
    task.completed = false;
  }

  return (
    <div className={`flex items-center justify-between p-4 border rounded-lg ${task.completed ? 'bg-muted' : ''}`}>
      <div className="flex items-center space-x-4">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <div className={`${task.completed ? 'line-through text-muted-foreground' : ''}`}>
          <h3 className="font-medium">{task.title}</h3>
          <p className="text-sm text-muted-foreground">{task.description}</p>
          <div className="flex items-center space-x-2">
            <span className={`text-xs px-2 py-1 rounded-full ${
              task.prioridade === 'alta' ? 'bg-red-100 text-red-800' :
              task.prioridade === 'media' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {task.prioridade}
            </span>
            {task.isDaily && (
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                Diária
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button variant="ghost" size="sm" onClick={() => onEdit(task)}>
          Editar
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)}>
          Excluir
        </Button>
      </div>
    </div>
  );
}

export default function CadastroDeTarefa() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [dailyTasks, setDailyTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const userIdString = localStorage.getItem("userId");
    const userId = userIdString ? parseInt(userIdString) : 1;

  useEffect(() => {
    const userIdString = localStorage.getItem("userId");
    const userId = userIdString ? parseInt(userIdString) : 1;

    getAllTasksByUserId(userId)
      .then(response => {
        console.log(response);
        const updatedTasks = response.map((task: { status: TaskStatus }) => ({
          ...task,
          completed: task.status === TaskStatus.COMPLETED
        }));
        setTasks(updatedTasks);
      })
      .catch(error => {
        console.error("Erro ao buscar a task:", error);
      });
  }, []);

  const addOrUpdateTask = async (task: Task) => {
    if (!task.title.trim()) {
        return;
    }

    const priorityMap: { [key: string]: string } = {
        baixa: 'LOW',
        media: 'AVERAGE',
        alta: 'HIGH',
    };

    const taskWithId = {
        idUser: userId,
        title: task.title,
        description: task.description,
        priority: priorityMap[task.prioridade] || 'LOW',
        status: task.status,
        isDaily: task.isDaily
    };
    
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { status, ...taskWithoutStatus } = taskWithId;
        if (editingTask) {
            // Se estamos editando uma tarefa, chamamos alterTask
            const updatedTask = await alterTask(editingTask.id, taskWithoutStatus);
            setTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
        } else {
            // Se estamos criando uma nova tarefa, chamamos createTask
            const createdTask = await createTask(taskWithoutStatus);
            setTasks(prev => [...prev, createdTask]);
        }
    } catch (error) {
        console.error("Erro ao salvar a task:", error);
    }

    setIsDialogOpen(false);
    setEditingTask(null);
  };

  const deleteTask = async (id: number) => {
    try {
      await deleteTaskService(id);
      setTasks(tasks.filter(task => task.id !== id));
      setDailyTasks(dailyTasks.filter(task => task.id !== id));
    } catch (error) {
      console.error("Erro ao deletar a task:", error);
    }
  };

  const toggleTask = async (id: number) => {
    const updatedTask = tasks.find(task => task.id === id);
    if (updatedTask) {
        // Mapeando o status atual para a nova enumeração
        let newStatus: TaskStatus;
        if (updatedTask.completed) {
            newStatus = TaskStatus.PENDING; // Se já está completo, muda para PENDING
        } else {
            newStatus = TaskStatus.COMPLETED; // Se não está completo, muda para COMPLETED
        }

        try {
            console.log(id, newStatus);
            await alterStatusTask(id, newStatus); // Chama a função para alterar o status
            setTasks(tasks.map(task => 
                task.id === id ? { ...task, completed: newStatus === TaskStatus.COMPLETED, status: newStatus } : task
            ));
            setDailyTasks(dailyTasks.map(task => 
                task.id === id ? { ...task, completed: newStatus === TaskStatus.COMPLETED, status: newStatus } : task
            ));
        } catch (error) {
            console.error("Erro ao alterar o status da task:", error);
        }
    }
  };

  const resetDailyTasks = async () => {

    // 2. Alterar o status das tasks que estão COMPLETED para PENDING e desmarcar o checkbox
    const updatedTasks = await Promise.all(tasks.map(async task => {
      if (task.completed) {
          await alterStatusTask(task.id, TaskStatus.PENDING);
          return { ...task, completed: false, status: TaskStatus.PENDING };
      }
      return task;
  }));

    // 1. Deletar todas as tasks que não possuem o atributo isDaily true
    const tasksToDelete = tasks.filter(task => !task.isDaily);
    await Promise.all(tasksToDelete.map(task => deleteTaskService(task.id)));

    // Atualiza o estado com as tarefas filtradas e atualizadas
    setTasks(updatedTasks.filter(task => task.isDaily)); // Mantém apenas as tarefas diárias
  }

  const allTasks = [...tasks, ...dailyTasks]
  const completedTasksCount = allTasks.filter(task => task.completed).length
  const totalTasks = allTasks.length
  const progressPercentage = totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0

  return (
    
    <div className=" max-w-[800px] mx-auto min-h-screen bg-background p-4">

      <header className="text-3xl max-w-4xl mx-auto font-bold mb-2">Minha Lista de Tarefas</header>

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Progress value={progressPercentage} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">
            {completedTasksCount} de {totalTasks} tarefas concluídas
          </p>
        </div>

        <div className="flex justify-between items-center mb-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingTask(null);
                setIsDialogOpen(true);
              }}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Tarefa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTask ? 'Editar Tarefa' : 'Adicionar Nova Tarefa'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const newTask: Task = {
                  id: editingTask?.id || Date.now(),
                  title: (formData.get('title') as string)?.trim(),
                  description: (formData.get('description') as string)?.trim(),
                  prioridade: (formData.get('prioridade') as string)?.trim(),
                  completed: false,
                  isDaily: formData.get('isDaily') === 'on',
                  status: ''
                };
                addOrUpdateTask(newTask);
              }}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input id="title" name="title" defaultValue={editingTask?.title} required />
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea id="description" name="description" defaultValue={editingTask?.description} />
                  </div>
                  <div>
                    <Label htmlFor="prioridade">Prioridade</Label>
                    <Select name="prioridade" defaultValue={editingTask?.prioridade || "baixa"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alta" className="text-red-500">Alta</SelectItem>
                        <SelectItem value="media" className="text-yellow-500">Média</SelectItem>
                        <SelectItem value="baixa" className="text-green-500">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="isDaily" name="isDaily" defaultChecked={editingTask?.isDaily} />
                    <Label htmlFor="isDaily">Tarefa Diária</Label>
                  </div>
                  <Button type="submit">{editingTask ? 'Atualizar' : 'Adicionar'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          <Button variant="outline" onClick={resetDailyTasks}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Resetar Tarefas
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-300px)] border rounded-md p-4">
          {allTasks.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhuma tarefa adicionada ainda.</p>
          ) : (
            <div className="space-y-4">
              {dailyTasks.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Tarefas Diárias</h2>
                  {dailyTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onEdit={(task) => {
                        setEditingTask(task)
                        setIsDialogOpen(true)
                      }}
                      onDelete={deleteTask}
                      onToggle={toggleTask}
                    />
                  ))}
                </div>
              )}
              {tasks.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-2">Tarefas</h2>
                  {tasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onEdit={(task) => {
                        setEditingTask(task)
                        setIsDialogOpen(true)
                      }}
                      onDelete={deleteTask}
                      onToggle={toggleTask}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  )
}