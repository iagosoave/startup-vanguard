import React from 'react';

const SystemDescription = () => {
  return (
    <section className="w-full bg-gray-50 text-gray-900 py-24 px-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4">
            COMO FUNCIONA
          </h2>
          <div className="flex items-center justify-center my-6">
            <div className="h-px w-16 bg-gray-400 opacity-50"></div>
            <span className="text-lg md:text-xl tracking-widest font-light px-6 text-gray-600">CHATBOT IA</span>
            <div className="h-px w-16 bg-gray-400 opacity-50"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 mt-16">
          
          <div className="p-10 border border-gray-200 bg-white relative group hover:border-red-200 transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-full bg-red-50 opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-6xl font-light text-gray-300">01</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">PERGUNTE</h3>
              <p className="text-gray-600 leading-relaxed">
                Descreva a peça que precisa em linguagem natural. 
                O bot entende marcas, modelos e anos.
              </p>
            </div>
          </div>
          
          <div className="p-10 border border-gray-200 bg-white relative group hover:border-red-200 transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-full bg-red-50 opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-6xl font-light text-gray-300">02</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">ENCONTRE</h3>
              <p className="text-gray-600 leading-relaxed">
                IA busca em tempo real no inventário de múltiplos fornecedores com preços atualizados.
              </p>
            </div>
          </div>
          
          <div className="p-10 border border-gray-200 bg-white relative group hover:border-red-200 transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-full bg-red-50 opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="mb-8">
                <div className="w-10 h-[1px] bg-red-600 mb-8"></div>
                <span className="text-6xl font-light text-gray-300">03</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight text-gray-900">COMPRE</h3>
              <p className="text-gray-600 leading-relaxed">
                Finalize a compra direto no chat. Pagamento seguro e entrega rastreada.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-20">
          <p className="text-sm tracking-wider text-gray-500 uppercase">
            Inteligência artificial para o mercado de duas rodas
          </p>
        </div>
      </div>
    </section>
  );
};

export default SystemDescription;