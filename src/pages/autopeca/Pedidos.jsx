import React, { useState, useEffect } from 'react';

const PedidosPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showOrderDetails, setShowOrderDetails] = useState(null);
  
  useEffect(() => {
    // Carregar usuário atual
    const userInfo = sessionStorage.getItem('autofacil_currentUser');
    if (userInfo) {
      setCurrentUser(JSON.parse(userInfo));
    }
    
    // Carregar pedidos do localStorage ou criar pedidos de exemplo
    loadOrders();
  }, []);
  
  useEffect(() => {
    // Filtrar pedidos com base no filtro de status
    if (statusFilter === 'todos') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => order.status === statusFilter);
      setFilteredOrders(filtered);
    }
  }, [statusFilter, orders]);
  
  const loadOrders = () => {
    // Tentar carregar pedidos do localStorage
    let savedOrders = JSON.parse(localStorage.getItem('autofacil_orders') || '[]');
    
    // Se não houver pedidos, criar pedidos de exemplo
    if (savedOrders.length === 0) {
      const exampleOrders = [
        {
          id: '958412',
          vendedorId: currentUser?.id || 'example_user',
          compradorId: 'cliente_1',
          compradorNome: 'Oficina São Pedro',
          data: '2025-05-04T14:30:00',
          valorTotal: 738.90,
          status: 'entregue',
          formaPagamento: 'cartao',
          itens: [
            { produtoId: '1', nome: 'Filtro de Óleo Premium', quantidade: 5, precoUnitario: 25.90 },
            { produtoId: '3', nome: 'Óleo de Motor Sintético 5W30', quantidade: 10, precoUnitario: 45.00 }
          ],
          endereco: {
            rua: 'Rua das Flores, 123',
            cidade: 'Sorocaba',
            estado: 'SP',
            cep: '18040-050'
          },
          rastreamento: 'BR123456789SC',
          entregaEstimada: '2025-05-03',
          entregaRealizada: '2025-05-04'
        },
        {
          id: '958411',
          vendedorId: currentUser?.id || 'example_user',
          compradorId: 'cliente_2',
          compradorNome: 'Auto Center Sorocaba',
          data: '2025-05-03T09:15:00',
          valorTotal: 1245.50,
          status: 'separacao',
          formaPagamento: 'boleto',
          itens: [
            { produtoId: '2', nome: 'Kit de Pastilhas de Freio', quantidade: 3, precoUnitario: 89.90 },
            { produtoId: '5', nome: 'Amortecedor Dianteiro', quantidade: 3, precoUnitario: 249.90 }
          ],
          endereco: {
            rua: 'Av. Ipanema, 456',
            cidade: 'Sorocaba',
            estado: 'SP',
            cep: '18052-000'
          },
          rastreamento: null,
          entregaEstimada: '2025-05-06',
          entregaRealizada: null
        },
        {
          id: '958410',
          vendedorId: currentUser?.id || 'example_user',
          compradorId: 'cliente_3',
          compradorNome: 'Mecânica do João',
          data: '2025-05-03T11:45:00',
          valorTotal: 2875.00,
          status: 'transito',
          formaPagamento: 'pix',
          itens: [
            { produtoId: '4', nome: 'Velas de Ignição - Conjunto com 4', quantidade: 8, precoUnitario: 120.50 },
            { produtoId: '5', nome: 'Amortecedor Dianteiro', quantidade: 5, precoUnitario: 249.90 },
            { produtoId: '3', nome: 'Óleo de Motor Sintético 5W30', quantidade: 10, precoUnitario: 45.00 }
          ],
          endereco: {
            rua: 'Rua Paraíba, 789',
            cidade: 'Votorantim',
            estado: 'SP',
            cep: '18110-020'
          },
          rastreamento: 'BR987654321SC',
          entregaEstimada: '2025-05-05',
          entregaRealizada: null
        },
        {
          id: '958409',
          vendedorId: currentUser?.id || 'example_user',
          compradorId: 'cliente_4',
          compradorNome: 'Center Car Ltda',
          data: '2025-05-02T16:20:00',
          valorTotal: 564.75,
          status: 'entregue',
          formaPagamento: 'cartao',
          itens: [
            { produtoId: '1', nome: 'Filtro de Óleo Premium', quantidade: 8, precoUnitario: 25.90 },
            { produtoId: '4', nome: 'Velas de Ignição - Conjunto com 4', quantidade: 2, precoUnitario: 120.50 }
          ],
          endereco: {
            rua: 'Av. Paulista, 1000',
            cidade: 'São Paulo',
            estado: 'SP',
            cep: '01310-100'
          },
          rastreamento: 'BR456789123SC',
          entregaEstimada: '2025-05-04',
          entregaRealizada: '2025-05-02'
        },
        {
          id: '958408',
          vendedorId: currentUser?.id || 'example_user',
          compradorId: 'cliente_5',
          compradorNome: 'Auto Elétrica Silva',
          data: '2025-05-01T10:00:00',
          valorTotal: 1890.30,
          status: 'entregue',
          formaPagamento: 'pix',
          itens: [
            { produtoId: '4', nome: 'Velas de Ignição - Conjunto com 4', quantidade: 7, precoUnitario: 120.50 },
            { produtoId: '2', nome: 'Kit de Pastilhas de Freio', quantidade: 6, precoUnitario: 89.90 },
            { produtoId: '1', nome: 'Filtro de Óleo Premium', quantidade: 12, precoUnitario: 25.90 }
          ],
          endereco: {
            rua: 'Rua Amazonas, 567',
            cidade: 'Sorocaba',
            estado: 'SP',
            cep: '18040-060'
          },
          rastreamento: 'BR135792468SC',
          entregaEstimada: '2025-05-03',
          entregaRealizada: '2025-05-01'
        }
      ];
      
      // Salvar no localStorage
      localStorage.setItem('autofacil_orders', JSON.stringify(exampleOrders));
      
      setOrders(exampleOrders);
    } else {
      setOrders(savedOrders);
    }
  };
  
  const updateOrderStatus = (orderId, status) => {
    // Atualizar status do pedido
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        // Se o status for 'entregue', atualizar a data de entrega realizada
        if (status === 'entregue') {
          return {
            ...order,
            status,
            entregaRealizada: new Date().toISOString().split('T')[0]
          };
        }
        
        // Para os outros status, apenas atualizar o status
        return { ...order, status };
      }
      return order;
    });
    
    // Atualizar estado e localStorage
    setOrders(updatedOrders);
    localStorage.setItem('autofacil_orders', JSON.stringify(updatedOrders));
    
    // Se o modal de detalhes estiver aberto para este pedido, atualizá-lo também
    if (showOrderDetails && showOrderDetails.id === orderId) {
      setShowOrderDetails(updatedOrders.find(order => order.id === orderId));
    }
  };
  
  const getStatusLabel = (status) => {
    const statusLabels = {
      'pendente': 'Pendente',
      'separacao': 'Em separação',
      'transito': 'Em trânsito',
      'entregue': 'Entregue',
      'cancelado': 'Cancelado'
    };
    
    return statusLabels[status] || status;
  };
  
  const getStatusColor = (status) => {
    const statusColors = {
      'pendente': 'yellow',
      'separacao': 'blue',
      'transito': 'purple',
      'entregue': 'green',
      'cancelado': 'red'
    };
    
    return statusColors[status] || 'gray';
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const formatPaymentMethod = (method) => {
    const methods = {
      'cartao': 'Cartão de Crédito',
      'boleto': 'Boleto Bancário',
      'pix': 'PIX',
      'transferencia': 'Transferência'
    };
    
    return methods[method] || method;
  };
  
  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pedidos</h1>
      
      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('todos')}
          className={`px-4 py-2 text-sm rounded-full ${
            statusFilter === 'todos'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setStatusFilter('pendente')}
          className={`px-4 py-2 text-sm rounded-full ${
            statusFilter === 'pendente'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          Pendentes
        </button>
        <button
          onClick={() => setStatusFilter('separacao')}
          className={`px-4 py-2 text-sm rounded-full ${
            statusFilter === 'separacao'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          Em Separação
        </button>
        <button
          onClick={() => setStatusFilter('transito')}
          className={`px-4 py-2 text-sm rounded-full ${
            statusFilter === 'transito'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          Em Trânsito
        </button>
        <button
          onClick={() => setStatusFilter('entregue')}
          className={`px-4 py-2 text-sm rounded-full ${
            statusFilter === 'entregue'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          Entregues
        </button>
        <button
          onClick={() => setStatusFilter('cancelado')}
          className={`px-4 py-2 text-sm rounded-full ${
            statusFilter === 'cancelado'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          Cancelados
        </button>
      </div>
      
      {/* Tabela de pedidos */}
      <div className="bg-white shadow overflow-hidden rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pedido
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
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
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entrega
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.compradorNome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.data)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    R$ {order.valorTotal.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.status === 'entregue' ? (
                      <span className="text-green-600">{formatDate(order.entregaRealizada)}</span>
                    ) : (
                      <span>Prev: {formatDate(order.entregaEstimada)}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowOrderDetails(order)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Detalhes
                      </button>
                      {order.status !== 'entregue' && order.status !== 'cancelado' && (
                        <div className="relative group">
                          <button className="text-gray-600 hover:text-gray-900">
                            Atualizar
                          </button>
                          <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 hidden group-hover:block z-10">
                            <div className="py-1" role="menu" aria-orientation="vertical">
                              {order.status === 'pendente' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'separacao')}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  Iniciar Separação
                                </button>
                              )}
                              {order.status === 'separacao' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'transito')}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  Enviar para Entrega
                                </button>
                              )}
                              {order.status === 'transito' && (
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'entregue')}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                >
                                  Marcar como Entregue
                                </button>
                              )}
                              <button
                                onClick={() => updateOrderStatus(order.id, 'cancelado')}
                                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                              >
                                Cancelar Pedido
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                  Nenhum pedido encontrado com o filtro selecionado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal de detalhes do pedido */}
      {showOrderDetails && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl transform transition-all sm:max-w-4xl w-full">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900">
                Pedido #{showOrderDetails.id}
              </h3>
              <button
                onClick={() => setShowOrderDetails(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Informações do Pedido</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Cliente:</span>
                      <p className="font-medium">{showOrderDetails.compradorNome}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Data do Pedido:</span>
                      <p className="font-medium">{formatDate(showOrderDetails.data)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Forma de Pagamento:</span>
                      <p className="font-medium">{formatPaymentMethod(showOrderDetails.formaPagamento)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status:</span>
                      <p>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${getStatusColor(showOrderDetails.status)}-100 text-${getStatusColor(showOrderDetails.status)}-800`}>
                          {getStatusLabel(showOrderDetails.status)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Endereço de Entrega</h4>
                  <div className="space-y-2">
                    <p className="font-medium">{showOrderDetails.endereco.rua}</p>
                    <p>{showOrderDetails.endereco.cidade}, {showOrderDetails.endereco.estado}</p>
                    <p>CEP: {showOrderDetails.endereco.cep}</p>
                  </div>
                </div>
                
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Informações de Entrega</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Código de Rastreio:</span>
                      <p className="font-medium">{showOrderDetails.rastreamento || 'Não disponível'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Previsão de Entrega:</span>
                      <p className="font-medium">{formatDate(showOrderDetails.entregaEstimada)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Data de Entrega:</span>
                      <p className="font-medium">{formatDate(showOrderDetails.entregaRealizada) || 'Não entregue'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <h4 className="text-sm font-medium text-gray-500 px-4 py-3 bg-gray-50 border-b">
                  Itens do Pedido
                </h4>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produto
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantidade
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Preço Unitário
                      </th>
                      <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {showOrderDetails.itens.map((item, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.nome}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                          {item.quantidade}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                          R$ {item.precoUnitario.toFixed(2)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                          R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-gray-50">
                      <td colSpan="3" className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                        Total do Pedido:
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-base font-bold text-gray-900 text-right">
                        R$ {showOrderDetails.valorTotal.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Informações de rastreamento */}
              {showOrderDetails.rastreamento && showOrderDetails.status !== 'pendente' && showOrderDetails.status !== 'separacao' && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Status da Entrega</h4>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-between">
                      <div className="flex flex-col items-center">
                        <div className={`h-5 w-5 rounded-full ${showOrderDetails.status !== 'pendente' ? 'bg-green-500' : 'bg-gray-200'} border-white`}></div>
                        <div className="text-xs font-medium mt-2">Pedido Recebido</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`h-5 w-5 rounded-full ${showOrderDetails.status !== 'pendente' ? 'bg-green-500' : 'bg-gray-200'} border-white`}></div>
                        <div className="text-xs font-medium mt-2">Em Separação</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`h-5 w-5 rounded-full ${showOrderDetails.status === 'transito' || showOrderDetails.status === 'entregue' ? 'bg-green-500' : 'bg-gray-200'} border-white`}></div>
                        <div className="text-xs font-medium mt-2">Em Trânsito</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`h-5 w-5 rounded-full ${showOrderDetails.status === 'entregue' ? 'bg-green-500' : 'bg-gray-200'} border-white`}></div>
                        <div className="text-xs font-medium mt-2">Entregue</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
              <button
                onClick={() => setShowOrderDetails(null)}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Fechar
              </button>
              
              {showOrderDetails.status !== 'entregue' && showOrderDetails.status !== 'cancelado' && (
                <div className="flex space-x-3">
                  {showOrderDetails.status === 'pendente' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(showOrderDetails.id, 'separacao');
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Iniciar Separação
                    </button>
                  )}
                  {showOrderDetails.status === 'separacao' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(showOrderDetails.id, 'transito');
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                    >
                      Enviar para Entrega
                    </button>
                  )}
                  {showOrderDetails.status === 'transito' && (
                    <button
                      onClick={() => {
                        updateOrderStatus(showOrderDetails.id, 'entregue');
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Marcar como Entregue
                    </button>
                  )}
                  <button
                    onClick={() => {
                      updateOrderStatus(showOrderDetails.id, 'cancelado');
                    }}
                    className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                  >
                    Cancelar Pedido
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PedidosPage;