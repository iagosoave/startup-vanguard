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
      {/* Navbar */}
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
                <Link to="/dashboard">
                  <button className="text-sm uppercase tracking-wider bg-gray-900 text-white px-4 sm:px-6 py-2 hover:bg-gray-800 transition-colors">
                    Dashboard
                  </button>
                </Link>
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
      
      {/* Elementos decorativos minimalistas */}
      <div className="absolute top-0 left-0 w-1 h-32 bg-red-600"></div>
      <div className="absolute bottom-0 right-0 w-1 h-32 bg-red-600"></div>
      
      {/* Main content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 z-10 text-center">
        <div className="flex flex-col items-center justify-center">
          {/* Título principal */}
          <div className="mb-16">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-1 bg-red-600"></div>
            </div>
            <h2 className="text-lg sm:text-xl uppercase tracking-widest mb-6 font-light text-gray-700">
              Marketplace para
            </h2>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-8">
              MECÂNICAS<br />
              & <span className="text-red-600">AUTOPEÇAS</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Conecte sua oficina ao futuro do setor automotivo.<br />
              Simples, rápido e eficiente.
            </p>
          </div>
          
          {/* CTA */}
          <div className="mb-16">
            {!currentUser ? (
              <Link to="/cadastro">
                <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-10
                                  tracking-wider uppercase transition-all duration-300 inline-flex
                                  items-center text-sm sm:text-base">
                  Comece agora
                  <svg className="ml-3 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </Link>
            ) : (
              <Link to="/dashboard">
                <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-10
                                  tracking-wider uppercase transition-all duration-300 inline-flex
                                  items-center text-sm sm:text-base">
                  Acessar Dashboard
                  <svg className="ml-3 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Footer minimalista */}
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