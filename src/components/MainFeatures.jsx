import React from 'react';

const MainFeatures = () => {
  return (
    <section className="w-full bg-white text-black py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho com estilo minimalista */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4">
            RECURSOS
          </h2>
          <div className="flex items-center justify-center my-6">
            <div className="h-px w-16 bg-gray-400 opacity-50"></div>
            <span className="text-lg md:text-xl tracking-widest font-light px-6 text-gray-600">MARKETPLACE</span>
            <div className="h-px w-16 bg-gray-400 opacity-50"></div>
          </div>
        </div>
        
        {/* Grid de recursos em estilo minimalista */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
          {/* Feature 1 */}
          <div className="bg-white p-10 relative group hover:bg-red-50 transition-all duration-500">
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-xs tracking-widest uppercase text-gray-500">Recurso</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">ANÁLISE DE MERCADO</h3>
              <p className="text-gray-600 leading-relaxed">
                Visualize tendências de demanda, comparativos de preços e identifique oportunidades 
                para expandir seu catálogo baseado em dados reais do mercado.
              </p>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white p-10 relative group hover:bg-red-50 transition-all duration-500">
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-xs tracking-widest uppercase text-gray-500">Recurso</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">CONEXÃO DIRETA</h3>
              <p className="text-gray-600 leading-relaxed">
                Comunique-se diretamente com fornecedores ou clientes sem intermediários, 
                negociando condições específicas e estabelecendo relações comerciais duradouras.
              </p>
            </div>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white p-10 relative group hover:bg-red-50 transition-all duration-500">
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-xs tracking-widest uppercase text-gray-500">Recurso</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">GESTÃO DE PEDIDOS</h3>
              <p className="text-gray-600 leading-relaxed">
                Acompanhe todo o ciclo de vendas, desde a cotação até a entrega, 
                com notificações em tempo real e histórico completo de transações.
              </p>
            </div>
          </div>
          
          {/* Feature 4 */}
          <div className="bg-white p-10 relative group hover:bg-red-50 transition-all duration-500">
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-xs tracking-widest uppercase text-gray-500">Recurso</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">CATÁLOGO INTELIGENTE</h3>
              <p className="text-gray-600 leading-relaxed">
                Organize seu inventário com sistema de categorização avançada e busca por 
                compatibilidade veicular, tornando mais fácil encontrar as peças certas.
              </p>
            </div>
          </div>
          
          {/* Feature 5 */}
          <div className="bg-white p-10 relative group hover:bg-red-50 transition-all duration-500">
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-xs tracking-widest uppercase text-gray-500">Recurso</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">LOGÍSTICA INTEGRADA</h3>
              <p className="text-gray-600 leading-relaxed">
                Calcule fretes automaticamente, gere etiquetas de envio e 
                acompanhe entregas em tempo real dentro da própria plataforma.
              </p>
            </div>
          </div>
          
          {/* Feature 6 */}
          <div className="bg-white p-10 relative group hover:bg-red-50 transition-all duration-500">
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-xs tracking-widest uppercase text-gray-500">Recurso</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">ANÁLISE FINANCEIRA</h3>
              <p className="text-gray-600 leading-relaxed">
                Visualize relatórios detalhados sobre suas vendas, margem de lucro 
                e desempenho por categoria ou cliente para tomadas de decisão precisas.
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer final */}
        <div className="text-center mt-20">
          <p className="text-sm tracking-wider text-gray-500 uppercase">
            Ferramentas desenvolvidas para o setor automotivo
          </p>
        </div>
      </div>
    </section>
  );
};

export default MainFeatures;