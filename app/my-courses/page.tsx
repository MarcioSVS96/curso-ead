"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { type Enrollment, enrollmentService } from "@/lib/courses"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Award, Play } from "lucide-react"
import Image from "next/image"

export default function MyCoursesPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadEnrollments()
    }
  }, [user])

  const loadEnrollments = async () => {
    try {
      const { enrollments } = await enrollmentService.getMyEnrollments()
      setEnrollments(enrollments)
    } catch (error) {
      console.error("Erro ao carregar matrículas:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Acesso Negado</h1>
          <p className="text-gray-600 mt-2">Você precisa estar logado para ver seus cursos.</p>
          <Button asChild className="mt-4">
            <Link href="/auth/login">Fazer Login</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="h-8 bg-gray-200 animate-pulse rounded w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-lg" />
            ))}
          </div>
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
            <p className="text-gray-600 mt-2">Continue seu aprendizado onde parou</p>
          </div>
          <Button asChild>
            <Link href="/courses">
              <BookOpen className="h-4 w-4 mr-2" />
              Explorar Cursos
            </Link>
          </Button>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Nenhum curso encontrado</h2>
            <p className="text-gray-600 mb-6">Você ainda não se matriculou em nenhum curso. Que tal começar agora?</p>
            <Button asChild>
              <Link href="/courses">Explorar Cursos</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enrollment) => (
              <Card key={enrollment.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative aspect-video">
                    <Image
                      src={
                        enrollment.thumbnail ||
                        `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(enrollment.title)}`
                      }
                      alt={enrollment.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-blue-100 text-blue-800">{enrollment.level}</Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-4 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2">{enrollment.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">Por {enrollment.instructor_name}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progresso</span>
                      <span className="font-medium">{enrollment.progress || 0}%</span>
                    </div>
                    <Progress value={enrollment.progress || 0} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {enrollment.completed_lessons}/{enrollment.total_lessons} aulas
                      </span>
                    </div>
                    {enrollment.completed_at && (
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4 text-green-500" />
                        <span className="text-green-600">Concluído</span>
                      </div>
                    )}
                  </div>

                  <Button asChild className="w-full">
                    <Link href={`/my-courses/${enrollment.course_id}`}>
                      <Play className="h-4 w-4 mr-2" />
                      {enrollment.progress === 0 ? "Começar" : "Continuar"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
