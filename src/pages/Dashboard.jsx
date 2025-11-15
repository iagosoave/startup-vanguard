import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

import AutopecaDashboard from './autopeca/Dashboard';
import EstoquePage from './autopeca/Estoque';
import PedidosPage from './autopeca/Pedidos';

import ComprasPage from './mecanico/Compras';
import ChatbotPedidos from './mecanico/AssistenteAIPedidos'; 

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(' [DASHBOARD] Verificando autenticação...');
    
    const userInfo = sessionStorage.getItem('autofacil_currentUser');
    
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        console.log(' [DASHBOARD] Usuário carregado:', user);
        console.log(' [DASHBOARD] ID:', user.id);
        console.log(' [DASHBOARD] Email:', user.email);
        console.log(' [DASHBOARD] Tipo de usuário RAW:', user.tipoUsuario);
        console.log(' [DASHBOARD] Tipo typeof:', typeof user.tipoUsuario);
        
        setCurrentUser(user);
        setIsLoading(false);
      } catch (err) {
        console.error('[DASHBOARD] Erro ao parsear usuário:', err);
        navigate('/login');
      }
    } else {
      console.log('[DASHBOARD] Nenhum usuário encontrado');
      console.log(' [DASHBOARD] Redirecionando para login...');
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

  const tipoUsuarioRaw = currentUser?.tipoUsuario;
  const tipoUsuario = tipoUsuarioRaw?.toString().trim().toUpperCase();
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 [DASHBOARD] Tipo RAW:', tipoUsuarioRaw);
  console.log('🔍 [DASHBOARD] Tipo NORMALIZADO:', tipoUsuario);
  
  const isLojista = tipoUsuario === 'LOJISTA' || 
                    tipoUsuario === 'AUTOPECA' || 
                    tipoUsuario === 'AUTOPEÇA' ||
                    tipoUsuario === 'LOJA';
  
  const isComprador = tipoUsuario === 'COMPRADOR' || 
                      tipoUsuario === 'MECANICO' ||
                      tipoUsuario === 'MECÂNICO' ||
                      tipoUsuario === 'CLIENTE';
  
  console.log(' [DASHBOARD] É lojista?', isLojista);
  console.log(' [DASHBOARD] É comprador?', isComprador);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  if (!isLojista && !isComprador) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center max-w-md p-8 bg-red-50 rounded-lg">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Tipo de usuário inválido</h2>
          <p className="text-gray-700 mb-4">
            Tipo recebido: <code className="bg-red-100 px-2 py-1 rounded">{tipoUsuario || 'undefined'}</code>
          </p>
          <p className="text-gray-600 mb-6">
            O sistema não reconhece este tipo de usuário. Por favor, entre em contato com o suporte.
          </p>
          <button
            onClick={() => {
              sessionStorage.removeItem('autofacil_currentUser');
              navigate('/login');
            }}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <Routes>
        {isLojista ? (
          <>
            <Route path="/" element={<AutopecaDashboard />} />
            <Route path="/estoque" element={<EstoquePage />} />
            <Route path="/pedidos" element={<PedidosPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
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