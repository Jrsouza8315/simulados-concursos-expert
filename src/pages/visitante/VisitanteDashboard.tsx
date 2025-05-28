
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, BookOpen, Newspaper, CreditCard, Star, Crown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

const VisitanteDashboard = () => {
  const { userProfile } = useAuth();

  const freeContent = [
    { id: 1, title: "Noções de Direito Constitucional", type: "Apostila", available: true },
    { id: 2, title: "Português para Concursos - Básico", type: "Apostila", available: true },
    { id: 3, title: "Edital TRT 2024 - Análise Completa", type: "Notícia", available: true },
    { id: 4, title: "Simulado Básico - Português", type: "Simulado", available: false },
    { id: 5, title: "Questões Comentadas - Direito Admin", type: "Simulado", available: false }
  ];

  const premiumFeatures = [
    "Acesso a todos os simulados",
    "Apostilas exclusivas e atualizadas",
    "Correções detalhadas com comentários",
    "Relatórios de desempenho",
    "Suporte prioritário",
    "Cronômetro avançado nos simulados"
  ];

  return (
    <div className="min-h-screen bg-neutral-100">
      <Header />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-900">
              Área Gratuita
            </h1>
            <p className="text-gray-600 mt-2">
              Olá, {userProfile?.email}! Explore nosso conteúdo gratuito.
            </p>
          </div>

          {/* Upgrade Banner */}
          <Card className="mb-8 bg-gradient-to-r from-secondary-50 to-accent-50 border-secondary-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Crown className="h-12 w-12 text-secondary-600" />
                  <div>
                    <h3 className="text-xl font-bold text-primary-900">
                      Desbloqueie Todo o Potencial!
                    </h3>
                    <p className="text-gray-600">
                      Tenha acesso completo aos simulados e materiais exclusivos
                    </p>
                  </div>
                </div>
                <Link to="/planos">
                  <Button className="bg-secondary-600 hover:bg-secondary-700 text-white">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Assinar Agora
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Free Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary-600" />
                  Conteúdo Disponível
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {freeContent.map((content) => (
                    <div key={content.id} className={`flex items-center justify-between p-3 border rounded-lg ${
                      content.available ? 'hover:bg-gray-50' : 'bg-gray-50 opacity-60'
                    }`}>
                      <div className="flex items-center gap-3">
                        {content.available ? (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        ) : (
                          <Lock className="h-4 w-4 text-gray-400" />
                        )}
                        <div>
                          <p className={`font-medium ${content.available ? 'text-primary-900' : 'text-gray-500'}`}>
                            {content.title}
                          </p>
                          <p className="text-xs text-gray-500">{content.type}</p>
                        </div>
                      </div>
                      {content.available ? (
                        <Button size="sm" variant="outline" className="text-xs">
                          Acessar
                        </Button>
                      ) : (
                        <div className="flex items-center gap-1 text-secondary-600">
                          <Crown className="h-3 w-3" />
                          <span className="text-xs">Premium</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Premium Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-secondary-600" />
                  Recursos Premium
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-6">
                  {premiumFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Crown className="h-4 w-4 text-secondary-600" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link to="/planos">
                  <Button className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700">
                    Ver Planos de Assinatura
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* News Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-accent-600" />
                Últimas Notícias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg hover:bg-gray-50">
                  <h4 className="font-medium text-primary-900 mb-2">
                    Novo Concurso TRT abre 500 vagas
                  </h4>
                  <p className="text-sm text-gray-600">
                    Edital previsto para março de 2024...
                  </p>
                  <Button size="sm" variant="link" className="p-0 h-auto text-xs">
                    Ler mais
                  </Button>
                </div>
                <div className="p-4 border rounded-lg hover:bg-gray-50">
                  <h4 className="font-medium text-primary-900 mb-2">
                    Dicas de Estudo para Direito Constitucional
                  </h4>
                  <p className="text-sm text-gray-600">
                    Estratégias eficazes para dominar a matéria...
                  </p>
                  <Button size="sm" variant="link" className="p-0 h-auto text-xs">
                    Ler mais
                  </Button>
                </div>
                <div className="p-4 border rounded-lg hover:bg-gray-50">
                  <h4 className="font-medium text-primary-900 mb-2">
                    Cronograma de Estudos: Como Organizar
                  </h4>
                  <p className="text-sm text-gray-600">
                    Monte um plano eficiente para sua aprovação...
                  </p>
                  <Button size="sm" variant="link" className="p-0 h-auto text-xs">
                    Ler mais
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VisitanteDashboard;
