import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

// Componentes para Autopeça
import AutopecaDashboard from './autopeca/Dashboard';
import EstoquePage from './autopeca/Estoque';
import PedidosPage from './autopeca/Pedidos';

// Componentes para Mecânico
import MecanicoDashboard from './mecanico/Dashboard';
import MarketplacePage from './mecanico/Marketplace';
import ComprasPage from './mecanico/Compras';

// Componente comum para ambos
import ChatPage from './comum/Chat';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Verificar se o usuário está logado
    const userInfo = sessionStorage.getItem('autofacil_currentUser');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setCurrentUser(user);
      setIsLoading(false);
    } else {
      // Redirecionar para login se não estiver logado
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
          // Rotas para Autopeça
          <>
            <Route path="/" element={<AutopecaDashboard />} />
            <Route path="/estoque" element={<EstoquePage />} />
            <Route path="/pedidos" element={<PedidosPage />} />
            <Route path="/chat" element={<ChatPage userType="autopeca" />} />
            {/* Rota padrão para autopeças - redireciona para a raiz do dashboard (não para "/dashboard") */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          // Rotas para Mecânico
          <>
            <Route path="/" element={<MecanicoDashboard />} />
            <Route path="/marketplace" element={<MarketplacePage />} />
            <Route path="/compras" element={<ComprasPage />} />
            <Route path="/chat" element={<ChatPage userType="mecanico" />} />
            {/* Rota padrão para mecânicos - redireciona para a raiz do dashboard (não para "/dashboard") */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;