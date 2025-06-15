import { Button } from "./ui/button";
import { CheckCircle, Clock, Calendar } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="inicio" className="relative pt-20 pb-16 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50"></div>

      {/* Floating elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-primary-100 rounded-full animate-float opacity-60"></div>
      <div
        className="absolute bottom-20 left-10 w-16 h-16 bg-secondary-100 rounded-full animate-float opacity-60"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Prepare-se para
              <span className="gradient-text block">Concursos Públicos</span>
              com Eficiência
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Plataforma completa com simulados personalizados, apostilas
              atualizadas e acompanhamento detalhado do seu progresso.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-secondary-500" />
                <span className="text-gray-700">
                  Mais de 50.000 questões atualizadas
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-secondary-500" />
                <span className="text-gray-700">
                  Simulados cronometrados e personalizados
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-secondary-500" />
                <span className="text-gray-700">
                  Concursos sempre atualizados
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-lg px-8 py-3"
              >
                Começar Agora Grátis
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                Ver Demonstração
              </Button>
            </div>
          </div>

          {/* Visual/Dashboard mockup */}
          <div
            className="relative animate-fade-in"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
              {/* Mock dashboard header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-8 bg-secondary-100 rounded w-20"></div>
              </div>

              {/* Mock stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Simulados", value: "147" },
                  { label: "Acertos", value: "78%" },
                  { label: "Rank", value: "#234" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="text-2xl font-bold text-primary-600">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Mock progress bars */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Direito Constitucional</span>
                    <span>85%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full w-4/5"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Direito Administrativo</span>
                    <span>72%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full w-3/4"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Português</span>
                    <span>91%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full w-11/12"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
