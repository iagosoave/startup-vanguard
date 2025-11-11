import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

// Autopeça/Lojista
import AutopecaDashboard from './autopeca/Dashboard';
import EstoquePage from './autopeca/Estoque';
import PedidosPage from './autopeca/Pedidos';

// Mecânico/Comprador
import ComprasPage from './mecanico/Compras';
import ChatbotPedidos from './mecanico/AssistenteAIPedidos'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userInfo = sessionStorage.getItem('autofacil_currentUser');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      console.log('👤 [DASHBOARD] Usuário carregado:', user);
      console.log('👤 [DASHBOARD] Tipo de usuário:', user.tipoUsuario);
      setCurrentUser(user);
      setIsLoading(false);
    } else {
      console.log('⚠️ [DASHBOARD] Nenhum usuário encontrado, redirecionando para login');
      navigate('/login');
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // ✅ NORMALIZAR o tipo de usuário (aceitar maiúscula e minúscula)
  const tipoUsuario = currentUser?.tipoUsuario?.toUpperCase();
  const isLojista = tipoUsuario === 'LOJISTA' || tipoUsuario === 'AUTOPECA';
  
  console.log('🔍 [DASHBOARD] Tipo normalizado:', tipoUsuario);
  console.log('🔍 [DASHBOARD] É lojista?', isLojista);

  return (
    <DashboardLayout>
      <Routes>
        {isLojista ? (
          // ✅ Rotas para LOJISTA/AUTOPEÇA
          <>
            <Route path="/" element={<AutopecaDashboard />} />
            <Route path="/estoque" element={<EstoquePage />} />
            <Route path="/pedidos" element={<PedidosPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          // ✅ Rotas para COMPRADOR/MECÂNICA
          <>
            <Route path="/" element={<ChatbotPedidos />} />
            <Route path="/compras" element={<ComprasPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;