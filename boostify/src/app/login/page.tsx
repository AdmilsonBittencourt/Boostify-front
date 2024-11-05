"use client";

import { useState } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert"

type ValidationResult = {
  isValid: boolean;
  errors: {
    email?: string;
    password?: string;
  };
};

export function validateFields(email: string, password: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: {},
  };

  // Validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    result.isValid = false;
    result.errors.email = "Email é obrigatório";
  } else if (!emailRegex.test(email)) {
    result.isValid = false;
    result.errors.email = "Formato de email inválido";
  }

  // Validação de senha
  if (!password) {
    result.isValid = false;
    result.errors.password = "Senha é obrigatória";
  } else if (password.length < 8) {
    result.isValid = false;
    result.errors.password = "A senha deve ter pelo menos 8 caracteres";
  } else if (!/[A-Z]/.test(password)) {
    result.isValid = false;
    result.errors.password = "A senha deve conter pelo menos uma letra maiúscula";
  } else if (!/[a-z]/.test(password)) {
    result.isValid = false;
    result.errors.password = "A senha deve conter pelo menos uma letra minúscula";
  } else if (!/[0-9]/.test(password)) {
    result.isValid = false;
    result.errors.password = "A senha deve conter pelo menos um número";
  } else if (!/[!@#$%^&*]/.test(password)) {
    result.isValid = false;
    result.errors.password = "A senha deve conter pelo menos um caractere especial (!@#$%^&*)";
  }

  return result;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");
    setSucesso(false);

    if (!email || !password) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    const validationResult = validateFields(email, password);
    if (!validationResult.isValid) {
      setErro(validationResult.errors.email || validationResult.errors.password || "");
    } else {
      console.log("Login bem-sucedido!");
      setSucesso(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Boostify</CardTitle>
          <CardDescription className="text-center">Insira suas credenciais para acessar sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <Button className="mt-6 w-full" type="submit">Entrar</Button>
            {erro && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{erro}</AlertDescription>
              </Alert>
            )}
            {sucesso && (
              <Alert className="mt-4 border-green-500">
                <AlertDescription className="text-green-500">Login realizado com sucesso!</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-600">
            Não tem uma conta?{' '}
            <Link href="/cadastro" className="text-blue-600 hover:underline">
              Inscrever-se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}