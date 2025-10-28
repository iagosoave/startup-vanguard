import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const checkAuth = () => {
      const userInfo = sessionStorage.getItem('autofacil_currentUser');
      if (userInfo) {
        setCurrentUser(JSON.parse(userInfo));
      }
    };
    
    checkAuth();
    
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  const handleLogout = () => {
    sessionStorage.removeItem('autofacil_currentUser');
    setCurrentUser(null);
    navigate('/');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const lineVariants = {
    hidden: { height: 0 },
    visible: {
      height: "8rem",
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="w-full min-h-screen bg-white text-black flex items-center justify-center relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute top-0 left-0 w-full z-20 px-4 sm:px-8 py-6"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl md:text-2xl font-bold tracking-tight transition-colors hover:text-red-600">
              Peça<span className="text-red-600 font-black">já!</span>
            </Link>
          </div>
          <div className="flex space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:block">
                  <span className="text-sm text-gray-600">Olá, </span>
                  <span className="font-medium">{currentUser.nomeEmpresa}</span>
                </div>
                <Link to="/dashboard">
                  <button className="text-sm uppercase tracking-wider bg-gray-900 text-white px-4 sm:px-6 py-2 hover:bg-gray-800 transition-all duration-300">
                    Dashboard
                  </button>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-sm uppercase tracking-wider border border-red-600 text-red-600 px-4 sm:px-6 py-2 hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Sair
                </button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <button className="text-sm uppercase tracking-wider border border-black px-4 sm:px-6 py-2 hover:border-red-600 hover:text-red-600 transition-all duration-300">
                    Entrar
                  </button>
                </Link>
                <Link to="/cadastro">
                  <button className="text-sm uppercase tracking-wider bg-red-600 text-white border border-red-600 px-4 sm:px-6 py-2 hover:bg-red-700 hover:border-red-700 transition-all duration-300">
                    Cadastre-se
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        variants={lineVariants}
        initial="hidden"
        animate="visible"
        className="absolute top-0 left-0 w-1 bg-red-600"
      />
      <motion.div 
        variants={lineVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="absolute bottom-0 right-0 w-1 bg-red-600"
      />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto px-4 sm:px-8 z-10 text-center"
      >
        <div className="flex flex-col items-center justify-center">
          <div className="mb-16">
            <motion.div variants={itemVariants} className="flex justify-center mb-8">
              <div className="w-16 h-1 bg-red-600"></div>
            </motion.div>
           
            <motion.h1 
              variants={itemVariants}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none mb-6"
            >
              MARKETPLACE<br />
              <span className="text-red-600">INTELIGENTE</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed"
            >
              Conectamos você às melhores peças de moto com tecnologia de IA.<br />
              Busca rápida, precisa e inteligente.
            </motion.p>
          </div>
          
          <motion.div variants={itemVariants} className="mb-16">
            {!currentUser ? (
              <Link to="/cadastro">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-10
                            tracking-wider uppercase transition-all duration-300 inline-flex
                            items-center text-sm sm:text-base group"
                >
                  COMEÇAR AGORA
                  <motion.svg 
                    className="ml-3 w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5,
                      ease: "easeInOut"
                    }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </motion.svg>
                </motion.button>
              </Link>
            ) : (
              <Link to="/dashboard">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-10
                            tracking-wider uppercase transition-all duration-300 inline-flex
                            items-center text-sm sm:text-base group"
                >
                  ACESSAR DASHBOARD
                  <motion.svg 
                    className="ml-3 w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5,
                      ease: "easeInOut"
                    }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </motion.svg>
                </motion.button>
              </Link>
            )}
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="absolute bottom-4 left-0 w-full text-center z-20"
      >
        <div className="flex items-center justify-center">
          <div className="h-px w-12 sm:w-16 bg-gray-300"></div>
          <p className="text-xs uppercase tracking-wider text-gray-400 mx-4">
            motoBot
          </p>
          <div className="h-px w-12 sm:w-16 bg-gray-300"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;