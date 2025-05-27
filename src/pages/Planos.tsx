
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PricingSection from '@/components/PricingSection';

const Planos = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-16">
        <div className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Escolha seu Plano
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Encontre o plano perfeito para sua preparação. Todos os planos incluem 
              acesso completo à nossa plataforma de estudos e suporte especializado.
            </p>
          </div>
        </div>
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
};

export default Planos;
