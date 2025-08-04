import Link from "next/link"
import Image from "next/image"
import type { Course } from "@/lib/courses"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Star } from "lucide-react"

interface CourseCardProps {
  course: Course
  showEnrollButton?: boolean
}

export function CourseCard({ course, showEnrollButton = true }: CourseCardProps) {
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

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative aspect-video">
          <Image
            src={course.thumbnail || `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(course.title)}`}
            alt={course.title}
            fill
            className="object-cover rounded-t-lg"
          />
          <div className="absolute top-2 right-2">
            <Badge className={levelColors[course.level]}>{levelLabels[course.level]}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4">
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs">
            {course.category}
          </Badge>

          <h3 className="font-semibold text-lg line-clamp-2">{course.title}</h3>

          <p className="text-gray-600 text-sm line-clamp-3">{course.description}</p>

          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={course.instructor_avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xs">{course.instructor_name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-gray-600">{course.instructor_name}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{course.enrolled_students || 0} alunos</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>4.8</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="w-full space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">
              {course.price > 0 ? `R$ ${course.price.toFixed(2)}` : "Gratuito"}
            </span>
          </div>

          {showEnrollButton && (
            <Button asChild className="w-full">
              <Link href={`/courses/${course.id}`}>Ver Curso</Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
