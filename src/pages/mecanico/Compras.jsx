import React, { useState, useEffect } from 'react';

const ComprasPage = () => {
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
  }, []);

  useEffect(() => {
    // Só carregar pedidos depois que tiver o usuário
    if (currentUser !== null) {
      loadOrders();
    }
  }, [currentUser]);
  
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
    
    // Obter o ID do usuário atual
    const userId = currentUser?.id || 'default_user';
    
    // Se não houver pedidos, criar pedidos de exemplo
    if (savedOrders.length === 0 || !savedOrders.some(order => order.compradorId === userId)) {
      const exampleOrders = [
        {
          id: '123456',
          compradorId: userId,
          compradorNome: currentUser?.nomeEmpresa || 'Mecânica Padrão',
          vendedorId: 'vendor_1',
          vendedorNome: 'Auto Peças Silva',
          data: '2025-05-04T14:30:00',
          valorTotal: 359.90,
          status: 'entregue',
          formaPagamento: 'cartao',
          itens: [
            { produtoId: '1', nome: 'Filtro de Óleo Premium', quantidade: 5, precoUnitario: 25.90 },
            { produtoId: '3', nome: 'Óleo de Motor Sintético 5W30', quantidade: 4, precoUnitario: 45.00 }
          ],
          endereco: {
            rua: 'Rua das Flores, 123',
            cidade: 'Sorocaba',
            estado: 'SP',
            cep: '18040-050'
          },
          rastreamento: 'BR123456789SC',
          entregaEstimada: '2025-05-07',
          entregaRealizada: '2025-05-23'
        },
        {
          id: '123455',
          compradorId: userId,
          compradorNome: currentUser?.nomeEmpresa || 'Mecânica Padrão',
          vendedorId: 'vendor_2',
          vendedorNome: 'Distribuidora de Peças Automotivas',
          data: '2025-05-02T09:15:00',
          valorTotal: 845.30,
          status: 'entregue',
          formaPagamento: 'boleto',
          itens: [
            { produtoId: '2', nome: 'Kit de Pastilhas de Freio', quantidade: 3, precoUnitario: 89.90 },
            { produtoId: '5', nome: 'Amortecedor Dianteiro', quantidade: 2, precoUnitario: 249.90 }
          ],
          endereco: {
            rua: 'Rua das Flores, 123',
            cidade: 'Sorocaba',
            estado: 'SP',
            cep: '18040-050'
          },
          rastreamento: 'BR987654321SC',
          entregaEstimada: '2025-05-05',
          entregaRealizada: '2025-05-03'
        },
        {
          id: '123454',
          compradorId: userId,
          compradorNome: currentUser?.nomeEmpresa || 'Mecânica Padrão',
          vendedorId: 'vendor_3',
          vendedorNome: 'Auto Peças Total',
          data: '2025-04-29T11:45:00',
          valorTotal: 1250.00,
          status: 'entregue',
          formaPagamento: 'pix',
          itens: [
            { produtoId: '4', nome: 'Velas de Ignição - Conjunto com 4', quantidade: 5, precoUnitario: 120.50 },
            { produtoId: '5', nome: 'Amortecedor Dianteiro', quantidade: 2, precoUnitario: 249.90 }
          ],
          endereco: {
            rua: 'Rua das Flores, 123',
            cidade: 'Sorocaba',
            estado: 'SP',
            cep: '18040-050'
          },
          rastreamento: 'BR135792468SC',
          entregaEstimada: '2025-05-02',
          entregaRealizada: '2025-05-01'
        },
        {
          id: '123453',
          compradorId: userId,
          compradorNome: currentUser?.nomeEmpresa || 'Mecânica Padrão',
          vendedorId: 'vendor_4',
          vendedorNome: 'Peças & Acessórios',
          data: '2025-04-25T16:20:00',
          valorTotal: 560.75,
          status: 'entregue',
          formaPagamento: 'cartao',
          itens: [
            { produtoId: '1', nome: 'Filtro de Óleo Premium', quantidade: 8, precoUnitario: 25.90 },
            { produtoId: '4', nome: 'Velas de Ignição - Conjunto com 4', quantidade: 2, precoUnitario: 120.50 }
          ],
          endereco: {
            rua: 'Rua das Flores, 123',
            cidade: 'Sorocaba',
            estado: 'SP',
            cep: '18040-050'
          },
          rastreamento: 'BR246813579SC',
          entregaEstimada: '2025-04-28',
          entregaRealizada: '2025-04-27'
        },
        {
          id: '123452',
          compradorId: userId,
          compradorNome: currentUser?.nomeEmpresa || 'Mecânica Padrão',
          vendedorId: 'vendor_1',
          vendedorNome: 'Auto Peças Silva',
          data: '2025-04-22T10:00:00',
          valorTotal: 425.00,
          status: 'entregue',
          formaPagamento: 'pix',
          itens: [
            { produtoId: '3', nome: 'Óleo de Motor Sintético 5W30', quantidade: 6, precoUnitario: 45.00 },
            { produtoId: '1', nome: 'Filtro de Óleo Premium', quantidade: 5, precoUnitario: 25.90 }
          ],
          endereco: {
            rua: 'Rua das Flores, 123',
            cidade: 'Sorocaba',
            estado: 'SP',
            cep: '18040-050'
          },
          rastreamento: 'BR975318642SC',
          entregaEstimada: '2025-04-25',
          entregaRealizada: '2025-04-24'
        }
      ];
      
      // Adicionar pedidos de exemplo para o usuário atual
      savedOrders = [...savedOrders, ...exampleOrders];
      
      // Salvar no localStorage
      localStorage.setItem('autofacil_orders', JSON.stringify(savedOrders));
    }
    
    // Filtrar apenas os pedidos do usuário atual
    const myOrders = savedOrders.filter(order => 
      order.compradorId === userId
    );
    
    // Ordenar por data (mais recente primeiro)
    myOrders.sort((a, b) => new Date(b.data) - new Date(a.data));
    
    setOrders(myOrders);
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
      'pendente': 'bg-yellow-100 text-yellow-800',
      'separacao': 'bg-blue-100 text-blue-800',
      'transito': 'bg-purple-100 text-purple-800',
      'entregue': 'bg-green-100 text-green-800',
      'cancelado': 'bg-red-100 text-red-800'
    };
    
    return statusColors[status] || 'bg-gray-100 text-gray-800';
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
      <h1 className="text-2xl font-bold mb-6">Minhas Compras</h1>
      
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
                    {order.vendedorNome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.data)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    R$ {order.valorTotal.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
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
                    <button
                      onClick={() => setShowOrderDetails(order)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Detalhes
                    </button>
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
          <div className="bg-white rounded-lg shadow-xl transform transition-all sm:max-w-4xl w-full max-h-[80vh] overflow-y-auto">
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
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Informações do Pedido</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Fornecedor:</span>
                      <p className="font-medium">{showOrderDetails.vendedorNome}</p>
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
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(showOrderDetails.status)}`}>
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
              
              {/* Tabela de itens do pedido */}
              <div className="border rounded-md overflow-hidden mb-6">
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
                        <div className={`h-5 w-5 rounded-full border-white ${showOrderDetails.status !== 'pendente' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                        <div className="text-xs font-medium mt-2">Pedido Recebido</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`h-5 w-5 rounded-full border-white ${showOrderDetails.status !== 'pendente' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                        <div className="text-xs font-medium mt-2">Em Separação</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`h-5 w-5 rounded-full border-white ${showOrderDetails.status === 'transito' || showOrderDetails.status === 'entregue' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                        <div className="text-xs font-medium mt-2">Em Trânsito</div>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`h-5 w-5 rounded-full border-white ${showOrderDetails.status === 'entregue' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                        <div className="text-xs font-medium mt-2">Entregue</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Detalhes do rastreamento */}
                  <div className="mt-8 border rounded-md overflow-hidden">
                    <h4 className="text-sm font-medium text-gray-500 px-4 py-3 bg-gray-50 border-b">
                      Detalhes do Rastreamento - {showOrderDetails.rastreamento}
                    </h4>
                    <div className="p-4">
                      <div className="space-y-4">
                        {showOrderDetails.status === 'entregue' && (
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-4">
                              <h5 className="text-sm font-medium text-gray-900">Entrega realizada</h5>
                              <p className="text-sm text-gray-500">
                                {formatDate(showOrderDetails.entregaRealizada)} às {new Date(showOrderDetails.entregaRealizada).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {(showOrderDetails.status === 'transito' || showOrderDetails.status === 'entregue') && (
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-4">
                              <h5 className="text-sm font-medium text-gray-900">Em trânsito</h5>
                              <p className="text-sm text-gray-500">
                                Produto em rota de entrega
                              </p>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-4">
                            <h5 className="text-sm font-medium text-gray-900">Pedido em separação</h5>
                            <p className="text-sm text-gray-500">
                              Produto está sendo preparado para envio
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-4">
                            <h5 className="text-sm font-medium text-gray-900">Pedido recebido</h5>
                            <p className="text-sm text-gray-500">
                              O pedido foi recebido e está sendo processado
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t">
              <button
                onClick={() => setShowOrderDetails(null)}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComprasPage;