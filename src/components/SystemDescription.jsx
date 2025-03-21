import React from 'react';

const SystemDescription = () => {
  return (
    <section className="w-full bg-white py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-black">
          Um sistema projetado para o setor de autopeças
        </h2>
        
        <div className="w-20 h-1 bg-black my-5 mx-auto"></div>
        
        <p className="text-lg text-gray-800 max-w-3xl mx-auto mb-10">
          O Vanguard foi desenvolvido para simplificar e otimizar todas as operações do seu negócio de autopeças.
          Com interface intuitiva e ferramentas especializadas, você terá total controle sobre estoque, 
          vendas, financeiro e muito mais - tudo em um único lugar.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">1</div>
            <h3 className="text-xl font-bold mb-3">Controle Total</h3>
            <p className="text-gray-700">Gerencie todo seu negócio em uma única plataforma, sem complicações.</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">2</div>
            <h3 className="text-xl font-bold mb-3">Alta Performance</h3>
            <p className="text-gray-700">Sistema rápido e eficiente, mesmo com grandes volumes de produtos e dados.</p>
          </div>
          
          <div className="p-6 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">3</div>
            <h3 className="text-xl font-bold mb-3">Suporte Especializado</h3>
            <p className="text-gray-700">Equipe dedicada que entende as particularidades do mercado de autopeças.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SystemDescription;