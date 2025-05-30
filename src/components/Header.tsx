
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, User, Search, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getDashboardLink = () => {
    switch (userProfile?.role) {
      case 'admin':
        return '/admin';
      case 'assinante':
        return '/dashboard';
      case 'visitante':
        return '/visitante';
      default:
        return '/';
    }
  };

  const canAccessSimulados = userProfile?.role === 'assinante' || userProfile?.role === 'admin';

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
            <Link to="/" className="text-gray-700 hover:text-primary-600 transition-colors">
              Início
            </Link>
            <Link to="/concursos" className="text-gray-700 hover:text-primary-600 transition-colors">
              Concursos
            </Link>
            {canAccessSimulados ? (
              <Link to="/simulados" className="text-gray-700 hover:text-primary-600 transition-colors">
                Simulados
              </Link>
            ) : (
              <span className="text-gray-400 cursor-not-allowed">
                Simulados
              </span>
            )}
            <Link to="/apostilas" className="text-gray-700 hover:text-primary-600 transition-colors">
              Apostilas
            </Link>
            {!user && (
              <Link to="/planos" className="text-gray-700 hover:text-primary-600 transition-colors">
                Planos
              </Link>
            )}
            {user && (
              <Link to={getDashboardLink()} className="text-gray-700 hover:text-primary-600 transition-colors">
                {userProfile?.role === 'admin' ? 'Admin' : 'Dashboard'}
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Buscar
            </Button>
            
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {userProfile?.email}
                  {userProfile?.role && (
                    <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded capitalize">
                      {userProfile.role}
                    </span>
                  )}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </div>
            ) : (
              <>
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
              </>
            )}
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
              <Link to="/" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Início
              </Link>
              <Link to="/concursos" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Concursos
              </Link>
              {canAccessSimulados ? (
                <Link to="/simulados" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Simulados
                </Link>
              ) : (
                <span className="block px-3 py-2 text-gray-400">
                  Simulados (Premium)
                </span>
              )}
              <Link to="/apostilas" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Apostilas
              </Link>
              {!user && (
                <Link to="/planos" className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Planos
                </Link>
              )}
              {user && (
                <Link to={getDashboardLink()} className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  {userProfile?.role === 'admin' ? 'Admin' : 'Dashboard'}
                </Link>
              )}
              
              <div className="pt-4 space-y-2">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm text-gray-600">
                      {userProfile?.email}
                      {userProfile?.role && (
                        <span className="block mt-1 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded capitalize w-fit">
                          {userProfile.role}
                        </span>
                      )}
                    </div>
                    <Button variant="outline" onClick={handleSignOut} className="w-full">
                      Sair
                    </Button>
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
