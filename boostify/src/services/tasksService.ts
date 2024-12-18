import api from "./axiosConfig";


export const getAllTasksByUserId = async (userId: number) => {
    try {
        const response = await api.get(`/tasks/user/${userId}`);
        return response.data;
    }catch(error: unknown) {
        console.error('Erro ao buscar a task:', error);
        throw new Error('Erro ao buscar a task:');
    }
};

/**
 * Cria uma nova tarefa para o usuário.
 * @param task Dados da tarefa a ser criada.
 * @returns A tarefa criada.
 */
export const createTask = async (task: { idUser: number; title: string; description?: string; priority?: string, isDaily: boolean }) => {
    try {
        const response = await api.post('/tasks', task);
        return response.data;
    } catch (error: unknown) {
        console.error('Erro ao criar a task:', error);
        throw new Error('Erro ao criar a task');
    }
};

/**
 * Altera os dados de uma tarefa existente.
 * @param taskId ID da tarefa a ser alterada.
 * @param updatedTask Dados atualizados da tarefa.
 * @returns A tarefa atualizada.
 */
export const alterTask = async (taskId: number, updatedTask: { idUser: number; title: string; description?: string; priority?: string, isDaily: boolean }) => {
    try {
        const response = await api.put(`/tasks/${taskId}`, updatedTask);
        return response.data;
    } catch (error: unknown) {
        console.error('Erro ao alterar a task:', error);
        throw new Error('Erro ao alterar a task');
    }
};

/**
 * Altera o status de uma tarefa existente.
 * @param taskId ID da tarefa a ser alterada.
 * @param status Novo status da tarefa.
 * @returns A tarefa com o status atualizado.
 */
export const alterStatusTask = async (taskId: number, status: string) => {
    try {
        console.log({status: status});
        const response = await api.put(`/tasks/status/${taskId}`, {status: status});
        return response.data;
    } catch (error: unknown) {
        console.error('Erro ao alterar o status da task:', error);
        throw new Error('Erro ao alterar o status da task');
    }
};

/**
 * Deleta uma tarefa existente pelo ID.
 * @param taskId ID da tarefa a ser deletada.
 * @returns A resposta da API.
 */
export const deleteTask = async (taskId: number) => {
    try {
        const response = await api.delete(`/tasks/${taskId}`);
        return response.data;
    } catch (error: unknown) {
        console.error('Erro ao deletar a task:', error);
        throw new Error('Erro ao deletar a task');
    }
};