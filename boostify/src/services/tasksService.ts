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