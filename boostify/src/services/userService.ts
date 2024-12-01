import User, { ILogin } from "@/models/user";
import api from "./axiosConfig";


export const login = async (loginData: ILogin) => {
  try {
    const response = await api.post('/auth/login', loginData);
    
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userId', response.data.id);

    return response.data;
  } catch (error: unknown) {

    // depois criar uma função para tratar o erro de forma mais adequada
    console.error('Erro ao fazer login:', error);
    throw new Error('Erro ao fazer login');
  }
};

export const register = async (userData: User) => {
  try {
    const response = await api.post('/users', userData);
    return response.data;
  } catch (error: unknown) {
    console.error('Erro ao registrar usuário:', error);
    throw new Error('Erro ao registrar usuário');
  }
};

export const updateUser = async (id: number, userData: {name: string, email: string}) => {

  try {
    await api.put(`/users/${id}`, userData);
    
  }catch (error: unknown) {
    console.error('Erro ao atualizar o usuário:', error);
    throw new Error('Erro ao atualizar o usuário');
  }
};

export const getUserById = async (id: number) => {

  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.error('Erro ao budcar o usuário:', error);
    throw new Error('Erro ao buscar o usuário');
  }
}
