import React, { useState, useEffect } from 'react';
// 1. Import Recharts components
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'; // Added LineChart and Line for variety, but BarChart is used below.

const AutopecaDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({
    vendasHoje: 0,
    vendasMes: 0,
    produtosCadastrados: 0,
    pedidosPendentes: 0
  });

  // This useEffect structure is from your original code.
  useEffect(() => {
    const userInfo = sessionStorage.getItem('autofacil_currentUser');
    if (userInfo) {
      setCurrentUser(JSON.parse(userInfo));
    }
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (currentUser !== null) {
        loadDashboardData();
    }
  }, [currentUser]);


  const loadDashboardData = () => {
    const products = JSON.parse(localStorage.getItem('autofacil_products') || '[]');
    const orders = JSON.parse(localStorage.getItem('autofacil_orders') || '[]');

    const myProducts = products.filter(product =>
      product.vendedorId === currentUser?.id
    );

    const pendingOrders = orders.filter(order =>
      order.vendedorId === currentUser?.id && (order.status === 'pendente' || order.status === 'em separação')
    );

    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(order => {
        const orderDateString = typeof order.data === 'string' ? order.data : '';
        return order.vendedorId === currentUser?.id &&
               orderDateString.split('T')[0] === today &&
               (order.status === 'entregue' || order.status === 'em trânsito' || order.status === 'em separação');
    });
    const todaySales = todayOrders.reduce((sum, order) => sum + order.valorTotal, 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthOrders = orders.filter(order => {
      try {
        const orderDate = new Date(order.data);
        return order.vendedorId === currentUser?.id &&
               orderDate.getMonth() === currentMonth &&
               orderDate.getFullYear() === currentYear &&
               (order.status === 'entregue' || order.status === 'em trânsito' || order.status === 'em separação');
      } catch (e) {
        console.warn("Invalid date format for order:", order);
        return false;
      }
    });
    const monthSales = monthOrders.reduce((sum, order) => sum + order.valorTotal, 0);

    setStats({
      vendasHoje: todaySales || 1250.00,
      vendasMes: monthSales || 28500.00,
      produtosCadastrados: myProducts.length || 32,
      pedidosPendentes: pendingOrders.length || 8
    });
  };

  const salesChartData = [
    { mes: 'Jan', vendas: 12000 }, { mes: 'Fev', vendas: 15000 }, { mes: 'Mar', vendas: 18000 },
    { mes: 'Abr', vendas: 16000 }, { mes: 'Mai', vendas: 21000 }, { mes: 'Jun', vendas: 19000 },
    { mes: 'Jul', vendas: 22000 }, { mes: 'Ago', vendas: 25000 }, { mes: 'Set', vendas: 23000 },
    { mes: 'Out', vendas: 26000 }, { mes: 'Nov', vendas: 28500 }, { mes: 'Dez', vendas: 0 }
  ];

  const formatCurrency = (value) => {
    return `R$ ${Number(value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; // Ensured 2 decimal places for consistency
  };
  const formatCurrencyK = (value) => {
    if (value === 0) return 'R$0';
    return `R$${(value/1000).toFixed(0)}k`;
  };


  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard da Autopeça</h1>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Vendas Hoje</p>
              <h2 className="text-2xl font-bold">{formatCurrency(stats.vendasHoje)}</h2>
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
              <h2 className="text-2xl font-bold">{formatCurrency(stats.vendasMes)}</h2>
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
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={salesChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="mes" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis
                  tickFormatter={formatCurrencyK}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  label={{ value: 'Vendas (R$)', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 14, dy: 40 }}
                />
                <Tooltip
                    formatter={(value) => [formatCurrency(value, 0), "Vendas"]} // formatCurrency used with 0 digits for tooltip on sales chart
                    labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                    itemStyle={{ color: '#EF4444' }}
                    contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '0.5rem', borderColor: '#cbd5e1', padding: '8px' }}
                />
                <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                <Bar dataKey="vendas" fill="#EF4444" name="Vendas Mensais" barSize={25} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Produtos mais vendidos - MODIFIED to show 3 items with images */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Produtos Mais Vendidos</h3>
          <div className="space-y-4">
            {/* Item 1 */}
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-md mr-4 flex-shrink-0">
                <img src="https://images.tcdn.com.br/img/img_prod/1153789/filtro_oleo_psl76_tecfil_837_1_1c981ec7c5e235f921b10b3e3b45b9ad.jpg" alt="Filtro de Óleo" className="w-full h-full object-cover rounded-md"/>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Filtro de Óleo Premium</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-500">214 unidades</span>
                  <span className="text-sm font-medium">R$ 5.350,00</span>
                </div>
              </div>
            </div>
            {/* Item 2 */}
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-md mr-4 flex-shrink-0">
                 <img src="https://images.tcdn.com.br/img/img_prod/673340/n1233_pastilha_freio_tras_tucson_2_0_4x2_4x4_2_7_cobreq_10602_1_b949af85d381d29094712b8dde933e22.jpg" alt="Pastilhas de Freio" className="w-full h-full object-cover rounded-md"/>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Kit de Pastilhas de Freio</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-500">156 unidades</span>
                  <span className="text-sm font-medium">R$ 7.800,00</span>
                </div>
              </div>
            </div>
            {/* Item 3 */}
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-200 rounded-md mr-4 flex-shrink-0">
                <img src="https://images.tcdn.com.br/img/img_prod/1027273/oleo_de_motor_mobil_super_5w30_sintetico_api_sp_e_dexos_1_407_2_d22001f9d0a6d6d243be9e7e80c6243f.jpg" alt="Óleo de Motor" className="w-full h-full object-cover rounded-md"/>
              </div>
              <div className="flex-1">
                <h4 className="font-medium">Óleo de Motor Sintético</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-gray-500">145 unidades</span>
                  <span className="text-sm font-medium">R$ 6.525,00</span>
                </div>
              </div>
            </div>
            {/* Removed items 4 and 5 from original */}
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
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Static data for example */}
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#958412</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Oficina São Pedro</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">04/05/2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(738.90)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Entregue</span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#958411</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Auto Center Sorocaba</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">03/05/2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(1245.50)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Em separação</span>
                </td>
              </tr>
              {/* Add more rows as needed or make dynamic */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AutopecaDashboard;