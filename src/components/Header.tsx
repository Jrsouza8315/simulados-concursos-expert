import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, User, Search, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { getFullUrl } from "../utils/url";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { userProfile, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href =
        "https://jrsouza8315.github.io/simulados-concursos-expert/";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getDashboardLink = () => {
    if (userProfile?.email === "hbrcomercialssa@gmail.com") {
      return "https://jrsouza8315.github.io/simulados-concursos-expert/admin.html";
    }

    switch (userProfile?.role) {
      case "admin":
        return "https://jrsouza8315.github.io/simulados-concursos-expert/admin.html";
      case "assinante":
        return "https://jrsouza8315.github.io/simulados-concursos-expert/dashboard.html";
      case "visitante":
        return "https://jrsouza8315.github.io/simulados-concursos-expert/visitante.html";
      default:
        return "https://jrsouza8315.github.io/simulados-concursos-expert/";
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center -ml-3">
            <a
              href="https://jrsouza8315.github.io/simulados-concursos-expert/"
              className="flex items-center"
            >
              <img
                src="https://raw.githubusercontent.com/Jrsouza8315/simulados-concursos-expert/main/public/images/logo.png"
                alt="PONTO"
                className="h-12 w-auto object-contain"
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href={getFullUrl("/")}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Início
            </a>
            <a
              href={getFullUrl("/concursos")}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Concursos
            </a>
            <a
              href={getFullUrl("/simulados")}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Simulados
            </a>
            <a
              href={getFullUrl("/apostilas")}
              className="text-gray-700 hover:text-primary-600 transition-colors"
            >
              Apostilas
            </a>
            {!userProfile && (
              <a
                href={getFullUrl("/planos")}
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                Planos
              </a>
            )}
            {userProfile && (
              <a
                href={getFullUrl(getDashboardLink())}
                className="text-gray-700 hover:text-primary-600 transition-colors"
              >
                {userProfile.role === "admin" ? "Admin" : "Dashboard"}
              </a>
            )}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Buscar
            </Button>

            {userProfile ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {userProfile.email}
                  {userProfile.role && (
                    <span className="ml-2 px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded capitalize">
                      {userProfile.role}
                    </span>
                  )}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sair
                </Button>
              </div>
            ) : (
              <>
                <a href={getFullUrl("/acesso")}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Entrar
                  </Button>
                </a>
                <a href={getFullUrl("/acesso?tab=cadastro")}>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700"
                  >
                    Assinar Agora
                  </Button>
                </a>
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
              <a
                href={getFullUrl("/")}
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Início
              </a>
              <a
                href={getFullUrl("/concursos")}
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Concursos
              </a>
              <a
                href={getFullUrl("/simulados")}
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Simulados
              </a>
              <a
                href={getFullUrl("/apostilas")}
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Apostilas
              </a>
              {!userProfile && (
                <a
                  href={getFullUrl("/planos")}
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Planos
                </a>
              )}
              {userProfile && (
                <a
                  href={getFullUrl(getDashboardLink())}
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  {userProfile.role === "admin" ? "Admin" : "Dashboard"}
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
