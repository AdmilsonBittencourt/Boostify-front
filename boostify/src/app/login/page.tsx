"use client";

import { useState } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationResult = validateFields(email, password);
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
    } else {
      // Prosseguir com o login (por exemplo, chamar uma API)
      console.log("Login bem-sucedido!");
      alert("Login bem-sucedido!");
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
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
              </div>
            </div>
            <Button className="mt-6 w-full" type="submit">Entrar</Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-600">
            Não tem uma conta?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Inscrever-se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}