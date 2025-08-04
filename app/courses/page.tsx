"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CourseCard } from "@/components/CourseCard"
import { type Course, courseService } from "@/lib/courses"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter } from "lucide-react"

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  })

  const searchParams = useSearchParams()

  useEffect(() => {
    const category = searchParams.get("category")
    const level = searchParams.get("level")

    if (category) setSelectedCategory(category)
    if (level) setSelectedLevel(level)
  }, [searchParams])

  useEffect(() => {
    loadCourses()
  }, [pagination.page, selectedCategory, selectedLevel])

  const loadCourses = async () => {
    setLoading(true)
    try {
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      }

      if (selectedCategory !== "all") params.category = selectedCategory
      if (selectedLevel !== "all") params.level = selectedLevel

      const response = await courseService.getCourses(params)
      setCourses(response.courses)
      setPagination((prev) => ({
        ...prev,
        total: response.pagination.total,
        pages: response.pagination.pages,
      }))
    } catch (error) {
      console.error("Erro ao carregar cursos:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    // Implementar busca por texto
    loadCourses()
  }

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }))
  }

  const categories = ["Programming", "Design", "Marketing", "Business", "Photography", "Music", "Languages", "Cooking"]

  const levels = [
    { value: "beginner", label: "Iniciante" },
    { value: "intermediate", label: "Intermediário" },
    { value: "advanced", label: "Avançado" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Explore Nossos Cursos</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubra cursos de alta qualidade ministrados por especialistas da indústria
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Buscar cursos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <Button onClick={handleSearch} size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as categorias</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Nível</label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os níveis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os níveis</SelectItem>
                    {levels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCategory("all")
                    setSelectedLevel("all")
                    setSearchTerm("")
                    setPagination((prev) => ({ ...prev, page: 1 }))
                  }}
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">{loading ? "Carregando..." : `${pagination.total} cursos encontrados`}</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-80" />
              ))}
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum curso encontrado</p>
              <p className="text-gray-400">Tente ajustar os filtros de busca</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Anterior
              </Button>

              {[...Array(Math.min(5, pagination.pages))].map((_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={pagination.page === page ? "default" : "outline"}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                )
              })}

              <Button
                variant="outline"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
