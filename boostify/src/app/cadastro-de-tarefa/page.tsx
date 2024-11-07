"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
// import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle, Home, Calendar, Settings, MoreVertical } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
// import { TaskItem, Task } from "@/components/TaskItem"

interface Task {
  id: number;
  title: string;
  description: string;
  prioridade: string;
  completed: boolean;
}

// Add this component before the TodoHome component
function TaskItem({ task, onEdit, onDelete, onToggle }: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}) {
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
          <span className={`text-xs px-2 py-1 rounded-full ${
            task.prioridade === 'alta' ? 'bg-red-100 text-red-800' :
            task.prioridade === 'media' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {task.prioridade}
          </span>
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

export default function TodoHome() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const addOrUpdateTask = (task: Task) => {
    if (!task.title.trim()) {
      return;
    }
    
    if (task.id) {
      setTasks(tasks.map(t => t.id === task.id ? task : t))
    } else {
      setTasks([...tasks, { ...task, id: Date.now() }])
    }
    setIsDialogOpen(false)
    setEditingTask(null)
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ))
  }

  const completedTasksCount = tasks.filter(task => task.completed).length
  const totalTasks = tasks.length
  const progressPercentage = totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0

  return (
    <div className="min-h-screen bg-background p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Minha Lista de Tarefas</h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Home className="mr-2 h-4 w-4" />
              <span>Início</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Calendário</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Progress value={progressPercentage} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">
            {completedTasksCount} de {totalTasks} tarefas concluídas
          </p>
        </div>

        {/* Add task button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingTask(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingTask ? 'Editar Tarefa' : 'Adicionar Nova Tarefa'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              const newTask: Task = {
                id: editingTask?.id || 0,
                title: (formData.get('title') as string)?.trim() || '',
                description: (formData.get('description') as string)?.trim() || '',
                prioridade: (formData.get('prioridade') as string) || 'baixa',
                completed: editingTask?.completed || false
              }
              addOrUpdateTask(newTask)
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
                  <Select name="prioridade" defaultValue={editingTask?.prioridade || "pessoal"}>
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
                <Button type="submit">{editingTask ? 'Atualizar' : 'Adicionar'}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Task list */}
        <ScrollArea className="h-[calc(100vh-250px)] border rounded-md p-4 mt-4">
          {tasks.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhuma tarefa adicionada ainda.</p>
          ) : (
            <div className="space-y-4">
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
        </ScrollArea>
      </div>
    </div>
  )
}