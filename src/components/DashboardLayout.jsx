import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  useEffect(() => {
    // Verificar se o usuário está logado
    const userInfo = sessionStorage.getItem('autofacil_currentUser');
    if (userInfo) {
      setCurrentUser(JSON.parse(userInfo));
    } else {
      // Redirecionar para login se não estiver logado
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('autofacil_currentUser');
    navigate('/');
  };

  if (!currentUser) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-white shadow-lg ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="p-5 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <span className={`text-xl font-bold tracking-tight ${isSidebarOpen ? 'block' : 'hidden'}`}>
              auto<span className="text-red-600 font-black">Fácil</span>
            </span>
            <span className={`text-xl font-bold tracking-tight ${isSidebarOpen ? 'hidden' : 'block'}`}>
              a<span className="text-red-600 font-black">F</span>
            </span>
          </Link>
        </div>

        {/* Sidebar Links - Dinâmico baseado no tipo de usuário */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="flex-1 px-2 space-y-1">
            {currentUser.tipoUsuario === 'autopeca' ? (
              // Menu para Autopeças
              <>
                <SidebarLink to="/dashboard" icon="chart-pie" text="Dashboard" isSidebarOpen={isSidebarOpen} />
                <SidebarLink to="/dashboard/estoque" icon="cube" text="Estoque" isSidebarOpen={isSidebarOpen} />
                <SidebarLink to="/dashboard/pedidos" icon="shopping-cart" text="Pedidos" isSidebarOpen={isSidebarOpen} />
                <SidebarLink to="/dashboard/chat" icon="chat" text="Mensagens" isSidebarOpen={isSidebarOpen} />
              </>
            ) : (
              // Menu para Mecânicos
              <>
                <SidebarLink to="/dashboard" icon="chart-pie" text="Dashboard" isSidebarOpen={isSidebarOpen} />
                <SidebarLink to="/dashboard/marketplace" icon="shopping-bag" text="Marketplace" isSidebarOpen={isSidebarOpen} />
                <SidebarLink to="/dashboard/compras" icon="receipt" text="Minhas Compras" isSidebarOpen={isSidebarOpen} />
                <SidebarLink to="/dashboard/chat" icon="chat" text="Mensagens" isSidebarOpen={isSidebarOpen} />
              </>
            )}
          </nav>
        </div>

        {/* Botão de toggle sidebar */}
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md text-gray-500 hover:bg-gray-100 w-full flex items-center justify-center"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  {/* Mobile logo if needed */}
                </div>
              </div>

              {/* User dropdown */}
              <div className="flex items-center">
                <div className="ml-3 relative">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-700">
                      {currentUser.nomeEmpresa} 
                      <span className="text-xs text-gray-500 ml-1">
                        ({currentUser.tipoUsuario === 'autopeca' ? 'Autopeça' : 'Mecânica'})
                      </span>
                    </div>
                    <button 
                      onClick={handleLogout}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
};

// Componente auxiliar para links da sidebar
const SidebarLink = ({ to, icon, text, isSidebarOpen }) => {
  const renderIcon = () => {
    switch (icon) {
      case 'chart-pie':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
        );
      case 'cube':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'shopping-cart':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      case 'chat':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        );
      case 'shopping-bag':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        );
      case 'receipt':
        return (
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <Link
      to={to}
      className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 group flex items-center px-2 py-3 text-sm font-medium rounded-md"
    >
      <div className="mr-3 flex-shrink-0 text-gray-500 group-hover:text-gray-700">
        {renderIcon()}
      </div>
      <span className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'} transition-opacity duration-200`}>
        {text}
      </span>
    </Link>
  );
};

export default DashboardLayout;