import Link from "next/link"
import { BookOpen, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">EduPlatform</span>
            </div>
            <p className="text-gray-400">A melhor plataforma de cursos online para impulsionar sua carreira.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Cursos</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/courses?category=Programming" className="hover:text-white">
                  Programação
                </Link>
              </li>
              <li>
                <Link href="/courses?category=Design" className="hover:text-white">
                  Design
                </Link>
              </li>
              <li>
                <Link href="/courses?category=Marketing" className="hover:text-white">
                  Marketing
                </Link>
              </li>
              <li>
                <Link href="/courses?category=Business" className="hover:text-white">
                  Negócios
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white">
                  Carreiras
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>contato@eduplatform.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>(11) 9999-9999</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>São Paulo, SP</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 EduPlatform. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
