import User, { ILogin } from "@/models/user";

export class UserService {
  private baseUrl = 'http://localhost:8080';

  async createUser(userData: User): Promise<unknown> {
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao criar usuário: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  }

  async login(userData: ILogin): Promise<unknown> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`Erro ao logar: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao logar:', error);
      throw error;
    }
  }
}
