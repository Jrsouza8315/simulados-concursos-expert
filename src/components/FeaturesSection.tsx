
import { Clock, Calendar, Book, CheckCircle, Search, User } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Clock,
      title: "Simulados Cronometrados",
      description: "Pratique com o tempo real de prova e desenvolva sua estratégia de resolução",
      color: "text-primary-600"
    },
    {
      icon: Search,
      title: "Filtros Avançados",
      description: "Encontre questões por banca, cargo, disciplina, ano e nível de dificuldade",
      color: "text-secondary-600"
    },
    {
      icon: Calendar,
      title: "Concursos Atualizados",
      description: "Acompanhe todos os editais abertos e datas importantes em tempo real",
      color: "text-primary-600"
    },
    {
      icon: Book,
      title: "Apostilas Completas",
      description: "Material didático atualizado para todas as disciplinas e cargos",
      color: "text-secondary-600"
    },
    {
      icon: CheckCircle,
      title: "Correção Detalhada",
      description: "Análise completa do seu desempenho com estatísticas e áreas para melhorar",
      color: "text-primary-600"
    },
    {
      icon: User,
      title: "Acompanhamento Personal",
      description: "Dashboard personalizado com seu progresso e recomendações de estudo",
      color: "text-secondary-600"
    }
  ];

  return (
    <section id="simulados" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Funcionalidades que Fazem a Diferença
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Nossa plataforma oferece tudo que você precisa para uma preparação completa e eficiente
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 group animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg inline-block">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Pronto para começar sua jornada?
            </h3>
            <p className="text-gray-600 mb-6">
              Experimente grátis por 7 dias. Sem compromisso, cancele quando quiser.
            </p>
            <button className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
              Começar Teste Grátis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
