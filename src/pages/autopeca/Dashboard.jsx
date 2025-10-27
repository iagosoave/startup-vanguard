import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, ShoppingCart, Package, Users, Loader2 } from 'lucide-react';

// ===================================================
// INÍCIO - LÓGICA DE API DO BACKEND (COMENTADO)
// ===================================================
// const fetchDashboardData = async () => {
//   try {
//     const response = await fetch('URL_DA_SUA_API/dashboard/autopeca'); // Rota para dados do dashboard
//     if (!response.ok) {
//       throw new Error('Erro ao buscar dados do dashboard');
//     }
//     const data = await response.json();
//     // A API deve retornar um objeto com os dados necessários:
//     // {
//     //   faturamentoMensal: 15000,
//     //   pedidosPendentes: 12,
//     //   produtosEstoque: 350,
//     //   novosClientes: 5,
//     //   vendasPorMes: [
//     //     { mes: 'Jan', Vendas: 4000 }, { mes: 'Fev', Vendas: 3000 }, ...
//     //   ]
//     // }
//     return data;
//   } catch (error) {
//     console.error("API Error (fetchDashboardData):", error);
//     throw error;
//   }
// };
// ===================================================
// FIM - LÓGICA DE API DO BACKEND
// ===================================================


// Componente de Card Estatístico reutilizável
const StatCard = ({ title, value, icon: Icon, loading }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="p-3 bg-red-100 rounded-full">
      <Icon className="h-6 w-6 text-red-600" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      {loading ? (
        <Loader2 className="h-5 w-5 animate-spin text-gray-400 mt-1" />
      ) : (
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      )}
    </div>
  </div>
);


const AutopecaDashboard = () => {
  // Estado para controlar o carregamento dos dados
  const [isLoading, setIsLoading] = useState(true); 
  // Estados para armazenar dados (inicializados como nulos ou placeholders)
  const [dashboardData, setDashboardData] = useState({
      faturamentoMensal: null,
      pedidosPendentes: null,
      produtosEstoque: null,
      novosClientes: null,
      vendasPorMes: [] // Gráfico começa vazio
  });
  const [error, setError] = useState(null);


  useEffect(() => {
    const carregarDados = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // const data = await fetchDashboardData(); // CHAMADA API REAL
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simula delay API
        
        // **NÃO DEFINIR DADOS REAIS** - Mantenha os placeholders ou defina como zero/vazio
        const mockDataVazia = {
             faturamentoMensal: null, // Ou 0
             pedidosPendentes: null, // Ou 0
             produtosEstoque: null, // Ou 0
             novosClientes: null, // Ou 0
             // Deixe o gráfico vazio ou com dados zerados se preferir
             vendasPorMes: [ 
                 { mes: 'Jan', Vendas: 0 }, { mes: 'Fev', Vendas: 0 }, { mes: 'Mar', Vendas: 0 },
                 { mes: 'Abr', Vendas: 0 }, { mes: 'Mai', Vendas: 0 }, { mes: 'Jun', Vendas: 0 }
             ]
         };
         setDashboardData(mockDataVazia); // Define dados vazios/placeholders

      } catch (err) {
        setError(err.message || 'Falha ao carregar dados do dashboard.');
        // Define placeholders de erro ou mantém nulo
         setDashboardData({
             faturamentoMensal: 'Erro',
             pedidosPendentes: 'Erro',
             produtosEstoque: 'Erro',
             novosClientes: 'Erro',
             vendasPorMes: []
         });
      } finally {
        // Defina isLoading como false *depois* de um tempo para mostrar os placeholders
        // Se quiser mostrar o loading até a API responder (mesmo que vazia), remova o timeout
         // setTimeout(() => setIsLoading(false), 500); // Pequeno delay para mostrar loading
         setIsLoading(false); // Remove loading imediatamente após simulação
      }
    };

    carregarDados();
  }, []); // Roda apenas uma vez

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === 'Erro') return '---'; // Placeholder
    return `R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  const formatNumber = (value) => {
      if (value === null || value === undefined || value === 'Erro') return '---'; // Placeholder
      return value.toString();
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard da Autopeça</h1>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Faturamento Mensal" 
          value={formatCurrency(dashboardData.faturamentoMensal)} 
          icon={DollarSign}
          loading={isLoading} 
        />
        <StatCard 
          title="Pedidos Pendentes" 
          value={formatNumber(dashboardData.pedidosPendentes)} 
          icon={ShoppingCart}
          loading={isLoading} 
        />
        <StatCard 
          title="Produtos em Estoque" 
          value={formatNumber(dashboardData.produtosEstoque)} 
          icon={Package}
          loading={isLoading} 
        />
        <StatCard 
          title="Novos Clientes (Mês)" 
          value={formatNumber(dashboardData.novosClientes)} 
          icon={Users}
          loading={isLoading} 
        />
      </div>

      {/* Gráfico de Vendas */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-5 text-gray-800">Vendas Mensais (Últimos 6 Meses)</h3>
        {isLoading ? (
           <div className="flex justify-center items-center h-64"> 
             <Loader2 className="h-8 w-8 animate-spin text-red-600" />
           </div>
        ) : error ? (
            <div className="flex justify-center items-center h-64 text-red-600">
                Erro ao carregar dados do gráfico.
            </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={dashboardData.vendasPorMes} // Usará os dados zerados ou vazios
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="mes" stroke="#6b7280" />
              <YAxis stroke="#6b7280" tickFormatter={(value) => `R$${value/1000}k`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
              <Bar dataKey="Vendas" fill="#EF4444" barSize={30} /> 
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

       {/* Futuras seções podem ser adicionadas aqui */}
       {/* Ex: Lista de produtos com baixo estoque, últimos pedidos, etc. */}

    </div>
  );
};

export default AutopecaDashboard;