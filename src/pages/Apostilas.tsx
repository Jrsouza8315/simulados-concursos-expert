
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Filter, Book, Star, Clock } from 'lucide-react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarHeader
} from '@/components/ui/sidebar';
import Header from '@/components/Header';

const Apostilas = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    categoria: '',
    nivel: '',
    banca: '',
    preco: ''
  });

  const apostilas = [
    {
      title: "Direito Constitucional Completo",
      author: "Prof. João Silva",
      category: "Direito",
      level: "Básico ao Avançado",
      pages: 350,
      price: "R$ 49,90",
      rating: 4.8,
      downloads: 1250,
      description: "Apostila completa de Direito Constitucional com teoria, exercícios e jurisprudência atualizada.",
      topics: ["Princípios Fundamentais", "Direitos e Garantias", "Organização do Estado", "Poder Judiciário"]
    },
    {
      title: "Matemática para Concursos",
      author: "Prof. Maria Santos",
      category: "Exatas",
      level: "Básico",
      pages: 280,
      price: "R$ 39,90",
      rating: 4.9,
      downloads: 2100,
      description: "Matemática básica e financeira com foco em concursos públicos federais e estaduais.",
      topics: ["Aritmética", "Geometria", "Matemática Financeira", "Estatística Básica"]
    },
    {
      title: "Português - Gramática e Interpretação",
      author: "Prof. Ana Costa",
      category: "Linguagens",
      level: "Intermediário",
      pages: 420,
      price: "R$ 54,90",
      rating: 4.7,
      downloads: 1800,
      description: "Gramática completa e técnicas de interpretação de texto para todos os níveis de concurso.",
      topics: ["Sintaxe", "Morfologia", "Interpretação de Texto", "Redação Oficial"]
    },
    {
      title: "Direito Administrativo Essencial",
      author: "Prof. Carlos Oliveira",
      category: "Direito",
      level: "Avançado",
      pages: 380,
      price: "R$ 59,90",
      rating: 4.6,
      downloads: 950,
      description: "Direito Administrativo com foco na jurisprudência dos tribunais superiores.",
      topics: ["Atos Administrativos", "Licitações", "Contratos", "Responsabilidade Civil"]
    },
    {
      title: "Informática para Concursos",
      author: "Prof. Pedro Tech",
      category: "Tecnologia",
      level: "Básico ao Intermediário",
      pages: 220,
      price: "R$ 34,90",
      rating: 4.5,
      downloads: 1650,
      description: "Informática básica, pacote Office e conhecimentos de internet e segurança.",
      topics: ["Windows", "Office", "Internet", "Segurança Digital"]
    },
    {
      title: "Raciocínio Lógico Descomplicado",
      author: "Prof. Lucas Logic",
      category: "Exatas",
      level: "Básico ao Avançado",
      pages: 300,
      price: "R$ 44,90",
      rating: 4.8,
      downloads: 1400,
      description: "Raciocínio lógico e matemático com métodos práticos de resolução.",
      topics: ["Lógica Proposicional", "Sequências", "Probabilidade", "Análise Combinatória"]
    }
  ];

  const FilterSidebar = () => (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/87b6127e-8ce4-4418-a857-f04fdf1a552b.png" 
            alt="Ponto Simulado" 
            className="h-12 w-auto"
          />
        </div>
      </SidebarHeader>
      
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
                  Categoria
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="">Todas as categorias</option>
                  <option value="direito">Direito</option>
                  <option value="exatas">Exatas</option>
                  <option value="linguagens">Linguagens</option>
                  <option value="tecnologia">Tecnologia</option>
                  <option value="humanas">Humanas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nível
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="">Todos os níveis</option>
                  <option value="basico">Básico</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banca
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
                  Preço
                </label>
                <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option value="">Todos os preços</option>
                  <option value="gratuito">Gratuito</option>
                  <option value="ate30">Até R$ 30</option>
                  <option value="30a50">R$ 30 - R$ 50</option>
                  <option value="acima50">Acima de R$ 50</option>
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Apostilas</h1>
                    <p className="text-gray-600">Material de estudo de alta qualidade para sua aprovação</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Apostilas Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {apostilas.map((apostila, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {apostila.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">Por {apostila.author}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <Book className="h-4 w-4" />
                              {apostila.pages} páginas
                            </span>
                            <span className="flex items-center gap-1">
                              <Download className="h-4 w-4" />
                              {apostila.downloads}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 mb-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{apostila.rating}</span>
                          </div>
                          <span className="text-lg font-bold text-primary-600">{apostila.price}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {apostila.description}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                          {apostila.category}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                          {apostila.level}
                        </span>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Conteúdo:</h4>
                        <div className="flex flex-wrap gap-1">
                          {apostila.topics.slice(0, 2).map((topic, topicIndex) => (
                            <span key={topicIndex} className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                              {topic}
                            </span>
                          ))}
                          {apostila.topics.length > 2 && (
                            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                              +{apostila.topics.length - 2} mais
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button className="flex-1 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700">
                          <Download className="h-4 w-4 mr-2" />
                          Comprar
                        </Button>
                        <Button variant="outline" className="flex-1">
                          Prévia Gratuita
                        </Button>
                      </div>
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

export default Apostilas;
