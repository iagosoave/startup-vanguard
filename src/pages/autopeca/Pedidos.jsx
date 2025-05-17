import React, { useState, useEffect } from 'react';

const PedidosPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showOrderDetails, setShowOrderDetails] = useState(null);
  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    // Carregar usuário atual
    let user = null;
    const userInfo = sessionStorage.getItem('autofacil_currentUser');
    if (userInfo) {
      user = JSON.parse(userInfo);
      setCurrentUser(user);
    }

    // Carregar pedidos do localStorage ou criar pedidos de exemplo
    // Pass the resolved user object to loadOrders
    loadOrders(user);
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

  // Modified to accept userForExamples for correct vendedorId in example data
  const loadOrders = (userForExamples) => {
    // Tentar carregar pedidos do localStorage
    let savedOrders = JSON.parse(localStorage.getItem('autofacil_orders') || '[]');

    // Se não houver pedidos, criar pedidos de exemplo
    if (savedOrders.length === 0) {
      const exampleOrders = [
        {
          id: '958412',
          vendedorId: userForExamples?.id || 'example_user', // Use passed user
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
          vendedorId: userForExamples?.id || 'example_user', // Use passed user
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
          vendedorId: userForExamples?.id || 'example_user', // Use passed user
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
          vendedorId: userForExamples?.id || 'example_user', // Use passed user
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
          vendedorId: userForExamples?.id || 'example_user', // Use passed user
          compradorId: 'cliente_5',
          compradorNome: 'Auto Elétrica Silva',
          data: '2025-05-01T10:00:00',
          valorTotal: 1890.30,
          status: 'pendente',
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
          rastreamento: null,
          entregaEstimada: '2025-05-03',
          entregaRealizada: null
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
        let updatedOrderData = { ...order, status };

        // Se o status for 'entregue', atualizar a data de entrega realizada
        if (status === 'entregue') {
          updatedOrderData.entregaRealizada = new Date().toISOString().split('T')[0];
          // Garante que há um código de rastreamento ao marcar como entregue, se não houver
          if (!updatedOrderData.rastreamento) {
            updatedOrderData.rastreamento = `BR${Math.floor(Math.random() * 1000000000)}SC`;
          }
        }
        
        // Se mudar para trânsito e não tiver rastreamento, gerar um
        if (status === 'transito' && !order.rastreamento) {
          updatedOrderData.rastreamento = `BR${Math.floor(Math.random() * 1000000000)}SC`;
        }
        
        return updatedOrderData;
      }
      return order;
    });

    // Atualizar estado e localStorage
    setOrders(updatedOrders);
    localStorage.setItem('autofacil_orders', JSON.stringify(updatedOrders));

    // Fechar dropdown
    setOpenDropdowns({});

    // Se o modal de detalhes estiver aberto para este pedido, atualizá-lo também
    if (showOrderDetails && showOrderDetails.id === orderId) {
      setShowOrderDetails(updatedOrders.find(o => o.id === orderId));
    }
  };

  const toggleDropdown = (orderId) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
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

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'pendente': { status: 'separacao', label: 'Iniciar Separação', color: 'blue' },
      'separacao': { status: 'transito', label: 'Enviar para Entrega', color: 'purple' },
      'transito': { status: 'entregue', label: 'Marcar como Entregue', color: 'green' }
    };

    return statusFlow[currentStatus] || null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';

    const date = new Date(dateString);
    // Ensure date is valid before formatting
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' }); // Added timeZone UTC to avoid off-by-one day issues
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
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">Gerenciar Pedidos</h1>

      {/* Filtros */}
      <div className="mb-8 flex flex-wrap gap-3">
        <button
          onClick={() => setStatusFilter('todos')}
          className={`px-6 py-3 text-sm font-medium rounded-lg transition-all ${
            statusFilter === 'todos'
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Todos Pedidos
        </button>
        <button
          onClick={() => setStatusFilter('pendente')}
          className={`px-6 py-3 text-sm font-medium rounded-lg transition-all ${
            statusFilter === 'pendente'
              ? 'bg-yellow-500 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Pendentes
        </button>
        <button
          onClick={() => setStatusFilter('separacao')}
          className={`px-6 py-3 text-sm font-medium rounded-lg transition-all ${
            statusFilter === 'separacao'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Em Separação
        </button>
        <button
          onClick={() => setStatusFilter('transito')}
          className={`px-6 py-3 text-sm font-medium rounded-lg transition-all ${
            statusFilter === 'transito'
              ? 'bg-purple-500 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Em Trânsito
        </button>
        <button
          onClick={() => setStatusFilter('entregue')}
          className={`px-6 py-3 text-sm font-medium rounded-lg transition-all ${
            statusFilter === 'entregue'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Entregues
        </button>
        <button
          onClick={() => setStatusFilter('cancelado')}
          className={`px-6 py-3 text-sm font-medium rounded-lg transition-all ${
            statusFilter === 'cancelado'
              ? 'bg-red-500 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Cancelados
        </button>
      </div>

      {/* Tabela de pedidos */}
      {/* Added overflow-x-auto here for horizontal scrolling on smaller screens */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pedido
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Entrega
              </th>
              <th scope="col" className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[280px]"> {/* Min width for actions column */}
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const nextStatusInfo = getNextStatus(order.status); // Renamed for clarity

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.compradorNome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.data)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                      R$ {order.valorTotal.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.status === 'entregue' ? (
                        <span className="text-green-600 font-medium">{formatDate(order.entregaRealizada)}</span>
                      ) : (
                        <span>Prev: {formatDate(order.entregaEstimada)}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {/* Botão de visualizar detalhes */}
                        <button
                          onClick={() => setShowOrderDetails(order)}
                          className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                          title="Ver detalhes"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Detalhes
                        </button>

                        {/* Ações de status - Botões diretos ou dropdown */}
                        {order.status !== 'entregue' && order.status !== 'cancelado' && (
                          <>
                            {/* Botão de próximo status (mais visível) */}
                            {nextStatusInfo && (
                              <button
                                onClick={() => updateOrderStatus(order.id, nextStatusInfo.status)}
                                className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-${nextStatusInfo.color}-600 rounded-lg hover:bg-${nextStatusInfo.color}-700 transition-colors shadow-sm`}
                                title={nextStatusInfo.label}
                              >
                                {nextStatusInfo.status === 'separacao' && (
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                  </svg>
                                )}
                                {nextStatusInfo.status === 'transito' && (
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                                  </svg>
                                )}
                                {nextStatusInfo.status === 'entregue' && (
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                )}
                                {nextStatusInfo.label}
                              </button>
                            )}

                            {/* Dropdown para outras ações */}
                            <div className="relative">
                              <button
                                onClick={() => toggleDropdown(order.id)}
                                onBlur={() => setTimeout(() => setOpenDropdowns(prev => ({...prev, [order.id]: false })), 200)} // Close specific dropdown
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                title="Mais ações"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                </svg>
                              </button>
                              
                              {openDropdowns[order.id] && (
                                <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
                                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                    <button
                                      onClick={() => updateOrderStatus(order.id, 'cancelado')}
                                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                                      role="menuitem"
                                    >
                                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                      </svg>
                                      Cancelar Pedido
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </>
                        )}

                        {/* Para pedidos finalizados, mostrar apenas detalhes */}
                        {(order.status === 'entregue' || order.status === 'cancelado') && (
                          <span className="text-xs text-gray-500 italic ml-2"> {/* Added ml-2 for spacing */}
                            {order.status === 'entregue' ? 'Pedido concluído' : 'Pedido cancelado'}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum pedido encontrado</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Não há pedidos com o filtro selecionado ou nenhum pedido cadastrado.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal de detalhes do pedido */}
      {showOrderDetails && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl transform transition-all sm:max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Pedido #{showOrderDetails.id}
              </h3>
              <button
                onClick={() => setShowOrderDetails(null)}
                className="text-gray-400 hover:text-gray-500 transition-colors"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Informações do Pedido</h4>
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
                
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Endereço de Entrega</h4>
                  <div className="space-y-2">
                    <p className="font-medium">{showOrderDetails.endereco.rua}</p>
                    <p>{showOrderDetails.endereco.cidade}, {showOrderDetails.endereco.estado}</p>
                    <p>CEP: {showOrderDetails.endereco.cep}</p>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Informações de Entrega</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-500">Código de Rastreio:</span>
                      <p className="font-medium font-mono">{showOrderDetails.rastreamento || 'Não disponível'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Previsão de Entrega:</span>
                      <p className="font-medium">{formatDate(showOrderDetails.entregaEstimada)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Data de Entrega:</span>
                      <p className="font-medium">{formatDate(showOrderDetails.entregaRealizada) || (showOrderDetails.status === 'cancelado' ? 'Cancelado' : 'Não entregue')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border rounded-lg overflow-hidden mb-6">
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
              {showOrderDetails.rastreamento && showOrderDetails.status !== 'pendente' && showOrderDetails.status !== 'separacao' && showOrderDetails.status !== 'cancelado' && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-4">Status da Entrega</h4>
                  <ol className="relative text-gray-500 border-l border-gray-200 dark:border-gray-700 dark:text-gray-400">                  
                    <li className="mb-6 ml-6">            
                        <span className={`absolute flex items-center justify-center w-4 h-4 rounded-full -left-2 ring-4 ring-white
                                        ${showOrderDetails.status !== 'pendente' ? 'bg-green-500' : 'bg-gray-300'}`}>
                        </span>
                        <h3 className="font-medium leading-tight">Pedido Recebido</h3>
                        {/* <p className="text-sm">Data</p> */}
                    </li>
                    <li className="mb-6 ml-6">
                        <span className={`absolute flex items-center justify-center w-4 h-4 rounded-full -left-2 ring-4 ring-white
                                        ${showOrderDetails.status !== 'pendente' ? 'bg-green-500' : 'bg-gray-300'}`}>
                        </span>
                        <h3 className="font-medium leading-tight">Em Separação</h3>
                    </li>
                    <li className="mb-6 ml-6">
                        <span className={`absolute flex items-center justify-center w-4 h-4 rounded-full -left-2 ring-4 ring-white
                                        ${showOrderDetails.status === 'transito' || showOrderDetails.status === 'entregue' ? 'bg-green-500' : 'bg-gray-300'}`}>
                        </span>
                        <h3 className="font-medium leading-tight">Em Trânsito</h3>
                    </li>
                    <li className="ml-6">
                        <span className={`absolute flex items-center justify-center w-4 h-4 rounded-full -left-2 ring-4 ring-white
                                        ${showOrderDetails.status === 'entregue' ? 'bg-green-500' : 'bg-gray-300'}`}>
                        </span>
                        <h3 className="font-medium leading-tight">Entregue</h3>
                        {showOrderDetails.status === 'entregue' && showOrderDetails.entregaRealizada && (
                            <p className="text-sm">Em {formatDate(showOrderDetails.entregaRealizada)}</p>
                        )}
                    </li>
                  </ol>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
              <button
                onClick={() => setShowOrderDetails(null)}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Fechar
              </button>
              
              {showOrderDetails.status !== 'entregue' && showOrderDetails.status !== 'cancelado' && (
                <div className="flex space-x-3">
                  {getNextStatus(showOrderDetails.status) && (
                    <button
                      onClick={() => {
                        const nextStatusModal = getNextStatus(showOrderDetails.status);
                        if (nextStatusModal) { // Check if nextStatusModal is not null
                            updateOrderStatus(showOrderDetails.id, nextStatusModal.status);
                        }
                      }}
                      className={`px-4 py-2 bg-${getNextStatus(showOrderDetails.status)?.color}-600 text-white rounded-md hover:bg-${getNextStatus(showOrderDetails.status)?.color}-700 transition-colors`}
                    >
                      {getNextStatus(showOrderDetails.status)?.label}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      updateOrderStatus(showOrderDetails.id, 'cancelado');
                    }}
                    className="px-4 py-2 bg-white text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
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