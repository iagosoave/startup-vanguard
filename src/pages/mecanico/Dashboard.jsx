import React, { useState, useEffect } from 'react';

const MecanicoDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({
    comprasRealizadas: 0,
    valorGasto: 0,
    produtosComprados: 0,
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
    // Simular pedidos no localStorage
    const orders = JSON.parse(localStorage.getItem('autofacil_orders') || '[]');
    
    // Filtrar pedidos por comprador (usuário atual)
    const myOrders = orders.filter(order => 
      order.compradorId === currentUser?.id || order.compradorId === 'default_user'
    );
    
    // Calcular estatísticas
    let totalSpent = 0;
    let totalProducts = 0;
    let pendingOrders = 0;
    
    myOrders.forEach(order => {
      totalSpent += order.valorTotal;
      totalProducts += order.itens.reduce((sum, item) => sum + item.quantidade, 0);
      if (order.status !== 'entregue' && order.status !== 'cancelado') {
        pendingOrders++;
      }
    });
    
    // Atualizar estatísticas com valores fictícios caso não existam dados reais
    setStats({
      comprasRealizadas: myOrders.length || 7,
      valorGasto: totalSpent || 3560.45,
      produtosComprados: totalProducts || 23,
      pedidosPendentes: pendingOrders || 2
    });
  };
  
  // Dados para o gráfico de compras (simulação)
  const purchaseChartData = [
    { mes: 'Jan', gastos: 2500 },
    { mes: 'Fev', gastos: 3200 },
    { mes: 'Mar', gastos: 2800 },
    { mes: 'Abr', gastos: 3500 },
    { mes: 'Mai', gastos: 3000 },
    { mes: 'Jun', gastos: 4200 },
    { mes: 'Jul', gastos: 3800 },
    { mes: 'Ago', gastos: 2900 },
    { mes: 'Set', gastos: 3300 },
    { mes: 'Out', gastos: 3700 },
    { mes: 'Nov', gastos: 3500 },
    { mes: 'Dez', gastos: 0 }
  ];

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Compras Realizadas</p>
              <h2 className="text-2xl font-bold">{stats.comprasRealizadas}</h2>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-500 mr-1">+2</span>
            <span className="text-gray-500 text-sm">vs. mês anterior</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Valor Total Gasto</p>
              <h2 className="text-2xl font-bold">R$ {stats.valorGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-500 mr-1">+15%</span>
            <span className="text-gray-500 text-sm">vs. mês anterior</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Produtos Comprados</p>
              <h2 className="text-2xl font-bold">{stats.produtosComprados}</h2>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-green-500 mr-1">+8</span>
            <span className="text-gray-500 text-sm">vs. mês anterior</span>
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
            <span className="text-red-500 mr-1">-1</span>
            <span className="text-gray-500 text-sm">vs. ontem</span>
          </div>
        </div>
      </div>
      
      {/* Gráficos e informações adicionais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Gráfico de gastos do ano */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h3 className="text-lg font-medium mb-4">Gastos por Mês</h3>
          <div className="h-64">
            {/* Gráfico simplificado (em produção usaria recharts ou outra biblioteca) */}
            <div className="flex h-48 items-end space-x-2">
              {purchaseChartData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className="w-full bg-blue-500 rounded-t" 
                    style={{ height: `${(item.gastos / 5000) * 100}%` }}
                  ></div>
                  <span className="text-xs mt-2 text-gray-500">{item.mes}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Produtos mais comprados */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Produtos Mais Comprados</h3>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-md mr-4"></div>
              <div className="flex-1">
                <h4 className="font-medium">Óleo de Motor Sintético</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-500">8 unidades</span>
                  <span className="text-sm font-medium">R$ 360,00</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-md mr-4"></div>
              <div className="flex-1">
                <h4 className="font-medium">Filtro de Óleo Premium</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-500">5 unidades</span>
                  <span className="text-sm font-medium">R$ 129,50</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-md mr-4"></div>
              <div className="flex-1">
                <h4 className="font-medium">Kit de Pastilhas de Freio</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-500">4 unidades</span>
                  <span className="text-sm font-medium">R$ 359,60</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-md mr-4"></div>
              <div className="flex-1">
                <h4 className="font-medium">Velas de Ignição - Conjunto</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-500">2 unidades</span>
                  <span className="text-sm font-medium">R$ 241,00</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-md mr-4"></div>
              <div className="flex-1">
                <h4 className="font-medium">Amortecedor Dianteiro</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-500">1 unidade</span>
                  <span className="text-sm font-medium">R$ 249,90</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabela de últimas compras */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-medium mb-4">Últimas Compras</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedido
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fornecedor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #123456
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Auto Peças Silva
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  04/05/2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  R$ 359,90
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    Em trânsito
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #123455
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Distribuidora de Peças Automotivas
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  02/05/2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  R$ 845,30
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Entregue
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #123454
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Auto Peças Total
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  29/04/2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  R$ 1.250,00
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Entregue
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #123453
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Peças & Acessórios
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  25/04/2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  R$ 560,75
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Entregue
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #123452
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Auto Peças Silva
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  22/04/2025
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  R$ 425,00
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
      
      {/* Recomendações e dicas */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-medium mb-4">Recomendações para sua Oficina</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4 bg-blue-50">
            <h4 className="font-medium text-blue-800 mb-2">Estoque Baixo</h4>
            <p className="text-sm text-gray-600 mb-3">Seus níveis de óleo estão baixos. Recomendamos fazer um pedido para evitar interrupções no atendimento.</p>
            <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800">Ver produtos recomendados →</a>
          </div>
          
          <div className="border rounded-lg p-4 bg-green-50">
            <h4 className="font-medium text-green-800 mb-2">Economia em Compras</h4>
            <p className="text-sm text-gray-600 mb-3">Você economizou R$ 320,00 este mês comprando produtos em promoção. Continue assim!</p>
            <a href="#" className="text-sm font-medium text-green-600 hover:text-green-800">Ver mais promoções →</a>
          </div>
          
          <div className="border rounded-lg p-4 bg-purple-50">
            <h4 className="font-medium text-purple-800 mb-2">Novos Produtos</h4>
            <p className="text-sm text-gray-600 mb-3">Há 12 novos produtos disponíveis no marketplace que podem interessar seu negócio.</p>
            <a href="#" className="text-sm font-medium text-purple-600 hover:text-purple-800">Explorar novidades →</a>
          </div>
          
          <div className="border rounded-lg p-4 bg-yellow-50">
            <h4 className="font-medium text-yellow-800 mb-2">Dica de Gestão</h4>
            <p className="text-sm text-gray-600 mb-3">Fazer pedidos programados pode reduzir seus custos de frete em até 25%.</p>
            <a href="#" className="text-sm font-medium text-yellow-600 hover:text-yellow-800">Configurar pedidos programados →</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MecanicoDashboard;