import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

// Autopeça
import AutopecaDashboard from './autopeca/Dashboard';
import EstoquePage from './autopeca/Estoque';
import PedidosPage from './autopeca/Pedidos';

// Mecânico
import ComprasPage from './mecanico/Compras';
import ChatbotPedidos from './mecanico/AssistenteAIPedidos'; 
// Chat removido para Autopeça
// import ChatPage from './comum/Chat'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userInfo = sessionStorage.getItem('autofacil_currentUser');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setCurrentUser(user);
      setIsLoading(false);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  return (
    <DashboardLayout>
      <Routes>
        {currentUser?.tipoUsuario === 'autopeca' ? (
          // Rotas para Autopeça (SEM CHAT)
          <>
            <Route path="/" element={<AutopecaDashboard />} />
            <Route path="/estoque" element={<EstoquePage />} />
            <Route path="/pedidos" element={<PedidosPage />} />
            {/* <Route path="/chat" element={<ChatPage userType="autopeca" />} /> REMOVIDO */}
            <Route path="*" element={<Navigate to="/" replace />} /> {/* Redireciona para o dashboard principal */}
          </>
        ) : (
          // Rotas para Mecânico (com Chatbot)
          <>
            <Route path="/" element={<ChatbotPedidos />} />
            <Route path="/compras" element={<ComprasPage />} />
            <Route path="*" element={<Navigate to="/" replace />} /> {/* Redireciona para o chatbot */}
          </>
        )}
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;