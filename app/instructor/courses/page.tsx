"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { type Course, courseService } from "@/lib/courses"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, BookOpen, Users, Eye, Edit, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user?.role === "instructor") {
      loadCourses()
    }
  }, [user])

  const loadCourses = async () => {
    try {
      const { courses } = await courseService.getCourses({
        instructor_id: user?.id,
      })
      setCourses(courses)
    } catch (error) {
      console.error("Erro ao carregar cursos:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus cursos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm("Tem certeza que deseja excluir este curso?")) return

    try {
      await courseService.deleteCourse(courseId)
      setCourses(courses.filter((c) => c.id !== courseId))
      toast({
        title: "Sucesso",
        description: "Curso excluído com sucesso",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o curso",
        variant: "destructive",
      })
    }
  }

  if (user?.role !== "instructor") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Acesso Negado</h1>
          <p className="text-gray-600 mt-2">Apenas instrutores podem acessar esta página.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Meus Cursos</h1>
            <p className="text-gray-600 mt-2">Gerencie seus cursos e acompanhe o desempenho</p>
          </div>
          <Button asChild>
            <Link href="/instructor/courses/new">
              <Plus className="h-4 w-4 mr-2" />
              Criar Novo Curso
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Cursos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cursos Publicados</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.filter((c) => c.is_published).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {courses.reduce((acc, course) => acc + (course.enrolled_students || 0), 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cursos Aprovados</CardTitle>
              <Badge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.filter((c) => c.is_approved).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Courses List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Nenhum curso criado</h2>
            <p className="text-gray-600 mb-6">Comece criando seu primeiro curso e compartilhe seu conhecimento!</p>
            <Button asChild>
              <Link href="/instructor/courses/new">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Curso
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative aspect-video">
                    <img
                      src={
                        course.thumbnail ||
                        `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(course.title)}`
                      }
                      alt={course.title}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      {course.is_published && <Badge className="bg-green-100 text-green-800">Publicado</Badge>}
                      {course.is_approved && <Badge className="bg-blue-100 text-blue-800">Aprovado</Badge>}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">{course.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{course.enrolled_students || 0} alunos</span>
                    </div>
                    <span className="font-medium text-blue-600">
                      {course.price > 0 ? `R$ ${course.price.toFixed(2)}` : "Gratuito"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild size="sm" className="flex-1">
                      <Link href={`/instructor/courses/${course.id}/edit`}>
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteCourse(course.id)}
                      className="bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
