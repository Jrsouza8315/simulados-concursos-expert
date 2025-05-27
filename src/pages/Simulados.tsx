
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Clock, Filter, Book, CheckCircle } from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset
} from '@/components/ui/sidebar';
import Header from '@/components/Header';

const Simulados = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    banca: '',
    cargo: '',
    disciplina: '',
    ano: ''
  });

  const simulados = [
    {
      title: "Simulado TRT - Analista Judiciário",
      questions: 50,
      time: 180,
      difficulty: "Médio",
      subjects: ["Direito Constitucional", "Direito Administrativo", "Português"]
    },
    {
      title: "Simulado Receita Federal - Auditor",
      questions: 70,
      time: 240,
      difficulty: "Difícil",
      subjects: ["Direito Tributário", "Contabilidade", "Matemática"]
    },
    {
      title: "Simulado INSS - Técnico",
      questions: 40,
      time: 120,
      difficulty: "Fácil",
      subjects: ["Direito Previdenciário", "Informática", "Português"]
    }
  ];

  const FilterSidebar = () => (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-6 p-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banca Organizadora
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="">Todas as bancas</option>
                  <option value="cespe">CESPE/CEBRASPE</option>
                  <option value="fcc">FCC</option>
                  <option value="fgv">FGV</option>
                  <option value="vunesp">VUNESP</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cargo
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="">Todos os cargos</option>
                  <option value="analista">Analista</option>
                  <option value="tecnico">Técnico</option>
                  <option value="auditor">Auditor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Disciplina
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="">Todas as disciplinas</option>
                  <option value="constitucional">Direito Constitucional</option>
                  <option value="administrativo">Direito Administrativo</option>
                  <option value="portugues">Português</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ano
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="">Todos os anos</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>

              <Button className="w-full bg-gradient-to-r from-primary-600 to-secondary-600">
                Aplicar Filtros
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <FilterSidebar />
        
        <SidebarInset>
          <Header />
          
          <div className="pt-20">
            {/* Page Header */}
            <div className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-4 mb-4">
                  <SidebarTrigger />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Simulados</h1>
                    <p className="text-gray-600">Pratique com provas reais e cronômetro para maximizar seu desempenho</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Simulados List */}
              <div className="space-y-6">
                {simulados.map((simulado, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {simulado.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {simulado.subjects.map((subject, subIndex) => (
                            <span key={subIndex} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        simulado.difficulty === 'Fácil' ? 'bg-green-100 text-green-800' :
                        simulado.difficulty === 'Médio' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {simulado.difficulty}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Book className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{simulado.questions} questões</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{simulado.time} minutos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Correção automática</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700">
                        Iniciar Simulado
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Ver Questões
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-12">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Anterior</Button>
                  <Button size="sm" className="bg-primary-600">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">Próximo</Button>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Simulados;
