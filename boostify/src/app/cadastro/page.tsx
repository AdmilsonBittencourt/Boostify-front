'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from 'next/navigation'

export default function Component() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmeSenha, setConfirmeSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)

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

  const handleSubmit = (e: React.FormEvent) => {
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

    // Aqui você normalmente enviaria os dados para o servidor
    console.log('Dados do formulário:', { nome, email, senha })
    setSucesso(true)
    
    // Adiciona um pequeno delay para mostrar a mensagem de sucesso antes de redirecionar
    setTimeout(() => {
      router.push('/login')
    }, 500)
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
              <Input 
                id="senha" 
                type="password" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirme-senha">Confirme a Senha</Label>
              <Input 
                id="confirme-senha" 
                type="password" 
                value={confirmeSenha}
                onChange={(e) => setConfirmeSenha(e.target.value)}
              />
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