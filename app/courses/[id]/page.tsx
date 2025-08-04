"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import { type Course, courseService, enrollmentService } from "@/lib/courses"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Users, Award, Star, Play, CheckCircle } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function CourseDetailPage() {
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)

  const { id } = useParams()
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (id) {
      loadCourse()
    }
  }, [id])

  const loadCourse = async () => {
    try {
      const { course } = await courseService.getCourseById(Number(id))
      setCourse(course)

      // Verificar se já está matriculado (implementar verificação)
      // setIsEnrolled(...)
    } catch (error) {
      console.error("Erro ao carregar curso:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar o curso",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async () => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    setEnrolling(true)
    try {
      await enrollmentService.enrollInCourse(Number(id))
      setIsEnrolled(true)
      toast({
        title: "Sucesso!",
        description: "Você foi matriculado no curso com sucesso",
      })
      router.push(`/my-courses/${id}`)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.error || "Erro ao se matricular no curso",
        variant: "destructive",
      })
    } finally {
      setEnrolling(false)
    }
  }

  const levelColors = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800",
  }

  const levelLabels = {
    beginner: "Iniciante",
    intermediate: "Intermediário",
    advanced: "Avançado",
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-64 bg-gray-200 rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-32 bg-gray-200 rounded" />
            </div>
            <div className="h-96 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Curso não encontrado</h1>
          <p className="text-gray-600 mt-2">O curso que você está procurando não existe.</p>
          <Button asChild className="mt-4">
            <a href="/courses">Voltar aos Cursos</a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="relative aspect-video rounded-lg overflow-hidden">
          <Image
            src={course.thumbnail || `/placeholder.svg?height=400&width=800&query=${encodeURIComponent(course.title)}`}
            alt={course.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <Button size="lg" className="bg-white text-black hover:bg-gray-100">
              <Play className="h-6 w-6 mr-2" />
              Preview do Curso
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={levelColors[course.level]}>{levelLabels[course.level]}</Badge>
                <Badge variant="outline">{course.category}</Badge>
              </div>

              <h1 className="text-3xl font-bold">{course.title}</h1>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{course.stats?.enrolled_students || 0} alunos</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.8 (120 avaliações)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4" />
                  <span>{course.stats?.certificates_issued || 0} certificados</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={course.instructor_avatar || "/placeholder.svg"} />
                  <AvatarFallback>{course.instructor_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{course.instructor_name}</p>
                  <p className="text-sm text-gray-600">Instrutor</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Sobre o Curso</h2>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
            </div>

            {/* Course Content */}
            {course.modules && course.modules.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Conteúdo do Curso</h2>
                <div className="text-sm text-gray-600 mb-4">
                  {course.modules.length} módulos •{" "}
                  {course.modules.reduce((acc, module) => acc + (module.lessons_count || 0), 0)} aulas
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {course.modules.map((module, index) => (
                    <AccordionItem key={module.id} value={`module-${index}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center justify-between w-full mr-4">
                          <span className="font-medium">{module.title}</span>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{module.lessons_count || 0} aulas</span>
                            <span>{Math.floor((module.total_duration || 0) / 60)}min</span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pl-4">
                          {module.lessons?.map((lesson) => (
                            <div key={lesson.id} className="flex items-center space-x-3 py-2">
                              <Play className="h-4 w-4 text-gray-400" />
                              <span className="flex-1">{lesson.title}</span>
                              <span className="text-sm text-gray-500">
                                {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, "0")}
                              </span>
                            </div>
                          )) || <p className="text-gray-500 py-2">Nenhuma aula disponível</p>}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {course.price > 0 ? (
                    <span className="text-3xl font-bold text-blue-600">R$ {course.price.toFixed(2)}</span>
                  ) : (
                    <span className="text-3xl font-bold text-green-600">Gratuito</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEnrolled ? (
                  <Button className="w-full" asChild>
                    <a href={`/my-courses/${course.id}`}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Continuar Curso
                    </a>
                  </Button>
                ) : (
                  <Button className="w-full" onClick={handleEnroll} disabled={enrolling}>
                    {enrolling ? "Matriculando..." : "Matricular-se"}
                  </Button>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Nível:</span>
                    <span className="font-medium">{levelLabels[course.level]}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Duração:</span>
                    <span className="font-medium">
                      {course.modules?.reduce((acc, module) => acc + (module.total_duration || 0), 0)
                        ? `${Math.floor(course.modules.reduce((acc, module) => acc + (module.total_duration || 0), 0) / 3600)}h ${Math.floor((course.modules.reduce((acc, module) => acc + (module.total_duration || 0), 0) % 3600) / 60)}min`
                        : "A definir"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Certificado:</span>
                    <span className="font-medium">Sim</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Acesso:</span>
                    <span className="font-medium">Vitalício</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What you'll learn */}
            <Card>
              <CardHeader>
                <CardTitle>O que você vai aprender</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    "Fundamentos sólidos da tecnologia",
                    "Projetos práticos do mundo real",
                    "Melhores práticas da indústria",
                    "Técnicas avançadas e otimizações",
                    "Como aplicar o conhecimento no trabalho",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
