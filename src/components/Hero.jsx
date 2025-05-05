import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    // Verificar se o usuário está logado ao carregar o componente
    const checkAuth = () => {
      const userInfo = sessionStorage.getItem('autofacil_currentUser');
      if (userInfo) {
        setCurrentUser(JSON.parse(userInfo));
      }
    };
    
    checkAuth();
    
    // Atualizar quando houver mudanças no sessionStorage
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  const handleLogout = () => {
    // Remover usuário da sessão
    sessionStorage.removeItem('autofacil_currentUser');
    setCurrentUser(null);
    navigate('/');
  };

  return (
    <section className="w-full min-h-screen bg-white text-black flex items-center justify-center relative overflow-hidden">
      {/* Simple navbar with dynamic login/logout */}
      <div className="absolute top-0 left-0 w-full z-20 px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl md:text-2xl font-bold tracking-tight">
              auto<span className="text-red-600 font-black">Fácil</span>
            </Link>
          </div>
          <div className="flex space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:block">
                  <span className="text-sm text-gray-600">Bem-vindo(a), </span>
                  <span className="font-medium">{currentUser.nomeEmpresa}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-sm uppercase tracking-wider border border-red-600 text-red-600 px-4 sm:px-6 py-2 hover:bg-red-600 hover:text-white transition-colors"
                >
                  Sair
                </button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <button className="text-sm uppercase tracking-wider border border-black px-4 sm:px-6 py-2 hover:border-red-600 hover:text-red-600 transition-colors">
                    Entrar
                  </button>
                </Link>
                <Link to="/cadastro">
                  <button className="text-sm uppercase tracking-wider bg-red-600 text-white border border-red-600 px-4 sm:px-6 py-2 hover:bg-red-700 hover:border-red-700 transition-colors">
                    Cadastre-se
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Minimal background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full border border-gray-300"></div>
      </div>
      
      {/* Minimalist red details */}
      <div className="absolute top-0 left-0 w-1 h-32 bg-red-600"></div>
      <div className="absolute bottom-0 right-0 w-1 h-32 bg-red-600"></div>
      <div className="absolute top-0 right-1/3 w-1 h-16 bg-red-600"></div>
      <div className="absolute bottom-0 left-1/3 w-1 h-16 bg-red-600"></div>
      
      {/* Main content - Better centered with proper responsive padding */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 z-10 text-center">
        <div className="flex flex-col items-center justify-center">
          {/* Title section */}
          <div className="mb-10 sm:mb-12">
            <div className="flex justify-center">
              <div className="w-12 h-1 bg-red-600 mb-6"></div>
            </div>
            <h2 className="text-lg uppercase tracking-widest mb-4 font-light">Marketplace para</h2>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none mb-6">
              MECÂNICAS & <span className="text-red-600">AUTOPEÇAS</span>
            </h1>
            <p className="text-gray-600 mb-10 max-w-md mx-auto px-4 sm:px-0">
              Conectando o futuro do setor automotivo de forma simples, 
              rápida e eficiente.
            </p>
          </div>
          
          {/* Image placeholder with better sizing for different screens */}
          <div className="mb-10 sm:mb-12 relative w-full max-w-md mx-auto px-4 sm:px-0">
            {/* Image placeholder with minimalist red border */}
            <div className="border border-gray-200 aspect-square overflow-hidden p-1 relative">
              <img src="/api/placeholder/500/500" alt="Marketplace de mecânicas e autopeças" className="w-full h-full object-cover" />
              {/* Red corner accents */}
              <div className="absolute top-0 left-0 w-8 sm:w-12 h-1 bg-red-600"></div>
              <div className="absolute top-0 left-0 w-1 h-8 sm:h-12 bg-red-600"></div>
              <div className="absolute bottom-0 right-0 w-8 sm:w-12 h-1 bg-red-600"></div>
              <div className="absolute bottom-0 right-0 w-1 h-8 sm:h-12 bg-red-600"></div>
            </div>
            <div className="absolute -z-10 top-4 sm:top-6 left-4 sm:left-6 border border-red-600 aspect-square w-full h-full opacity-20"></div>
          </div>
          
          {/* Centered CTA with responsive sizing */}
          <Link to="/cadastro">
            <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 sm:py-4 px-8 sm:px-10
                              tracking-wider uppercase transition-all duration-300 inline-flex
                              items-center text-sm sm:text-base">
              Comece agora
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </button>
          </Link>
        </div>
      </div>
      
      {/* Minimalist footer */}
      <div className="absolute bottom-4 left-0 w-full text-center z-20">
        <div className="flex items-center justify-center">
          <div className="h-px w-12 sm:w-16 bg-gray-300"></div>
          <p className="text-xs uppercase tracking-wider text-gray-400 mx-4">
            © 2025 autoFácil
          </p>
          <div className="h-px w-12 sm:w-16 bg-gray-300"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;