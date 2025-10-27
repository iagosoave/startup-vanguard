import React from 'react';

const MainFeatures = () => {
  return (
    <section className="w-full bg-white text-black py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4">
            INTELIGÊNCIA ARTIFICIAL ESPECIALIZADA
          </h2>
          <div className="flex items-center justify-center my-6">
            <div className="h-px w-16 bg-gray-400 opacity-50"></div>
            <span className="text-lg md:text-xl tracking-widest font-light px-6 text-gray-600">RECURSOS DO BOT</span>
            <div className="h-px w-16 bg-gray-400 opacity-50"></div>
          </div>
          <p className="max-w-2xl mx-auto text-gray-700 text-lg">
            Chatbot treinado com milhares de modelos, peças e especificações.
            Respostas precisas em segundos para qualquer dúvida sobre motos.
          </p>
        </div>
        
        {/* Grid de recursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200">
          
          {/* Feature 1 */}
          <div className="bg-white p-10 relative group hover:bg-red-50 transition-all duration-500">
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-xs tracking-widest uppercase text-gray-500">Busca Inteligente</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">LINGUAGEM NATURAL</h3>
              <p className="text-gray-600 leading-relaxed">
                Digite como você fala. O bot entende gírias, apelidos de peças e descrições informais. 
                Encontre o que precisa sem saber o nome técnico.
              </p>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white p-10 relative group hover:bg-red-50 transition-all duration-500">
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-xs tracking-widest uppercase text-gray-500">Base de Dados</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">TODAS AS MARCAS</h3>
              <p className="text-gray-600 leading-relaxed">
                Honda, Yamaha, Suzuki, Kawasaki e mais. Peças originais e paralelas 
                com comparação instantânea de preços.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-10 relative group hover:bg-red-50 transition-all duration-500">
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-xs tracking-widest uppercase text-gray-500">Compatibilidade</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">VERIFICAÇÃO AUTOMÁTICA</h3>
              <p className="text-gray-600 leading-relaxed">
                O bot confirma se a peça serve na sua moto. Informe modelo e ano, 
                ele garante a compatibilidade.
              </p>
            </div>
          </div>
          
          {/* Feature 4 */}
          <div className="bg-white p-10 relative group hover:bg-red-50 transition-all duration-500">
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-xs tracking-widest uppercase text-gray-500">Atendimento</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">24/7 DISPONÍVEL</h3>
              <p className="text-gray-600 leading-relaxed">
                Sem filas, sem espera. Respostas imediatas a qualquer hora do dia 
                ou da noite. Sempre online.
              </p>
            </div>
          </div>
          
          {/* Feature 5 */}
          <div className="bg-white p-10 relative group hover:bg-red-50 transition-all duration-500">
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-xs tracking-widest uppercase text-gray-500">Preços</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">COMPARAÇÃO EM TEMPO REAL</h3>
              <p className="text-gray-600 leading-relaxed">
                Veja preços de diferentes fornecedores lado a lado. 
                O bot mostra a melhor opção custo-benefício.
              </p>
            </div>
          </div>
          
          {/* Feature 6 */}
          <div className="bg-white p-10 relative group hover:bg-red-50 transition-all duration-500">
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-xs tracking-widest uppercase text-gray-500">Suporte Técnico</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">DICAS DE INSTALAÇÃO</h3>
              <p className="text-gray-600 leading-relaxed">
                Além de encontrar a peça, o bot oferece tutoriais e dicas 
                de instalação. Suporte completo em um só lugar.
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center mt-20">
          <p className="text-sm tracking-wider text-gray-500 uppercase">
            motoBot: IA que entende de moto como você
          </p>
        </div>
      </div>
    </section>
  );
};

export default MainFeatures;