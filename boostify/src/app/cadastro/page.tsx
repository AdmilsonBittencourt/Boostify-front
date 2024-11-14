'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
// import { useRouter } from 'next/navigation'
import User from '@/models/user'
import { Eye, EyeOff } from "lucide-react"
import { register } from '@/services/userService'

export default function Component() {
  // const router = useRouter()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmeSenha, setConfirmeSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const validarSenha = (senha: string) => {
    const regras = {
      comprimento: senha.length >= 8,
      maiuscula: /[A-Z]/.test(senha),
      minuscula: /[a-z]/.test(senha),
      numero: /[0-9]/.test(senha),
      especial: /[!@#$%^&*(),.?":{}|<>]/.test(senha),
    };

    return regras;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')
    setSucesso(false)

    if (!nome || !email || !senha || !confirmeSenha) {
      setErro('Por favor, preencha todos os campos.')
      return
    }

    const validacaoSenha = validarSenha(senha);
    if (!validacaoSenha.comprimento || !validacaoSenha.maiuscula || 
        !validacaoSenha.minuscula || !validacaoSenha.numero || !validacaoSenha.especial) {
      setErro('A senha deve conter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial.')
      return
    }

    if (senha !== confirmeSenha) {
      setErro('As senhas não coincidem.')
      return
    }

    const user = new User(nome, email, senha);
    console.log('Dados do formulário:', user)

    const data = await register(user);

    console.log(data);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className='text-3xl'>Cadastro</CardTitle>
          <CardDescription>Crie sua conta preenchendo os campos abaixo.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input 
                id="nome" 
                placeholder="Seu nome completo" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
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
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input 
                  id="senha" 
                  type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirme-senha">Confirme a Senha</Label>
              <div className="relative">
                <Input 
                  id="confirme-senha" 
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmeSenha}
                  onChange={(e) => setConfirmeSenha(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full">Cadastrar</Button>
            {erro && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{erro}</AlertDescription>
              </Alert>
            )}
            {sucesso && (
              <Alert className="mt-4 border-green-500">
                <AlertDescription className="text-green-500">Cadastro realizado com sucesso!</AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}