
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Maria Silva",
      role: "Aprovada no TRT-SP",
      content: "O Ponto Simulado foi fundamental para minha aprovação. Os simulados cronometrados me ajudaram a gerenciar o tempo na prova real.",
      rating: 5,
      avatar: "MS"
    },
    {
      name: "João Santos",
      role: "Aprovado na Receita Federal",
      content: "A qualidade das questões e a correção detalhada me permitiram identificar exatamente onde precisava melhorar. Recomendo!",
      rating: 5,
      avatar: "JS"
    },
    {
      name: "Ana Costa",
      role: "Aprovada no INSS",
      content: "Estudei 8 meses usando apenas o Ponto Simulado. A organização do conteúdo e os relatórios de desempenho são excepcionais.",
      rating: 5,
      avatar: "AC"
    },
    {
      name: "Pedro Oliveira",
      role: "Aprovado no Banco Central",
      content: "Depois de várias tentativas, foi com o Ponto Simulado que consegui minha aprovação. A plataforma é completa e muito bem estruturada.",
      rating: 5,
      avatar: "PO"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            O que Nossos Aprovados Dizem
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Histórias reais de candidatos que alcançaram seus objetivos usando nossa plataforma
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>

              <p className="text-gray-700 italic leading-relaxed">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
