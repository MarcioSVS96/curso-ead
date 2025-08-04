"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { courseService } from "@/lib/courses"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewCoursePage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    level: "beginner",
    price: 0,
  })
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { course } = await courseService.createCourse(formData)
      toast({
        title: "Sucesso!",
        description: "Curso criado com sucesso",
      })
      router.push(`/instructor/courses/${course.id}/edit`)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.error || "Erro ao criar curso",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (user?.role !== "instructor") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Acesso Negado</h1>
          <p className="text-gray-600 mt-2">Apenas instrutores podem criar cursos.</p>
        </div>
      </div>
    )
  }

  const categories = [
    "Programming",
    "Design",
    "Marketing",
    "Business",
    "Photography",
    "Music",
    "Languages",
    "Cooking",
    "Health",
    "Technology",
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/instructor/courses">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Criar Novo Curso</h1>
            <p className="text-gray-600 mt-2">Preencha as informações básicas do seu curso</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Informações do Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título do Curso *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: JavaScript Completo do Zero ao Avançado"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o que os alunos vão aprender neste curso..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Nível *</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Iniciante</SelectItem>
                      <SelectItem value="intermediate">Intermediário</SelectItem>
                      <SelectItem value="advanced">Avançado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Preço (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
                <p className="text-sm text-gray-600">Deixe 0 para curso gratuito</p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? "Criando..." : "Criar Curso"}
                </Button>
                <Button type="button" variant="outline" asChild className="bg-transparent">
                  <Link href="/instructor/courses">Cancelar</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
