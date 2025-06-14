import { Home, FileText, BookOpen, BarChart2, Settings } from "lucide-react";

interface SidebarProps {
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export function Sidebar({ currentSection, onSectionChange }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "questions", label: "Questões", icon: FileText },
    { id: "apostilas", label: "Apostilas", icon: BookOpen },
    { id: "statistics", label: "Estatísticas", icon: BarChart2 },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Ponto Simulado</h1>
        <p className="text-sm text-gray-600">Painel Administrativo</p>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
                currentSection === item.id
                  ? "bg-gray-100 border-r-4 border-blue-500"
                  : ""
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
