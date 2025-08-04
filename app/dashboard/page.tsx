"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Award, TrendingUp, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getDashboardContent = () => {
    switch (user.role) {
      case "admin":
        return <AdminDashboard />
      case "instructor":
        return <InstructorDashboard />
      case "student":
        return <StudentDashboard />
      default:
        return <div>Tipo de usuário não reconhecido</div>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-2">Bem-vindo de volta, {user.name}!</p>
        </div>
        {getDashboardContent()}
      </div>
    </div>
  )
}

function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Cursos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% em relação ao mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,231</div>
            <p className="text-xs text-muted-foreground">+8% em relação ao mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificados Emitidos</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-xs text-muted-foreground">+23% em relação ao mês passado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+5% em relação ao mês passado</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start">
              <Link href="/admin/courses">
                <BookOpen className="h-4 w-4 mr-2" />
                Gerenciar Cursos
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/admin/users">
                <Users className="h-4 w-4 mr-2" />
                Gerenciar Usuários
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/admin/reports">
                <TrendingUp className="h-4 w-4 mr-2" />
                Relatórios
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cursos Pendentes de Aprovação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">JavaScript Avançado</p>
                  <p className="text-sm text-gray-600">Por João Silva</p>
                </div>
                <Button size="sm">Revisar</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">React Completo</p>
                  <p className="text-sm text-gray-600">Por Maria Santos</p>
                </div>
                <Button size="sm">Revisar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InstructorDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Meus Cursos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 publicados, 2 em revisão</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+15% este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8</div>
            <p className="text-xs text-muted-foreground">Baseado em 234 avaliações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Acima da média</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start">
              <Link href="/instructor/courses/new">
                <Plus className="h-4 w-4 mr-2" />
                Criar Novo Curso
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/instructor/courses">
                <BookOpen className="h-4 w-4 mr-2" />
                Gerenciar Cursos
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/instructor/analytics">
                <TrendingUp className="h-4 w-4 mr-2" />
                Ver Análises
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cursos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">JavaScript Avançado</p>
                  <p className="text-sm text-gray-600">234 alunos matriculados</p>
                </div>
                <Button size="sm" variant="outline">
                  Editar
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">React Completo</p>
                  <p className="text-sm text-gray-600">156 alunos matriculados</p>
                </div>
                <Button size="sm" variant="outline">
                  Editar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StudentDashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Matriculados</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Concluídos</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">+2 este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Horas de Estudo</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124h</div>
            <p className="text-xs text-muted-foreground">Este mês: 28h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificados</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Todos verificados</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Continuar Aprendendo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start">
              <Link href="/my-courses">
                <BookOpen className="h-4 w-4 mr-2" />
                Meus Cursos
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/courses">
                <Plus className="h-4 w-4 mr-2" />
                Explorar Novos Cursos
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/certificates">
                <Award className="h-4 w-4 mr-2" />
                Meus Certificados
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progresso Recente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">JavaScript Avançado</p>
                  <p className="text-sm text-gray-600">75% concluído</p>
                </div>
                <Button size="sm">Continuar</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">React Completo</p>
                  <p className="text-sm text-gray-600">45% concluído</p>
                </div>
                <Button size="sm">Continuar</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
