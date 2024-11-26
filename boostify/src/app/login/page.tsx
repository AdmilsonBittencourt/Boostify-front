"use client";

import { useState } from "react";
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/services/userService";
import { useRouter } from 'next/navigation'

type ValidationResult = {
  isValid: boolean;
  errors: {
    email?: string;
    password?: string;
  };
};

export function validateFields(email: string): ValidationResult {
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

  return result;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [erro, setErro] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!email || !password) {
      setErro("Por favor, preencha todos os campos.");
      return;
    }

    const validationResult = validateFields(email);
    if (!validationResult.isValid) {
      setErro(validationResult.errors.email || "");
    } 

    await login({ email, password});

    router.push('/home');    
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
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <Button className="mt-6 w-full" type="submit">Entrar</Button>
            {erro && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{erro}</AlertDescription>
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