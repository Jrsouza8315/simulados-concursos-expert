
const StatsSection = () => {
  const stats = [
    {
      number: "50K+",
      label: "Questões Disponíveis",
      description: "Banco atualizado com questões de todas as principais bancas"
    },
    {
      number: "98%",
      label: "Taxa de Aprovação",
      description: "Dos nossos assinantes que estudaram por 6 meses"
    },
    {
      number: "500+",
      label: "Concursos Cobertos",
      description: "Editais de órgãos federais, estaduais e municipais"
    },
    {
      number: "15K+",
      label: "Estudantes Ativos",
      description: "Comunidade crescendo todos os dias"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 to-secondary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Números que Comprovam Nossa Eficiência
          </h2>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto">
            Milhares de candidatos já conquistaram seus sonhos com nossa metodologia
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center animate-fade-in glass-effect rounded-xl p-6"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-primary-100 mb-2">
                {stat.label}
              </div>
              <div className="text-sm text-primary-200">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
