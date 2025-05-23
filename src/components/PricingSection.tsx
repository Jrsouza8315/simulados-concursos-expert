
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const PricingSection = () => {
  const plans = [
    {
      name: "Básico",
      price: "29",
      period: "mês",
      description: "Ideal para quem está começando",
      features: [
        "5 simulados por mês",
        "Banco com 10.000 questões",
        "Apostilas básicas",
        "Suporte por email"
      ],
      popular: false,
      buttonText: "Começar Grátis"
    },
    {
      name: "Premium",
      price: "49",
      period: "mês",
      description: "Mais completo para estudos intensivos",
      features: [
        "Simulados ilimitados",
        "Banco completo com 50.000 questões",
        "Todas as apostilas",
        "Correção detalhada",
        "Estatísticas avançadas",
        "Suporte prioritário"
      ],
      popular: true,
      buttonText: "Assinar Premium"
    },
    {
      name: "Anual",
      price: "490",
      period: "ano",
      description: "Melhor custo-benefício",
      features: [
        "Tudo do Premium",
        "2 meses grátis",
        "Garantia de 30 dias",
        "Acesso antecipado a novidades",
        "Consultoria de estudos",
        "Certificado de conclusão"
      ],
      popular: false,
      buttonText: "Assinar Anual"
    }
  ];

  return (
    <section id="planos" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Planos que se Adaptam ao seu Ritmo
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha o plano ideal para sua preparação. Todos incluem acesso completo à plataforma.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 ${
                plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Mais Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">R$ {plan.price}</span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-secondary-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full py-3 ${
                  plan.popular 
                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700' 
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                {plan.buttonText}
              </Button>
            </div>
          ))}
        </div>

        {/* Money back guarantee */}
        <div className="text-center mt-12">
          <p className="text-gray-600">
            <strong>Garantia de 30 dias</strong> - Se não ficar satisfeito, devolvemos seu dinheiro
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
