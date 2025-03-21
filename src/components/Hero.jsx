import React, { useState, useEffect } from 'react';
import erp from './erp-vanguard.png';


const Hero = () => {
  const [navbarVisible, setNavbarVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Mostrar a navbar quando o usuário rolar mais de 100px
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setNavbarVisible(true);
      } else {
        setNavbarVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Limpar o event listener quando o componente for desmontado
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Navbar que aparece ao rolar */}
      <nav 
        className={`fixed top-0 left-0 w-full bg-white shadow-md z-50 transition-all duration-300 ${
          navbarVisible ? 'transform-none' : 'transform -translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-4 flex justify-between items-center">
          {/* Logo/Nome da empresa */}
          <div className="font-bold text-xl text-black">Vanguard</div>
          
          {/* Botão de acesso */}
          <button className="bg-black text-white font-medium py-2 px-6 rounded-full hover:bg-gray-900 transition-colors text-sm">
            Acessar sistema
          </button>
        </div>
      </nav>

      {/* Conteúdo principal do Hero */}
      <section className="w-full min-h-screen bg-white py-8 md:py-12 px-6 md:px-12 lg:px-20 flex items-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            {/* Lado esquerdo - título, descrição e botões */}
            <div className="lg:w-5/12 mb-12 lg:mb-0 text-center lg:text-left">
              {/* Título em preto */}
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">
                Vanguard: o sistema<br/>
                ERP que revoluciona<br/>
                <span className="text-black">o setor de<br/>
                autopeças</span>
              </h1>
              
              {/* Linha decorativa centralizada */}
              <div className="w-20 h-1 bg-black my-5 mx-auto lg:mx-0"></div>
              
              {/* Descrição */}
              <p className="text-lg text-gray-800 mb-12">
                Simplifique processos, aumente sua eficiência e maximize os<br/>
                lucros com um sistema desenvolvido especificamente para o<br/>
                mercado de autopeças.
              </p>
              
              {/* Botão CTA único */}
              <div className="flex justify-center lg:justify-start">
                <button className="bg-black text-white font-medium py-4 px-10 rounded-full hover:bg-gray-900 transition-colors text-lg">
                  Comece agora
                </button>
              </div>
            </div>
            
            {/* Lado direito - Imagem do dashboard */}
            <div className="lg:w-7/12 flex items-center justify-center lg:pl-8">
              <div className="w-full max-w-2xl">
                <img
                  src={erp}
                  alt="Dashboard do sistema Vanguard"
                  className="w-full h-auto object-contain rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;