import { Button } from "../components/ui/button";
import { Search, BookOpen, Target, Award, Users } from "lucide-react";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import StatsSection from "../components/StatsSection";
import TestimonialsSection from "../components/TestimonialsSection";
import PricingSection from "../components/PricingSection";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Quick Search Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-8 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl shadow-lg">
              <div className="flex-1 w-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Encontre seu próximo concurso
                </h2>
                <p className="text-gray-600">
                  Pesquise por cargo, órgão ou região
                </p>
              </div>
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Ex: Analista, TRT, São Paulo..."
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Áreas mais procuradas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BookOpen,
                title: "Tribunais",
                description: "TRT, TRF, TJ, STF",
                color: "bg-blue-100 text-blue-600",
              },
              {
                icon: Target,
                title: "Polícia",
                description: "PF, PRF, PC, PM",
                color: "bg-red-100 text-red-600",
              },
              {
                icon: Award,
                title: "Fiscais",
                description: "Receita, ISS, ICMS",
                color: "bg-green-100 text-green-600",
              },
              {
                icon: Users,
                title: "Administrativo",
                description: "INSS, Ministérios",
                color: "bg-purple-100 text-purple-600",
              },
            ].map((category, index) => (
              <div
                key={index}
                className="group relative bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
              >
                <div
                  className={`inline-flex p-3 rounded-lg ${category.color} mb-4`}
                >
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-600">{category.description}</p>
                <div className="absolute inset-0 bg-primary-500/5 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
