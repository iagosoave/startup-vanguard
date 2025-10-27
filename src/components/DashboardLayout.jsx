import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Bot } from 'lucide-react'; 

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation(); 

  useEffect(() => {
    const userInfo = sessionStorage.getItem('autofacil_currentUser');
    if (userInfo) {
      setCurrentUser(JSON.parse(userInfo));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('autofacil_currentUser');
    navigate('/');
  };

  if (!currentUser) {
    return <div className="flex items-center justify-center h-screen bg-gray-100">Carregando...</div>;
  }

  const empresaNome = "Peça Já!";
  const corTextoPrincipal = "text-red-600";

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className={`bg-white shadow-lg ${isSidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col border-r border-gray-200`}>
        <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200 flex-shrink-0">
          <Link to="/dashboard" className="flex items-center gap-1">
            <span className={`text-xl font-bold tracking-tight text-black ${isSidebarOpen ? 'block' : 'hidden'}`}>
              Peça<span className="text-red-600">Já!</span>
            </span>
            <span className={`text-xl font-bold tracking-tight text-black ${isSidebarOpen ? 'hidden' : 'block'}`}>
              P<span className="text-red-600">J!</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-2">
          {currentUser.tipoUsuario === 'autopeca' ? (
            // Menu para Autopeças (SEM CHAT)
            <>
              <SidebarLink to="/dashboard" icon="chart-pie" text="Dashboard" isSidebarOpen={isSidebarOpen} location={location} />
              <SidebarLink to="/dashboard/estoque" icon="cube" text="Estoque" isSidebarOpen={isSidebarOpen} location={location} />
              <SidebarLink to="/dashboard/pedidos" icon="shopping-cart" text="Pedidos" isSidebarOpen={isSidebarOpen} location={location} />
              {/* <SidebarLink to="/dashboard/chat" icon="chat" text="Mensagens" isSidebarOpen={isSidebarOpen} location={location} /> REMOVIDO */}
            </>
          ) : (
            // Menu para Mecânicos (com Chatbot)
            <>
              <SidebarLink to="/dashboard" icon="bot" text="Fazer Pedido" isSidebarOpen={isSidebarOpen} location={location} />
              <SidebarLink to="/dashboard/compras" icon="receipt" text="Minhas Compras" isSidebarOpen={isSidebarOpen} location={location} />
            </>
          )}
        </nav>

        <div className="p-3 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 w-full flex items-center justify-center transition-colors"
            title={isSidebarOpen ? "Recolher menu" : "Expandir menu"}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isSidebarOpen ? "M11 19l-7-7 7-7m8 14l-7-7 7-7" : "M13 5l7 7-7 7M5 5l7 7-7 7"} />
            </svg>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div></div>
              <div className="flex items-center">
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-800">
                      {currentUser.nomeEmpresa}
                    </div>
                    <div className="text-xs text-gray-500">
                      ({currentUser.tipoUsuario === 'autopeca' ? 'Autopeça' : 'Mecânica'})
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className={`text-sm ${corTextoPrincipal} hover:text-red-800 font-medium p-2 rounded-md hover:bg-red-50 transition-colors`}
                    title="Sair"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, icon, text, isSidebarOpen, location }) => {
  const isActive = location.pathname === to || (to !== "/dashboard" && location.pathname.startsWith(to));

  const renderIcon = () => {
    if (icon === 'bot') {
       return <Bot className={`h-5 w-5 ${isActive ? 'text-red-600' : 'text-gray-500 group-hover:text-gray-700'}`} strokeWidth={isActive ? 2.5 : 2}/>;
    }
    
    const iconClass = `h-5 w-5 ${isActive ? 'text-red-600' : 'text-gray-500 group-hover:text-gray-700'}`;
    const strokeWidth = isActive ? 2.5 : 2;

    switch (icon) {
      case 'chart-pie': return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>;
      case 'cube': return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
      case 'shopping-cart': return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
      case 'chat': return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
      case 'receipt': return <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={strokeWidth}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
      default: return null;
    }
  };

  return (
    <Link
      to={to}
      className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${
        isActive
          ? 'bg-red-50 text-red-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <div className="mr-3 flex-shrink-0">
        {renderIcon()}
      </div>
      <span className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'} transition-opacity duration-200 ${isActive ? 'font-semibold' : ''}`}>
        {text}
      </span>
    </Link>
  );
};

export default DashboardLayout;