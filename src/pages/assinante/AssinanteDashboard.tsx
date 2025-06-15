import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Clock,
  Trophy,
  BarChart3,
  Download,
  Star,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import Header from "@/components/Header";

const AssinanteDashboard = () => {
  const { userProfile } = useAuth();

  const recentSimulados = [
    {
      id: 1,
      title: "TRT - Analista Judiciário",
      score: 85,
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Receita Federal - Auditor",
      score: 92,
      date: "2024-01-10",
    },
    { id: 3, title: "INSS - Técnico", score: 78, date: "2024-01-05" },
  ];

  return (
    <div className="min-h-screen bg-neutral-100">
      <Header />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-900">
              Área do Assinante
            </h1>
            <p className="text-gray-600 mt-2">
              Bem-vindo de volta, {userProfile?.email}! Continue sua preparação.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-l-4 border-l-primary-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Simulados Realizados
                </CardTitle>
                <BookOpen className="h-4 w-4 text-primary-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary-900">23</div>
                <p className="text-xs text-muted-foreground">+3 este mês</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-secondary-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Média de Acertos
                </CardTitle>
                <Trophy className="h-4 w-4 text-secondary-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary-700">85%</div>
                <p className="text-xs text-muted-foreground">
                  +5% desde o início
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-accent-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Horas de Estudo
                </CardTitle>
                <Clock className="h-4 w-4 text-accent-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent-700">127h</div>
                <p className="text-xs text-muted-foreground">
                  +12h esta semana
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Link to="/simulados">
              <Button className="w-full bg-primary-600 hover:bg-primary-700 h-20 flex-col">
                <BookOpen className="h-6 w-6 mb-2" />
                Fazer Simulado
              </Button>
            </Link>
            <Link to="/apostilas">
              <Button
                variant="outline"
                className="w-full h-20 flex-col border-secondary-300 text-secondary-600 hover:bg-secondary-50"
              >
                <Download className="h-6 w-6 mb-2" />
                Apostilas Exclusivas
              </Button>
            </Link>
            <Button
              variant="outline"
              className="w-full h-20 flex-col border-accent-300 text-accent-600 hover:bg-accent-50"
            >
              <BarChart3 className="h-6 w-6 mb-2" />
              Meu Desempenho
            </Button>
            <Button variant="outline" className="w-full h-20 flex-col">
              <Star className="h-6 w-6 mb-2" />
              Favoritos
            </Button>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Últimos Simulados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentSimulados.map((simulado) => (
                    <div
                      key={simulado.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium text-primary-900">
                          {simulado.title}
                        </p>
                        <p className="text-sm text-gray-500">{simulado.date}</p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-bold ${
                            simulado.score >= 80
                              ? "text-green-600"
                              : simulado.score >= 60
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {simulado.score}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benefícios Premium</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Simulados ilimitados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Apostilas exclusivas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Relatórios detalhados</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Suporte prioritário</span>
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      ✅ Sua assinatura está ativa até 15/12/2024
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssinanteDashboard;
