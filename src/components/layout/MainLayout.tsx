import { Link } from "react-router-dom";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="header">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold">
            Simulados Concursos
          </Link>
          <nav className="space-x-6">
            <Link to="/simulados" className="nav-link">
              Simulados
            </Link>
            <Link to="/concursos" className="nav-link">
              Concursos
            </Link>
            <Link to="/apostilas" className="nav-link">
              Apostilas
            </Link>
            <Link to="/planos" className="btn-secondary">
              Assinar
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content container mx-auto">
        <div className="max-w-7xl mx-auto py-8">{children}</div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral/20 py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Sobre</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/sobre" className="text-link">
                    Quem Somos
                  </Link>
                </li>
                <li>
                  <Link to="/contato" className="text-link">
                    Contato
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Produtos</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/simulados" className="text-link">
                    Simulados
                  </Link>
                </li>
                <li>
                  <Link to="/apostilas" className="text-link">
                    Apostilas
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/ajuda" className="text-link">
                    Ajuda
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-link">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacidade" className="text-link">
                    Privacidade
                  </Link>
                </li>
                <li>
                  <Link to="/termos" className="text-link">
                    Termos de Uso
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-neutral text-center text-sm">
            © {new Date().getFullYear()} Simulados Concursos. Todos os direitos
            reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
