
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, MapPin } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Pagination, 
  PaginationContent, 
  PaginationEllipsis, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

// Tipos de dados
type Concurso = {
  id: string;
  titulo: string;
  orgao: string;
  nivel: string;
  vagas: number;
  salarioInicial: string;
  dataInscricaoInicio: string;
  dataInscricaoFim: string;
  taxaInscricao: string;
  estado?: string;
  regiao?: string;
  editalUrl?: string;
  nacional: boolean;
};

// Dados de exemplo
const concursosData: Concurso[] = [
  {
    id: "1",
    titulo: "Analista Administrativo",
    orgao: "Tribunal Regional Federal",
    nivel: "Superior",
    vagas: 25,
    salarioInicial: "R$ 12.455,30",
    dataInscricaoInicio: "2025-06-01",
    dataInscricaoFim: "2025-07-01",
    taxaInscricao: "R$ 110,00",
    estado: "SP",
    regiao: "Sudeste",
    editalUrl: "#",
    nacional: false
  },
  {
    id: "2",
    titulo: "Técnico Judiciário",
    orgao: "Tribunal de Justiça",
    nivel: "Médio",
    vagas: 50,
    salarioInicial: "R$ 7.591,37",
    dataInscricaoInicio: "2025-05-15",
    dataInscricaoFim: "2025-06-15",
    taxaInscricao: "R$ 95,00",
    estado: "RJ",
    regiao: "Sudeste",
    editalUrl: "#",
    nacional: false
  },
  {
    id: "3",
    titulo: "Auditor Fiscal",
    orgao: "Receita Federal",
    nivel: "Superior",
    vagas: 230,
    salarioInicial: "R$ 21.029,09",
    dataInscricaoInicio: "2025-06-10",
    dataInscricaoFim: "2025-07-10",
    taxaInscricao: "R$ 180,00",
    editalUrl: "#",
    nacional: true
  },
  {
    id: "4",
    titulo: "Agente Administrativo",
    orgao: "Polícia Federal",
    nivel: "Médio",
    vagas: 150,
    salarioInicial: "R$ 4.746,16",
    dataInscricaoInicio: "2025-07-01",
    dataInscricaoFim: "2025-08-01",
    taxaInscricao: "R$ 90,00",
    editalUrl: "#",
    nacional: true
  },
  {
    id: "5",
    titulo: "Professor",
    orgao: "Secretaria de Educação",
    nivel: "Superior",
    vagas: 120,
    salarioInicial: "R$ 4.420,55",
    dataInscricaoInicio: "2025-05-20",
    dataInscricaoFim: "2025-06-20",
    taxaInscricao: "R$ 85,00",
    estado: "BA",
    regiao: "Nordeste",
    editalUrl: "#",
    nacional: false
  },
  {
    id: "6",
    titulo: "Analista de Sistemas",
    orgao: "Tribunal Superior Eleitoral",
    nivel: "Superior",
    vagas: 35,
    salarioInicial: "R$ 13.994,78",
    dataInscricaoInicio: "2025-08-01",
    dataInscricaoFim: "2025-09-01",
    taxaInscricao: "R$ 130,00",
    estado: "DF",
    regiao: "Centro-Oeste",
    editalUrl: "#",
    nacional: false
  },
  {
    id: "7",
    titulo: "Enfermeiro",
    orgao: "Hospital Universitário",
    nivel: "Superior",
    vagas: 45,
    salarioInicial: "R$ 6.500,00",
    dataInscricaoInicio: "2025-06-05",
    dataInscricaoFim: "2025-07-05",
    taxaInscricao: "R$ 90,00",
    estado: "RS",
    regiao: "Sul",
    editalUrl: "#",
    nacional: false
  },
  {
    id: "8",
    titulo: "Fiscal Ambiental",
    orgao: "IBAMA",
    nivel: "Superior",
    vagas: 80,
    salarioInicial: "R$ 8.814,05",
    dataInscricaoInicio: "2025-07-15",
    dataInscricaoFim: "2025-08-15",
    taxaInscricao: "R$ 110,00",
    estado: "AM",
    regiao: "Norte",
    editalUrl: "#",
    nacional: false
  }
];

// Mapeamento das regiões e estados
const regioes = {
  "Norte": ["AC", "AP", "AM", "PA", "RO", "RR", "TO"],
  "Nordeste": ["AL", "BA", "CE", "MA", "PB", "PE", "PI", "RN", "SE"],
  "Centro-Oeste": ["DF", "GO", "MT", "MS"],
  "Sudeste": ["ES", "MG", "RJ", "SP"],
  "Sul": ["PR", "RS", "SC"]
};

const Concursos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("todos");

  // Filtrar concursos baseado na busca e na tab selecionada
  const filteredConcursos = concursosData.filter(concurso => {
    const matchesSearch = 
      concurso.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
      concurso.orgao.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (currentTab === "todos") return matchesSearch;
    if (currentTab === "nacionais") return matchesSearch && concurso.nacional;
    
    // Se for uma região específica
    if (Object.keys(regioes).includes(currentTab)) {
      return matchesSearch && concurso.regiao === currentTab;
    }
    
    // Se for um estado específico
    return matchesSearch && concurso.estado === currentTab;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        <section className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Concursos Abertos</h1>
          <p className="text-gray-600 mb-6">
            Encontre os principais concursos abertos em todo o Brasil, organizados por região e data de inscrição.
          </p>
          
          {/* Barra de pesquisa */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Pesquise por cargo ou órgão..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Tabs para selecionar regiões */}
          <Tabs defaultValue="todos" onValueChange={setCurrentTab}>
            <TabsList className="mb-4 flex overflow-x-auto pb-2 space-x-1">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="nacionais">Nacionais</TabsTrigger>
              {Object.keys(regioes).map(regiao => (
                <TabsTrigger key={regiao} value={regiao}>
                  {regiao}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="todos" className="mt-4">
              <ConcursosTable concursos={filteredConcursos} />
            </TabsContent>
            
            <TabsContent value="nacionais" className="mt-4">
              <ConcursosTable concursos={filteredConcursos} />
            </TabsContent>
            
            {Object.keys(regioes).map(regiao => (
              <TabsContent key={regiao} value={regiao} className="mt-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-2">Estados da região {regiao}:</h3>
                  <div className="flex flex-wrap gap-2">
                    {regioes[regiao as keyof typeof regioes].map(estado => (
                      <Button 
                        key={estado} 
                        variant="outline" 
                        size="sm"
                        onClick={() => setCurrentTab(estado)}
                        className={currentTab === estado ? "bg-primary text-primary-foreground" : ""}
                      >
                        <MapPin className="h-4 w-4 mr-1" />
                        {estado}
                      </Button>
                    ))}
                  </div>
                </div>
                <ConcursosTable concursos={filteredConcursos} />
              </TabsContent>
            ))}
            
            {/* Conteúdo para tabs de estados */}
            {Object.values(regioes).flat().map(estado => (
              <TabsContent key={estado} value={estado} className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Concursos em {estado}
                    </CardTitle>
                    <CardDescription>
                      Listando concursos disponíveis para o estado de {estado}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ConcursosTable concursos={filteredConcursos} />
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

// Componente da tabela de concursos
const ConcursosTable = ({ concursos }: { concursos: Concurso[] }) => {
  return (
    <div>
      <div className="rounded-md border overflow-hidden mb-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Concurso</TableHead>
              <TableHead>Nível</TableHead>
              <TableHead>Vagas</TableHead>
              <TableHead>Salário</TableHead>
              <TableHead>Inscrições</TableHead>
              <TableHead>Taxa</TableHead>
              <TableHead>Edital</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {concursos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Nenhum concurso encontrado com os filtros selecionados.
                </TableCell>
              </TableRow>
            ) : (
              concursos.map((concurso) => (
                <TableRow key={concurso.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-bold">{concurso.titulo}</div>
                      <div className="text-sm text-gray-500">{concurso.orgao}</div>
                      {concurso.estado && !concurso.nacional && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {concurso.estado}
                        </div>
                      )}
                      {concurso.nacional && (
                        <div className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-md inline-block mt-1">
                          Nacional
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{concurso.nivel}</TableCell>
                  <TableCell>{concurso.vagas}</TableCell>
                  <TableCell>{concurso.salarioInicial}</TableCell>
                  <TableCell>
                    <div>
                      <div className="text-xs">Início: {formatDate(concurso.dataInscricaoInicio)}</div>
                      <div className="text-xs">Fim: {formatDate(concurso.dataInscricaoFim)}</div>
                      {isInscritionActive(concurso.dataInscricaoInicio, concurso.dataInscricaoFim) && (
                        <div className="bg-secondary/20 text-secondary text-xs px-2 py-0.5 rounded-md inline-block mt-1">
                          Inscrições abertas
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{concurso.taxaInscricao}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Edital
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Paginação */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

// Funções de formatação e utilidades
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
};

const isInscritionActive = (start: string, end: string) => {
  const now = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  return now >= startDate && now <= endDate;
};

export default Concursos;
