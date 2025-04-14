import React from 'react';

const SystemDescription = () => {
  return (
    <section className="w-full bg-black text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Título com estilo minimalista */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4">
            CONEXÃO DIRETA
          </h2>
          <div className="flex items-center justify-center my-6">
            <div className="h-px w-16 bg-white opacity-30"></div>
            <span className="text-lg md:text-xl tracking-widest font-light px-6 opacity-70">MARKETPLACE</span>
            <div className="h-px w-16 bg-white opacity-30"></div>
          </div>
        </div>
        
        {/* Cards com layout minimalista */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mt-16">
          {/* Card 1 */}
          <div className="p-10 border border-white border-opacity-10 relative group">
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="mb-8 opacity-80">
                <div className="w-10 h-[1px] bg-white mb-8"></div>
                <span className="text-6xl font-light">01</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">MECÂNICAS</h3>
              <p className="text-gray-400 leading-relaxed">
                Acesso direto a milhares de peças com preços competitivos. 
                Encontre o que precisa sem intermediários.
              </p>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="p-10 border border-white border-opacity-10 relative group">
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="mb-8 opacity-80">
                <div className="w-10 h-[1px] bg-white mb-8"></div>
                <span className="text-6xl font-light">02</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">AUTOPEÇAS</h3>
              <p className="text-gray-400 leading-relaxed">
                Conecte-se diretamente com oficinas mecânicas e expanda seu alcance de vendas sem esforço adicional.
              </p>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="p-10 border border-white border-opacity-10 relative group">
            <div className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="mb-8 opacity-80">
                <div className="w-10 h-[1px] bg-white mb-8"></div>
                <span className="text-6xl font-light">03</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">PLATAFORMA</h3>
              <p className="text-gray-400 leading-relaxed">
                Interface intuitiva e minimalista que facilita a busca, negociação e acompanhamento das transações.
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA final */}
        <div className="text-center mt-20">
          <button className="bg-transparent hover:bg-white hover:text-black border-2 border-white text-white font-bold tracking-widest py-5 px-16 rounded-full transition-all duration-500 text-lg uppercase">
            Saiba mais
          </button>
          <p className="mt-8 text-sm tracking-wider opacity-50 uppercase">
            Revolucionando o mercado de autopeças
          </p>
        </div>
      </div>
    </section>
  );
};

export default SystemDescription;