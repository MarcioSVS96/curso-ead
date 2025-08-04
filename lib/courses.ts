import { api } from "./api"

export interface Course {
  id: number
  title: string
  description: string
  instructor_id: number
  instructor_name: string
  instructor_avatar?: string
  category: string
  level: "beginner" | "intermediate" | "advanced"
  price: number
  thumbnail?: string
  is_published: boolean
  is_approved: boolean
  created_at: string
  enrolled_students?: number
  modules?: Module[]
  stats?: {
    enrolled_students: number
    average_score: number
    certificates_issued: number
  }
}

export interface Module {
  id: number
  course_id: number
  title: string
  description: string
  order_index: number
  lessons_count: number
  total_duration: number
  lessons?: Lesson[]
}

export interface Lesson {
  id: number
  module_id: number
  title: string
  content: string
  video_url?: string
  duration: number
  order_index: number
  completed?: boolean
  watched_duration?: number
  completed_at?: string
}

export interface Enrollment {
  id: number
  student_id: number
  course_id: number
  enrolled_at: string
  completed_at?: string
  progress: number
  title: string
  description: string
  thumbnail?: string
  level: string
  instructor_name: string
  total_lessons: number
  completed_lessons: number
}

export const courseService = {
  async getCourses(params?: {
    page?: number
    limit?: number
    category?: string
    level?: string
    instructor_id?: number
  }) {
    const response = await api.get("/courses", { params })
    return response.data
  },

  async getCourseById(id: number): Promise<{ course: Course }> {
    const response = await api.get(`/courses/${id}`)
    return response.data
  },

  async createCourse(data: {
    title: string
    description: string
    category: string
    level: string
    price?: number
  }): Promise<{ course: Course }> {
    const response = await api.post("/courses", data)
    return response.data
  },

  async updateCourse(id: number, data: Partial<Course>): Promise<{ course: Course }> {
    const response = await api.put(`/courses/${id}`, data)
    return response.data
  },

  async deleteCourse(id: number) {
    const response = await api.delete(`/courses/${id}`)
    return response.data
  },

  async approveCourse(id: number, approved: boolean) {
    const response = await api.patch(`/courses/${id}/approve`, { approved })
    return response.data
  },
}

export const enrollmentService = {
  async enrollInCourse(courseId: number) {
    const response = await api.post(`/enrollments/courses/${courseId}`)
    return response.data
  },

  async getMyEnrollments(params?: { page?: number; limit?: number }) {
    const response = await api.get("/enrollments/my-courses", { params })
    return response.data
  },

  async getCourseProgress(courseId: number) {
    const response = await api.get(`/enrollments/courses/${courseId}/progress`)
    return response.data
  },

  async updateLessonProgress(
    lessonId: number,
    data: {
      completed: boolean
      watchedDuration?: number
    },
  ) {
    const response = await api.put(`/enrollments/lessons/${lessonId}/progress`, data)
    return response.data
  },
}
