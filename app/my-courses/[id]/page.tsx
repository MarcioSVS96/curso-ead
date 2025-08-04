"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { enrollmentService } from "@/lib/courses"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle, Play, Clock, FileText, Award } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Module {
  id: number
  title: string
  order_index: number
  lessons: Lesson[]
}

interface Lesson {
  id: number
  title: string
  duration: number
  order_index: number
  completed: boolean
  watched_duration: number
  completed_at?: string
}

interface CourseProgress {
  modules: Module[]
  stats: {
    total_lessons: number
    completed_lessons: number
    progress_percentage: number
  }
}

export default function CoursePlayerPage() {
  const [progress, setProgress] = useState<CourseProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const { id } = useParams()
  const { user } = useAuth()

  useEffect(() => {
    if (user && id) {
      loadProgress()
    }
  }, [user, id])

  const loadProgress = async () => {
    try {
      const data = await enrollmentService.getCourseProgress(Number(id))
      setProgress(data)

      // Definir primeira aula não concluída como atual
      const firstIncompleteLesson = data.modules.flatMap((m) => m.lessons).find((l) => !l.completed)

      if (firstIncompleteLesson) {
        setCurrentLesson(firstIncompleteLesson)
      } else if (data.modules[0]?.lessons[0]) {
        setCurrentLesson(data.modules[0].lessons[0])
      }
    } catch (error) {
      console.error("Erro ao carregar progresso:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar o progresso do curso",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const markLessonAsCompleted = async (lessonId: number) => {
    try {
      await enrollmentService.updateLessonProgress(lessonId, {
        completed: true,
        watchedDuration: currentLesson?.duration || 0,
      })

      // Atualizar estado local
      if (progress) {
        const updatedModules = progress.modules.map((module) => ({
          ...module,
          lessons: module.lessons.map((lesson) =>
            lesson.id === lessonId ? { ...lesson, completed: true, completed_at: new Date().toISOString() } : lesson,
          ),
        }))

        const completedLessons = updatedModules.flatMap((m) => m.lessons).filter((l) => l.completed).length

        setProgress({
          ...progress,
          modules: updatedModules,
          stats: {
            ...progress.stats,
            completed_lessons: completedLessons,
            progress_percentage: Math.round((completedLessons / progress.stats.total_lessons) * 100),
          },
        })
      }

      toast({
        title: "Sucesso!",
        description: "Aula marcada como concluída",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o progresso",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded" />
            <div className="h-96 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!progress) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Curso não encontrado</h1>
          <p className="text-gray-600 mt-2">Você não tem acesso a este curso.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Curso em Andamento</h1>
            <p className="text-gray-600">
              {progress.stats.completed_lessons} de {progress.stats.total_lessons} aulas concluídas
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-4 py-2">
            {progress.stats.progress_percentage}% Concluído
          </Badge>
        </div>

        {/* Progress Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progresso Geral</span>
                <span className="text-sm text-gray-600">{progress.stats.progress_percentage}%</span>
              </div>
              <Progress value={progress.stats.progress_percentage} className="h-3" />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{currentLesson?.title || "Selecione uma aula"}</span>
                  {currentLesson && !currentLesson.completed && (
                    <Button onClick={() => markLessonAsCompleted(currentLesson.id)} size="sm">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Marcar como Concluída
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
                  {currentLesson ? (
                    <div className="text-center text-white">
                      <Play className="h-16 w-16 mx-auto mb-4" />
                      <p className="text-lg">Reproduzir: {currentLesson.title}</p>
                      <p className="text-sm text-gray-300">
                        Duração: {Math.floor(currentLesson.duration / 60)}:
                        {(currentLesson.duration % 60).toString().padStart(2, "0")}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center text-white">
                      <FileText className="h-16 w-16 mx-auto mb-4" />
                      <p className="text-lg">Selecione uma aula para começar</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Lesson Info */}
            {currentLesson && (
              <Card>
                <CardHeader>
                  <CardTitle>Sobre esta aula</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{Math.floor(currentLesson.duration / 60)} minutos</span>
                      </div>
                      {currentLesson.completed && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>Concluída</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700">
                      Conteúdo da aula será exibido aqui. Esta é uma demonstração da estrutura da plataforma.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Course Content */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo do Curso</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {progress.modules.map((module, index) => (
                    <AccordionItem key={module.id} value={`module-${index}`}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center justify-between w-full mr-4">
                          <span className="font-medium">{module.title}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              {module.lessons.filter((l) => l.completed).length}/{module.lessons.length}
                            </span>
                            <div className="w-16 h-2 bg-gray-200 rounded-full">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{
                                  width: `${(module.lessons.filter((l) => l.completed).length / module.lessons.length) * 100}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 pl-4">
                          {module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className={`flex items-center space-x-3 py-2 px-3 rounded cursor-pointer hover:bg-gray-50 ${
                                currentLesson?.id === lesson.id ? "bg-blue-50 border border-blue-200" : ""
                              }`}
                              onClick={() => setCurrentLesson(lesson)}
                            >
                              {lesson.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Play className="h-4 w-4 text-gray-400" />
                              )}
                              <span className="flex-1 text-sm">{lesson.title}</span>
                              <span className="text-xs text-gray-500">
                                {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, "0")}
                              </span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Certificate */}
            {progress.stats.progress_percentage === 100 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <span>Certificado</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Parabéns! Você concluiu o curso e pode baixar seu certificado.
                  </p>
                  <Button className="w-full">
                    <Award className="h-4 w-4 mr-2" />
                    Baixar Certificado
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
