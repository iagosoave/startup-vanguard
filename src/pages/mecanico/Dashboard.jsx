import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MecanicoDashboard = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [stats, setStats] = useState({
    comprasRealizadas: 0,
    valorGasto: 0,
    produtosComprados: 0,
    pedidosPendentes: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const userInfo = sessionStorage.getItem('autofacil_currentUser');
    if (userInfo) {
      setCurrentUser(JSON.parse(userInfo));
    }
  }, []);

  useEffect(() => {
    if(currentUser !== null) {
      loadDashboardData();
    }
  }, [currentUser]);

  const loadDashboardData = () => {
    const orders = JSON.parse(localStorage.getItem('autofacil_orders') || '[]');
    
    // Filtrar pedidos do usuário atual
    const userId = currentUser?.id || 'default_user';
    const myOrders = orders.filter(order => order.compradorId === userId);

    let totalSpent = 0;
    let totalProducts = 0;
    let pendingOrders = 0;

    // Preparar dados mensais
    const monthlySpending = {};
    const currentYear = new Date().getFullYear();

    myOrders.forEach(order => {
      totalSpent += order.valorTotal;
      totalProducts += order.itens.reduce((sum, item) => sum + item.quantidade, 0);
      if (order.status !== 'entregue' && order.status !== 'cancelado') {
        pendingOrders++;
      }

      // Agrupar gastos por mês
      const orderDate = new Date(order.data);
      if (orderDate.getFullYear() === currentYear) {
        const month = orderDate.getMonth();
        monthlySpending[month] = (monthlySpending[month] || 0) + order.valorTotal;
      }
    });

    // Criar dados para o gráfico
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const chartData = months.map((mes, index) => ({
      mes,
      gastos: monthlySpending[index] || 0
    }));

    setMonthlyData(chartData);
    setStats({
      comprasRealizadas: myOrders.length,
      valorGasto: totalSpent,
      produtosComprados: totalProducts,
      pedidosPendentes: pendingOrders
    });
  };

  const formatCurrencyForTooltip = (value) => {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Cards principais com números em preto */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div>
            <p className="text-sm text-gray-500 mb-1">Compras Realizadas</p>
            <h2 className="text-3xl font-bold text-black">{stats.comprasRealizadas}</h2>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-gray-500 text-sm">Total de pedidos</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div>
            <p className="text-sm text-gray-500 mb-1">Valor Total Gasto</p>
            <h2 className="text-3xl font-bold text-black">R$ {stats.valorGasto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h2>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-gray-500 text-sm">Em todas as compras</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div>
            <p className="text-sm text-gray-500 mb-1">Produtos Comprados</p>
            <h2 className="text-3xl font-bold text-black">{stats.produtosComprados}</h2>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-gray-500 text-sm">Total de itens</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div>
            <p className="text-sm text-gray-500 mb-1">Pedidos Pendentes</p>
            <h2 className="text-3xl font-bold text-black">{stats.pedidosPendentes}</h2>
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-gray-500 text-sm">Aguardando entrega</span>
          </div>
        </div>
      </div>

      {/* Gráficos e informações adicionais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Gráfico de gastos do ano */}
        <div className="bg-white p-6 rounded-lg shadow-md lg:col-span-2">
          <h3 className="text-lg font-medium mb-4">Gastos por Mês</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart
                data={monthlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="mes" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis
                  tickFormatter={(value) => `R$${value > 1000 ? (value/1000).toFixed(1) + 'k' : value}`}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => [formatCurrencyForTooltip(value), "Gastos"]}
                  labelStyle={{ color: '#374151', fontWeight: 'bold' }}
                  itemStyle={{ color: '#3B82F6' }}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '0.5rem', borderColor: '#cbd5e1', padding: '8px' }}
                />
                <Legend wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }} />
                <Bar dataKey="gastos" fill="#3B82F6" name="Gastos Mensais" barSize={25} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Produtos mais comprados */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium mb-4">Produtos Mais Comprados</h3>
          <div className="space-y-4">
            {(() => {
              const orders = JSON.parse(localStorage.getItem('autofacil_orders') || '[]');
              const userId = currentUser?.id || 'default_user';
              const myOrders = orders.filter(order => order.compradorId === userId);
              
              // Agrupar produtos
              const productCount = {};
              myOrders.forEach(order => {
                order.itens.forEach(item => {
                  if (!productCount[item.nome]) {
                    productCount[item.nome] = {
                      quantidade: 0,
                      valor: 0,
                      precoUnitario: item.precoUnitario
                    };
                  }
                  productCount[item.nome].quantidade += item.quantidade;
                  productCount[item.nome].valor += item.quantidade * item.precoUnitario;
                });
              });

              // Ordenar por quantidade e pegar os top 3
              const topProducts = Object.entries(productCount)
                .sort((a, b) => b[1].quantidade - a[1].quantidade)
                .slice(0, 3);

              const productImages = {
                'Óleo de Motor Sintético 5W30': 'https://images.tcdn.com.br/img/img_prod/1027273/oleo_de_motor_mobil_super_5w30_sintetico_api_sp_e_dexos_1_407_2_d22001f9d0a6d6d243be9e7e80c6243f.jpg',
                'Filtro de Óleo Premium': 'https://images.tcdn.com.br/img/img_prod/1153789/filtro_oleo_psl76_tecfil_837_1_1c981ec7c5e235f921b10b3e3b45b9ad.jpg',
                'Kit de Pastilhas de Freio': 'https://images.tcdn.com.br/img/img_prod/673340/n1233_pastilha_freio_tras_tucson_2_0_4x2_4x4_2_7_cobreq_10602_1_b949af85d381d29094712b8dde933e22.jpg',
                'Velas de Ignição - Conjunto com 4': 'https://images.tcdn.com.br/img/img_prod/1027273/velas_de_ignicao_ngk_407_2_d22001f9d0a6d6d243be9e7e80c6243f.jpg',
                'Amortecedor Dianteiro': 'https://images.tcdn.com.br/img/img_prod/1027273/amortecedor_dianteiro_407_2_d22001f9d0a6d6d243be9e7e80c6243f.jpg'
              };

              return topProducts.map(([nome, data], index) => (
                <div key={index} className="flex items-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-md mr-4 flex-shrink-0">
                    <img 
                      src={productImages[nome] || 'https://via.placeholder.com/64'} 
                      alt={nome} 
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{nome}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-sm text-gray-500">{data.quantidade} unidades</span>
                      <span className="text-sm font-medium">R$ {data.valor.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ));
            })()}
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
              {(() => {
                const orders = JSON.parse(localStorage.getItem('autofacil_orders') || '[]');
                const userId = currentUser?.id || 'default_user';
                const myOrders = orders.filter(order => order.compradorId === userId)
                                      .sort((a, b) => new Date(b.data) - new Date(a.data))
                                      .slice(0, 5);
                
                return myOrders.length > 0 ? myOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.vendedorNome || 'Fornecedor'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.data).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      R$ {order.valorTotal.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'entregue' ? 'bg-green-100 text-green-800' :
                        order.status === 'transito' ? 'bg-purple-100 text-purple-800' :
                        order.status === 'separacao' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status === 'entregue' ? 'Entregue' :
                         order.status === 'transito' ? 'Em trânsito' :
                         order.status === 'separacao' ? 'Em separação' :
                         order.status === 'pendente' ? 'Pendente' : order.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      Nenhuma compra realizada ainda
                    </td>
                  </tr>
                );
              })()}
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
          </div>

          <div className="border rounded-lg p-4 bg-green-50">
            <h4 className="font-medium text-green-800 mb-2">Economia em Compras</h4>
            <p className="text-sm text-gray-600 mb-3">Você economizou R$ 320,00 este mês comprando produtos em promoção. Continue assim!</p>
          </div>

          <div className="border rounded-lg p-4 bg-purple-50">
            <h4 className="font-medium text-purple-800 mb-2">Novos Produtos</h4>
            <p className="text-sm text-gray-600 mb-3">Há 12 novos produtos disponíveis no marketplace que podem interessar seu negócio.</p>
          </div>

          <div className="border rounded-lg p-4 bg-yellow-50">
            <h4 className="font-medium text-yellow-800 mb-2">Dica de Gestão</h4>
            <p className="text-sm text-gray-600 mb-3">Fazer pedidos programados pode reduzir seus custos de frete em até 25%.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MecanicoDashboard;