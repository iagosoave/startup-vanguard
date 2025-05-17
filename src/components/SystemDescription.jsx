import React from 'react';

const SystemDescription = () => {
  return (
    <section className="w-full bg-gray-50 text-gray-900 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Título com estilo minimalista */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4">
            CONEXÃO DIRETA
          </h2>
          <div className="flex items-center justify-center my-6">
            <div className="h-px w-16 bg-gray-400 opacity-50"></div>
            <span className="text-lg md:text-xl tracking-widest font-light px-6 text-gray-600">MARKETPLACE</span>
            <div className="h-px w-16 bg-gray-400 opacity-50"></div>
          </div>
        </div>
        
        {/* Cards com layout minimalista */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mt-16">
          {/* Card 1 */}
          <div className="p-10 border border-gray-200 bg-white relative group hover:border-red-200 transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-full bg-red-50 opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-6xl font-light text-gray-300">01</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">MECÂNICAS</h3>
              <p className="text-gray-600 leading-relaxed">
                Acesso direto a milhares de peças com preços competitivos. 
                Encontre o que precisa sem intermediários.
              </p>
            </div>
          </div>
          
          {/* Card 2 */}
          <div className="p-10 border border-gray-200 bg-white relative group hover:border-red-200 transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-full bg-red-50 opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-6xl font-light text-gray-300">02</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">AUTOPEÇAS</h3>
              <p className="text-gray-600 leading-relaxed">
                Conecte-se diretamente com oficinas mecânicas e expanda seu alcance de vendas sem esforço adicional.
              </p>
            </div>
          </div>
          
          {/* Card 3 */}
          <div className="p-10 border border-gray-200 bg-white relative group hover:border-red-200 transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-full bg-red-50 opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-6xl font-light text-gray-300">03</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">PLATAFORMA</h3>
              <p className="text-gray-600 leading-relaxed">
                Interface intuitiva e minimalista que facilita a busca, negociação e acompanhamento das transações.
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer final */}
        <div className="text-center mt-20">
          <p className="text-sm tracking-wider text-gray-500 uppercase">
            Revolucionando o mercado de autopeças
          </p>
        </div>
      </div>
    </section>
  );
};

export default SystemDescription;