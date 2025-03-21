import React from 'react';

const MainFeatures = () => {
  return (
    <section className="w-full bg-gray-50 py-10 px-6 md:px-12 lg:px-16">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho centralizado mais compacto */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black">
            Principais Funcionalidades
          </h2>
          <div className="w-16 h-1 bg-black my-3 mx-auto"></div>
          <p className="text-base text-gray-700 max-w-2xl mx-auto">
            Soluções inteligentes para otimizar seu negócio de autopeças
          </p>
        </div>

        {/* Layout em duas colunas mais compacto */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Coluna da esquerda - Features principais */}
          <div className="lg:w-1/2">
            <div className="space-y-4">
              {/* Feature 1 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-black">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold shrink-0">
                    <span>1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Análise de Perfil Energético</h3>
                    <p className="text-sm text-gray-700">
                      Analise detalhadamente o consumo energético de sua empresa, identificando padrões e oportunidades de economia.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-black">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold shrink-0">
                    <span>2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Comparação entre Energias</h3>
                    <p className="text-sm text-gray-700">
                      Compare diferentes fontes de energia e seus impactos nos custos operacionais e na eficiência do seu negócio.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-black">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold shrink-0">
                    <span>3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Cálculo de Implementação</h3>
                    <p className="text-sm text-gray-700">
                      Obtenha estimativas precisas de custos, tempo e retorno sobre investimento para implementação de novas soluções.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Coluna da direita - Grid e recursos adicionais */}
          <div className="lg:w-1/2">
            {/* Card com visual mais compacto */}
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              {/* Grid de recursos */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white mx-auto mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h4 className="text-base font-bold mb-1">Gestão de Estoque</h4>
                  <p className="text-xs text-gray-600">Controle total de inventário</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white mx-auto mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 className="text-base font-bold mb-1">Vendas</h4>
                  <p className="text-xs text-gray-600">Processos simplificados</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white mx-auto mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h4 className="text-base font-bold mb-1">Financeiro</h4>
                  <p className="text-xs text-gray-600">Relatórios inteligentes</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg text-center">
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white mx-auto mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4 className="text-base font-bold mb-1">Dashboard</h4>
                  <p className="text-xs text-gray-600">Indicadores em tempo real</p>
                </div>
              </div>
              
              {/* Recursos adicionais com design compacto */}
              <div className="pt-3 border-t border-gray-200">
                <h4 className="text-base font-bold mb-2 text-center">Recursos adicionais inclusos</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
                    <span className="text-sm">Controle de ordens</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
                    <span className="text-sm">Análise de desempenho</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
                    <span className="text-sm">Gestão de fornecedores</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
                    <span className="text-sm">Automação de processos</span>
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

export default MainFeatures;