"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, User, LogOut, Settings, PlusCircle } from "lucide-react"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <span className="text-2xl font-bold text-gray-900">EduPlatform</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/courses" className="text-gray-600 hover:text-gray-900">
            Cursos
          </Link>
          {user?.role === "instructor" && (
            <Link href="/instructor/courses" className="text-gray-600 hover:text-gray-900">
              Meus Cursos
            </Link>
          )}
          {user?.role === "admin" && (
            <Link href="/admin/dashboard" className="text-gray-600 hover:text-gray-900">
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {user.role === "instructor" && (
                <Button asChild variant="outline" size="sm">
                  <Link href="/instructor/courses/new">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Criar Curso
                  </Link>
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      Perfil
                    </Link>
                  </DropdownMenuItem>
                  {user.role === "student" && (
                    <DropdownMenuItem asChild>
                      <Link href="/my-courses">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Meus Cursos
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Configurações
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Entrar</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Cadastrar</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
