
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, User, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold gradient-text">
              Ponto Simulado
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#inicio" className="text-gray-700 hover:text-primary-600 transition-colors">
              Início
            </a>
            <Link to="/concursos" className="text-gray-700 hover:text-primary-600 transition-colors">
              Concursos
            </Link>
            <Link to="/simulados" className="text-gray-700 hover:text-primary-600 transition-colors">
              Simulados
            </Link>
            <a href="#apostilas" className="text-gray-700 hover:text-primary-600 transition-colors">
              Apostilas
            </a>
            <a href="#planos" className="text-gray-700 hover:text-primary-600 transition-colors">
              Planos
            </a>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Buscar
            </Button>
            <Link to="/acesso">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Entrar
              </Button>
            </Link>
            <Link to="/acesso?tab=cadastro">
              <Button size="sm" className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700">
                Assinar Agora
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              <a href="#inicio" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Início
              </a>
              <Link to="/concursos" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Concursos
              </Link>
              <Link to="/simulados" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Simulados
              </Link>
              <a href="#apostilas" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Apostilas
              </a>
              <a href="#planos" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Planos
              </a>
              <div className="pt-4 space-y-2">
                <Link to="/acesso" className="block w-full">
                  <Button variant="outline" className="w-full">
                    Entrar
                  </Button>
                </Link>
                <Link to="/acesso?tab=cadastro" className="block w-full">
                  <Button className="w-full bg-gradient-to-r from-primary-600 to-secondary-600">
                    Assinar Agora
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
