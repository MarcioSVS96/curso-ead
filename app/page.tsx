"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CourseCard } from "@/components/CourseCard"
import { type Course, courseService } from "@/lib/courses"
import { BookOpen, Users, Award, TrendingUp } from "lucide-react"

export default function HomePage() {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedCourses = async () => {
      try {
        const { courses } = await courseService.getCourses({ limit: 6 })
        setFeaturedCourses(courses)
      } catch (error) {
        console.error("Erro ao carregar cursos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedCourses()
  }, [])

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-5xl font-bold leading-tight">Transforme sua carreira com os melhores cursos online</h1>
            <p className="text-xl text-blue-100">
              Aprenda com especialistas, pratique com projetos reais e conquiste certificados reconhecidos pelo mercado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/courses">Explorar Cursos</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
                asChild
              >
                <Link href="/auth/register">Começar Gratuitamente</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center space-y-2">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold">500+</h3>
            <p className="text-gray-600">Cursos Disponíveis</p>
          </div>
          <div className="text-center space-y-2">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-3xl font-bold">50K+</h3>
            <p className="text-gray-600">Alunos Ativos</p>
          </div>
          <div className="text-center space-y-2">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-3xl font-bold">25K+</h3>
            <p className="text-gray-600">Certificados Emitidos</p>
          </div>
          <div className="text-center space-y-2">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-3xl font-bold">95%</h3>
            <p className="text-gray-600">Taxa de Satisfação</p>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">Cursos em Destaque</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubra os cursos mais populares e bem avaliados da nossa plataforma
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" asChild>
            <Link href="/courses">Ver Todos os Cursos</Link>
          </Button>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold">Categorias Populares</h2>
            <p className="text-gray-600">Encontre o curso perfeito para sua área de interesse</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Programação", count: "120+ cursos", color: "bg-blue-500" },
              { name: "Design", count: "80+ cursos", color: "bg-purple-500" },
              { name: "Marketing", count: "60+ cursos", color: "bg-green-500" },
              { name: "Negócios", count: "90+ cursos", color: "bg-orange-500" },
              { name: "Fotografia", count: "40+ cursos", color: "bg-pink-500" },
              { name: "Música", count: "30+ cursos", color: "bg-indigo-500" },
              { name: "Idiomas", count: "50+ cursos", color: "bg-red-500" },
              { name: "Culinária", count: "25+ cursos", color: "bg-yellow-500" },
            ].map((category) => (
              <Link key={category.name} href={`/courses?category=${category.name}`} className="group">
                <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                  <div
                    className={`w-16 h-16 ${category.color} rounded-full mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  />
                  <h3 className="font-semibold text-lg">{category.name}</h3>
                  <p className="text-gray-600 text-sm">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold">Pronto para começar sua jornada de aprendizado?</h2>
            <p className="text-gray-300 text-lg">
              Junte-se a milhares de alunos que já transformaram suas carreiras com nossos cursos.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link href="/auth/register">Criar Conta Gratuita</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
