"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { authService } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Mail, Calendar, Shield } from "lucide-react"

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [loading, setLoading] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { user: updatedUser } = await authService.updateProfile({ name })
      updateUser(updatedUser)
      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso",
      })
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.error || "Erro ao atualizar perfil",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Acesso Negado</h1>
          <p className="text-gray-600 mt-2">Você precisa estar logado para ver seu perfil.</p>
        </div>
      </div>
    )
  }

  const roleLabels = {
    admin: "Administrador",
    instructor: "Instrutor",
    student: "Aluno",
  }

  const roleColors = {
    admin: "bg-red-100 text-red-800",
    instructor: "bg-blue-100 text-blue-800",
    student: "bg-green-100 text-green-800",
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-gray-600 mt-2">Gerencie suas informações pessoais</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Profile Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <Badge className={roleColors[user.role]}>{roleLabels[user.role]}</Badge>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Membro desde</p>
                    <p className="font-medium">{new Date(user.created_at).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Tipo de conta</p>
                    <p className="font-medium">{roleLabels[user.role]}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Profile */}
          <Card>
            <CardHeader>
              <CardTitle>Editar Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={user.email} disabled className="bg-gray-50" />
                  <p className="text-sm text-gray-600">O email não pode ser alterado</p>
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Account Stats */}
        {user.role === "student" && (
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas da Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">8</p>
                  <p className="text-sm text-gray-600">Cursos Matriculados</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">5</p>
                  <p className="text-sm text-gray-600">Cursos Concluídos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">124h</p>
                  <p className="text-sm text-gray-600">Horas de Estudo</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">5</p>
                  <p className="text-sm text-gray-600">Certificados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {user.role === "instructor" && (
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas do Instrutor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">12</p>
                  <p className="text-sm text-gray-600">Cursos Criados</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">1,234</p>
                  <p className="text-sm text-gray-600">Total de Alunos</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">4.8</p>
                  <p className="text-sm text-gray-600">Avaliação Média</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">85%</p>
                  <p className="text-sm text-gray-600">Taxa de Conclusão</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
