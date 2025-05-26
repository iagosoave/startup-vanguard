import React from 'react';

const MainFeatures = () => {
  return (
    <section className="w-full bg-white text-black py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4">
            TRANSFORME SEU NEGÓCIO AUTOMOTIVO
          </h2>
          <div className="flex items-center justify-center my-6">
            <div className="h-px w-16 bg-gray-400 opacity-50"></div>
            <span className="text-lg md:text-xl tracking-widest font-light px-6 text-gray-600">AUTO FACILIDADES</span> {/* Changed subtitle */}
            <div className="h-px w-16 bg-gray-400 opacity-50"></div>
          </div>
          <p className="max-w-2xl mx-auto text-gray-700 text-lg">
            Plataforma completa para autopeças e mecânicos otimizarem suas operações,
            ampliarem suas conexões e impulsionarem seus resultados.
          </p>
        </div>
        
        {/* Grid de recursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200"> {/* gap-px for thin lines */}
          
          {/* Feature 1: Marketplace & Catálogo */}
          <div className="bg-white p-10 relative group hover:bg-red-50 transition-all duration-500">
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-xs tracking-widest uppercase text-gray-500">Para Todos</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">MARKETPLACE INTEGRADO</h3>
              <p className="text-gray-600 leading-relaxed">
                <strong className="text-gray-800">Autopeças:</strong> Exponha seu catálogo para uma vasta rede de mecânicos qualificados.<br/>
                <strong className="text-gray-800">Mecânicos:</strong> Encontre as peças certas com facilidade, compare preços e compre direto de múltiplos fornecedores.
              </p>
            </div>
          </div>
          
          {/* Feature 2: Gestão de Estoque (Foco Autopeça) */}
          <div className="bg-white p-10 relative group hover:bg-red-50 transition-all duration-500">
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-xs tracking-widest uppercase text-gray-500">Para Autopeças</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">GESTÃO DE ESTOQUE EFICIENTE</h3>
              <p className="text-gray-600 leading-relaxed">
                Cadastre, organize e controle seu inventário de forma intuitiva. Mantenha seu catálogo atualizado
                no marketplace automaticamente e evite perdas.
              </p>
            </div>
          </div>

          {/* Feature 3: Compras Simplificadas (Foco Mecânico) */}
          <div className="bg-white p-10 relative group hover:bg-red-50 transition-all duration-500">
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-xs tracking-widest uppercase text-gray-500">Para Mecânicos</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">COMPRAS OTIMIZADAS</h3>
              <p className="text-gray-600 leading-relaxed">
                Acesse um vasto catálogo de peças, adicione ao carrinho, gerencie seus pedidos e acompanhe suas
                compras de forma centralizada e eficiente.
              </p>
            </div>
          </div>
          
          {/* Feature 4: Dashboard e Análises (Para Ambos, adaptado) */}
          <div className="bg-white p-10 relative group hover:bg-red-50 transition-all duration-500">
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-xs tracking-widest uppercase text-gray-500">Para Todos</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">DASHBOARDS INTELIGENTES</h3>
              <p className="text-gray-600 leading-relaxed">
                <strong className="text-gray-800">Autopeças:</strong> Monitore vendas, produtos mais vendidos e pedidos pendentes.<br/>
                <strong className="text-gray-800">Mecânicos:</strong> Acompanhe seu histórico de compras, gastos e status de pedidos.
              </p>
            </div>
          </div>
          
          {/* Feature 5: Conexão Direta (mantido, mas é forte) */}
          <div className="bg-white p-10 relative group hover:bg-red-50 transition-all duration-500">
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-xs tracking-widest uppercase text-gray-500">Para Todos</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">CONEXÃO DIRETA E ÁGIL</h3>
              <p className="text-gray-600 leading-relaxed">
                Facilitamos a comunicação entre autopeças e mecânicos, permitindo negociações transparentes
                e a construção de parcerias estratégicas.
              </p>
            </div>
          </div>
          
          {/* Feature 6: Simplicidade e Foco */}
          <div className="bg-white p-10 relative group hover:bg-red-50 transition-all duration-500">
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-xs tracking-widest uppercase text-gray-500">Benefício Chave</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">FOCO NO SEU CORE BUSINESS</h3>
              <p className="text-gray-600 leading-relaxed">
                Automatize processos de compra, venda e gestão para que você possa se concentrar no que realmente importa:
                atender seus clientes e expandir seu negócio.
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-20">
          <p className="text-sm tracking-wider text-gray-500 uppercase">
            AutoFacil: Potencializando o mercado de autopeças e serviços automotivos.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MainFeatures;