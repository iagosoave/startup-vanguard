import React from 'react';

const Hero = () => {
  return (
    <section className="w-full min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      {/* Logo/nome da empresa no topo */}
      <div className="absolute top-8 left-8 md:left-12 z-20">
        <div className="flex items-center">
          <span className="text-xl md:text-2xl font-black tracking-tighter">auto<span className="text-white font-light">Fácil</span></span>
        </div>
      </div>
      
      {/* Grid de fundo decorativo */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-5 pointer-events-none">
        {Array.from({ length: 144 }).map((_, i) => (
          <div key={i} className="border border-white"></div>
        ))}
      </div>
      
      {/* Círculo decorativo */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full border border-white opacity-5 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full border border-white opacity-5 transform translate-x-1/2 translate-y-1/2"></div>
      
      {/* Conteúdo principal */}
      <div className="relative w-full max-w-6xl mx-auto px-6 z-10">
        <div className="text-center py-20">
          {/* Título com efeito de linha */}
          <div className="inline-block relative mb-8">
            <span className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
              MARKETPLACE
            </span>
            <div className="absolute -bottom-4 left-0 w-full h-px bg-white opacity-20"></div>
          </div>
          
          {/* Subtítulo */}
          <div className="mb-8 opacity-80">
            <div className="flex items-center justify-center">
              <div className="h-px w-16 bg-white opacity-30"></div>
              <span className="text-xl md:text-2xl tracking-widest font-light px-6">PARA</span>
              <div className="h-px w-16 bg-white opacity-30"></div>
            </div>
          </div>
          
          {/* Texto principal - agora estático */}
          <div className="relative inline-block mb-16">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight">
              MECÂNICAS & AUTOPEÇAS
            </h1>
            <div className="absolute -bottom-4 left-0 w-full h-1 bg-white"></div>
          </div>
          
          {/* CTA único */}
          <div className="mt-16 mb-16">
            <div className="inline-block relative group">
              {/* Efeito de borda animada */}
              <div className="absolute inset-0 border border-white rounded-full opacity-30 
                             transform scale-100 group-hover:scale-110 
                             transition-all duration-700 ease-out"></div>
              
              {/* Botão principal */}
              <button className="relative bg-transparent hover:bg-white hover:text-black 
                                border-2 border-white text-white font-bold tracking-widest py-6 px-20 
                                rounded-full transition-all duration-500 ease-out
                                transform group-hover:scale-105 text-xl uppercase">
                Comece agora
              </button>
            </div>
          </div>
          
          {/* Texto minimalista abaixo com nome da empresa */}
          <p className="text-sm tracking-widest uppercase opacity-50 mt-20">
            autoFácil - Conectando o futuro do setor automotivo
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;