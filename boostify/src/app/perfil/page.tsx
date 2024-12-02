'use client';
import React, { useEffect, useState } from "react";
import { getUserById, updateUser } from "@/services/userService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardFooter } from "@/components/ui/card";
import User from "@/models/user";
import { useRouter } from 'next/navigation';
import { ArrowLeft } from "lucide-react";
import HeaderHome from "@/components/headerHome";
import useUserId from "@/hooks/useUserId";
import useAxiosWithToken from "@/hooks/useAxiosWithToken";

const ProfilePage = () => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  useAxiosWithToken();
  const userId = useUserId();
  
  useEffect(() => {
    const fetchUser = async () => {
        if (userId) {
            try {
                const userData = await getUserById(userId);
                setUser(userData);
                setFormData({ name: userData.name, email: userData.email });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (err: unknown) {
                setError("Erro ao carregar os dados do usuário.");
            } finally {
                setLoading(false);
            }
        }
    };

    fetchUser();
  }, [userId]);

  const handleChange = (e: { target: { name: string; value: string; }; }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      await updateUser(userId, formData);
      alert("Dados atualizados com sucesso!");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {
      setError("Erro ao atualizar os dados do usuário.");
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
        <HeaderHome />
            <Card className="max-w-[600px] mx-auto min-h-auto bg-background p-4 mt-16"> {/* Centralizando o conteúdo */}
            <CardHeader>
                <h2 className="text-xl font-bold">Perfil do Usuário</h2>
            </CardHeader>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4"> {/* Centralizando apenas o formulário */}
                <Input
                    name="name"
                    label="Nome"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <Input
                    name="email"
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <Button type="submit">Salvar Alterações</Button>
                </form>
            <CardFooter className="mt-8">
                <Button
                variant="outline" 
                onClick={() => router.push('/home')} // Redirecionando para a página inicial
                >
                <ArrowLeft className="h-4 w-4" /> {/* Ícone de seta */}
                Voltar
                </Button>
            </CardFooter>
            </Card>
    </>
  );
};

export default ProfilePage;