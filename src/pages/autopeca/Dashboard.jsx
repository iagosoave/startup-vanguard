import React, { useState, useEffect } from 'react';

const AutopecaDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({
    vendasHoje: 0,
    vendasMes: 0,
    produtosCadastrados: 0,
    pedidosPendentes: 0
  });
  
  useEffect(() => {
    // Carregar dados do usuário atual
    const userInfo = sessionStorage.getItem('autofacil_currentUser');
    if (userInfo) {
      setCurrentUser(JSON.parse(userInfo));
    }
    
    // Carregar dados de exemplo para o dashboard (simulando dados de BI)
    // Em uma aplicação real, estes dados viriam de uma API
    loadDashboardData();
  }, []);
  
  const loadDashboardData = () => {
    // Simular produtos cadastrados no localStorage
    const products = JSON.parse(localStorage.getItem('autofacil_products') || '[]');
    
    // Simular pedidos no localStorage
    const orders = JSON.parse(localStorage.getItem('autofacil_orders') || '[]');
    
    // Filtrar produtos por vendedor (usuário atual)
    const myProducts = products.filter(product => 
      product.vendedorId === currentUser?.id
    );
    
    // Filtrar pedidos pendentes
    const pendingOrders = orders.filter(order => 
      order.vendedorId === currentUser?.id && order.status === 'pendente'
    );
    
    // Calcular vendas de hoje
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(order => 
      order.vendedorId === currentUser?.id && 
      order.data.split('T')[0] === today
    );
    
    const todaySales = todayOrders.reduce((sum, order) => sum + order.valorTotal, 0);
    
    // Calcular vendas do mês
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthOrders = orders.filter(order => {
      const orderDate = new Date(order.data);
      return order.vendedorId === currentUser?.id &&
             orderDate.getMonth() === currentMonth &&
             orderDate.getFullYear() === currentYear;
    });
    
    const monthSales = monthOrders.reduce((sum, order) => sum + order.valorTotal, 0);
    
    // Atualizar estatísticas
    setStats({
      vendasHoje: todaySales || 1250.00, // Valor fictício se não houver dados
      vendasMes: monthSales || 28500.00, // Valor fictício se não houver dados
      produtosCadastrados: myProducts.length || 32, // Valor fictício se não houver dados
      pedidosPendentes: pendingOrders.length || 8 // Valor fictício se não houver dados
    });
  };
  
  // Dados para o gráfico de vendas (simulação)
  const salesChartData = [
    { mes: 'Jan', vendas: 12000 },
    { mes: 'Fev', vendas: 15000 },
    { mes: 'Mar', vendas: 18000 },
    { mes: 'Abr', vendas: 16000 },
    { mes: 'Mai', vendas: 21000 },
    { mes: 'Jun', vendas: 19000 },
    { mes: 'Jul', vendas: 22000 },
    { mes: 'Ago', vendas: 25000 },
    { mes: 'Set', vendas: 23000 },
    { mes: 'Out', vendas: 26000 },
    { mes: 'Nov', vendas: 28500 },
    { mes: 'Dez', vendas: 0 }
  ];

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Vendas Hoje</p>
              <h2 className="text-2xl font-bold">R$ {stats.vendasHoje.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-500 mr-1">+12%</span>
            <span className="text-gray-500 text-sm">vs. ontem</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Vendas Mês</p>
              <h2 className="text-2xl font-bold">R$ {stats.vendasMes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-500 mr-1">+8%</span>
            <span className="text-gray-500 text-sm">vs. mês anterior</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Produtos Cadastrados</p>
              <h2 className="text-2xl font-bold">{stats.produtosCadastrados}</h2>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-500 mr-1">+5</span>
            <span className="text-gray-500 text-sm">novos esta semana</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pedidos Pendentes</p>
              <h2 className="text-2xl font-bold">{stats.pedidosPendentes}</h2>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-red-500 mr-1">+2</span>
            <span className="text-gray-500 text-sm">desde ontem</span>
          </div>
        </div>
      </div>
      
      {/* Gráficos e informações adicionais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Gráfico de vendas do ano */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h3 className="text-lg font-medium mb-4">Vendas por Mês</h3>
          <div className="h-64">
            {/* Gráfico simplificado (em produção usaria recharts ou outra biblioteca) */}
            <div className="flex h-48 items-end space-x-2">
              {salesChartData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-red-500 rounded-t" 
                    style={{ height: `${(item.vendas / 30000) * 100}%` }}
                  ></div>
                  <span className="text-xs mt-2 text-gray-500">{item.mes}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Produtos mais vendidos */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Produtos Mais Vendidos</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-md mr-4"></div>
              <div className="flex-1">
                <h4 className="font-medium">Filtro de Óleo Premium</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-500">214 unidades</span>
                  <span className="text-sm font-medium">R$ 5.350,00</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-md mr-4"></div>
              <div className="flex-1">
                <h4 className="font-medium">Kit de Pastilhas de Freio</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-500">156 unidades</span>
                  <span className="text-sm font-medium">R$ 7.800,00</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-md mr-4"></div>
              <div className="flex-1">
                <h4 className="font-medium">Óleo de Motor Sintético</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-500">145 unidades</span>
                  <span className="text-sm font-medium">R$ 6.525,00</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-md mr-4"></div>
              <div className="flex-1">
                <h4 className="font-medium">Velas de Ignição</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-500">132 unidades</span>
                  <span className="text-sm font-medium">R$ 3.960,00</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-md mr-4"></div>
              <div className="flex-1">
                <h4 className="font-medium">Amortecedor Dianteiro</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-500">98 unidades</span>
                  <span className="text-sm font-medium">R$ 14.700,00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabela de pedidos recentes */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-medium mb-4">Pedidos Recentes</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #958412
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Oficina São Pedro
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  04/05/2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  R$ 738,90
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Entregue
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #958411
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Auto Center Sorocaba
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  03/05/2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  R$ 1.245,50
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Em separação
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #958410
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Mecânica do João
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  03/05/2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  R$ 2.875,00
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Em trânsito
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #958409
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Center Car Ltda
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  02/05/2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  R$ 564,75
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Entregue
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #958408
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Auto Elétrica Silva
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  01/05/2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  R$ 1.890,30
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Entregue
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AutopecaDashboard;