import React, { useState, useEffect } from 'react';

const PedidosPage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('todos');
  const [showOrderDetails, setShowOrderDetails] = useState(null);

  useEffect(() => {
    let user = null;
    const userInfo = sessionStorage.getItem('autofacil_currentUser');
    if (userInfo) {
      user = JSON.parse(userInfo);
      setCurrentUser(user);
    }
    loadOrders(user);
  }, []);

  useEffect(() => {
    if (statusFilter === 'todos') {
      setFilteredOrders(orders);
    } else {
      // Filtrar apenas pedidos que tenham status válido
      const filtered = orders.filter(order => {
        return order.status && order.status === statusFilter;
      });
      setFilteredOrders(filtered);
    }
  }, [statusFilter, orders]);

  const loadOrders = (userForExamples) => {
    let savedOrders = JSON.parse(localStorage.getItem('autofacil_orders') || '[]');
    
    // Validar e corrigir estrutura dos pedidos existentes
    savedOrders = savedOrders.map(order => {
      // Garantir que todos os campos obrigatórios existam
      return {
        id: order.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        vendedorId: order.vendedorId || userForExamples?.id || 'unknown',
        compradorId: order.compradorId || 'unknown',
        compradorNome: order.compradorNome || 'Cliente',
        data: order.data || new Date().toISOString(),
        valorTotal: order.valorTotal || 0,
        status: order.status || 'pendente',
        formaPagamento: order.formaPagamento || 'cartao',
        itens: order.itens || [],
        endereco: order.endereco || {
          rua: 'Endereço não informado',
          cidade: 'Cidade',
          estado: 'SP',
          cep: '00000-000'
        },
        rastreamento: order.rastreamento || null,
        entregaEstimada: order.entregaEstimada || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        entregaRealizada: order.entregaRealizada || null
      };
    });

    if (savedOrders.length === 0) {
      const exampleOrders = [
        {
          id: '123456',
          vendedorId: userForExamples?.id || 'example_user',
          compradorId: 'cliente_1',
          compradorNome: 'Oficina São Pedro',
          data: '2025-06-04T14:30:00',
          valorTotal: 359.90,
          status: 'transito',
          formaPagamento: 'cartao',
          itens: [
            { produtoId: '1', nome: 'Filtro de Óleo Premium', quantidade: 5, precoUnitario: 25.90 },
            { produtoId: '3', nome: 'Óleo de Motor 5W30', quantidade: 5, precoUnitario: 46.00 }
          ],
          endereco: {
            rua: 'Rua das Flores, 123',
            cidade: 'Sorocaba',
            estado: 'SP',
            cep: '18040-050'
          },
          rastreamento: 'BR123456789SC',
          entregaEstimada: '2025-06-07',
          entregaRealizada: null
        },
        {
          id: '123455',
          vendedorId: userForExamples?.id || 'example_user',
          compradorId: 'cliente_2',
          compradorNome: 'Auto Center Sorocaba',
          data: '2025-06-03T09:15:00',
          valorTotal: 269.70,
          status: 'separacao',
          formaPagamento: 'boleto',
          itens: [
            { produtoId: '2', nome: 'Kit Pastilhas de Freio', quantidade: 3, precoUnitario: 89.90 }
          ],
          endereco: {
            rua: 'Av. Ipanema, 456',
            cidade: 'Sorocaba',
            estado: 'SP',
            cep: '18052-000'
          },
          rastreamento: null,
          entregaEstimada: '2025-06-06',
          entregaRealizada: null
        },
        {
          id: '123454',
          vendedorId: userForExamples?.id || 'example_user',
          compradorId: 'cliente_3',
          compradorNome: 'Mecânica do João',
          data: '2025-06-02T11:45:00',
          valorTotal: 482.00,
          status: 'entregue',
          formaPagamento: 'pix',
          itens: [
            { produtoId: '4', nome: 'Velas de Ignição (4un)', quantidade: 4, precoUnitario: 120.50 }
          ],
          endereco: {
            rua: 'Rua Paraíba, 789',
            cidade: 'Votorantim',
            estado: 'SP',
            cep: '18110-020'
          },
          rastreamento: 'BR987654321SC',
          entregaEstimada: '2025-06-05',
          entregaRealizada: '2025-06-02'
        },
        {
          id: '123453',
          vendedorId: userForExamples?.id || 'example_user',
          compradorId: 'cliente_4',
          compradorNome: 'Retífica Central',
          data: '2025-06-01T15:20:00',
          valorTotal: 129.50,
          status: 'pendente',
          formaPagamento: 'pix',
          itens: [
            { produtoId: '1', nome: 'Filtro de Óleo Premium', quantidade: 5, precoUnitario: 25.90 }
          ],
          endereco: {
            rua: 'Rua Antonio João, 234',
            cidade: 'Sorocaba',
            estado: 'SP',
            cep: '18040-070'
          },
          rastreamento: null,
          entregaEstimada: '2025-06-04',
          entregaRealizada: null
        },
        {
          id: '123452',
          vendedorId: userForExamples?.id || 'example_user',
          compradorId: 'cliente_5',
          compradorNome: 'Auto Peças Boa Vista',
          data: '2025-05-30T10:00:00',
          valorTotal: 749.70,
          status: 'cancelado',
          formaPagamento: 'boleto',
          itens: [
            { produtoId: '5', nome: 'Amortecedor Dianteiro', quantidade: 3, precoUnitario: 249.90 }
          ],
          endereco: {
            rua: 'Av. General Carneiro, 890',
            cidade: 'Sorocaba',
            estado: 'SP',
            cep: '18043-000'
          },
          rastreamento: null,
          entregaEstimada: '2025-06-02',
          entregaRealizada: null
        }
      ];

      localStorage.setItem('autofacil_orders', JSON.stringify(exampleOrders));
      setOrders(exampleOrders);
    } else {
      // Salvar pedidos validados de volta no localStorage
      localStorage.setItem('autofacil_orders', JSON.stringify(savedOrders));
      setOrders(savedOrders);
    }
  };

  const updateOrderStatus = (orderId, status) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        let updatedOrderData = { ...order, status };

        if (status === 'entregue') {
          updatedOrderData.entregaRealizada = new Date().toISOString().split('T')[0];
          if (!updatedOrderData.rastreamento) {
            updatedOrderData.rastreamento = `BR${Math.floor(Math.random() * 1000000000)}SC`;
          }
        }
        
        if (status === 'transito' && !order.rastreamento) {
          updatedOrderData.rastreamento = `BR${Math.floor(Math.random() * 1000000000)}SC`;
        }
        
        return updatedOrderData;
      }
      return order;
    });

    setOrders(updatedOrders);
    localStorage.setItem('autofacil_orders', JSON.stringify(updatedOrders));

    if (showOrderDetails && showOrderDetails.id === orderId) {
      setShowOrderDetails(updatedOrders.find(o => o.id === orderId));
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

  const getStatusStyle = (status) => {
    const styles = {
      'pendente': 'bg-yellow-100 text-yellow-800',
      'separacao': 'bg-blue-100 text-blue-800',
      'transito': 'bg-purple-100 text-purple-800',
      'entregue': 'bg-green-100 text-green-800',
      'cancelado': 'bg-red-100 text-red-800'
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      'pendente': { status: 'separacao', label: 'Iniciar Separação' },
      'separacao': { status: 'transito', label: 'Enviar para Entrega' },
      'transito': { status: 'entregue', label: 'Confirmar Entrega' }
    };
    return statusFlow[currentStatus] || null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  const formatPaymentMethod = (method) => {
    const methods = {
      'cartao': 'Cartão',
      'boleto': 'Boleto',
      'pix': 'PIX',
      'transferencia': 'Transferência'
    };
    return methods[method] || method;
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Gerenciar Pedidos</h1>

      {/* Filtros - Mais compactos */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('todos')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            statusFilter === 'todos'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setStatusFilter('pendente')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            statusFilter === 'pendente'
              ? 'bg-yellow-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pendentes
        </button>
        <button
          onClick={() => setStatusFilter('separacao')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            statusFilter === 'separacao'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Em Separação
        </button>
        <button
          onClick={() => setStatusFilter('transito')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            statusFilter === 'transito'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Em Trânsito
        </button>
        <button
          onClick={() => setStatusFilter('entregue')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            statusFilter === 'entregue'
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Entregues
        </button>
        <button
          onClick={() => setStatusFilter('cancelado')}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
            statusFilter === 'cancelado'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Cancelados
        </button>
      </div>

      {/* Lista de Pedidos - Design mais compacto */}
      <div className="bg-white rounded-lg shadow-sm">
        {filteredOrders.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredOrders.map((order) => {
              const nextStatus = getNextStatus(order.status);
              return (
                <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Informações principais em linha */}
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-base font-bold text-gray-900">
                          Pedido #{order.id}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{order.compradorNome || 'Cliente não informado'}</p>
                      
                      {/* Grid compacto de informações */}
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm">
                        <div className="flex gap-1">
                          <span className="text-gray-500">Data:</span>
                          <span className="font-medium">{formatDate(order.data)}</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-gray-500">Valor Total:</span>
                          <span className="font-bold">R$ {(order.valorTotal || 0).toFixed(2)}</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-gray-500">Pagamento:</span>
                          <span className="font-medium">{formatPaymentMethod(order.formaPagamento)}</span>
                        </div>
                        <div className="flex gap-1">
                          <span className="text-gray-500">Entrega:</span>
                          <span className="font-medium">
                            {order.status === 'entregue' 
                              ? <span className="text-green-600">{formatDate(order.entregaRealizada)}</span>
                              : `Prev: ${formatDate(order.entregaEstimada)}`
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Ações - mais compactas */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowOrderDetails(order)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
                      >
                        Ver Detalhes
                      </button>
                      
                      {nextStatus && (
                        <button
                          onClick={() => updateOrderStatus(order.id, nextStatus.status)}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                          {nextStatus.label}
                        </button>
                      )}
                      
                      {order.status !== 'entregue' && order.status !== 'cancelado' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelado')}
                          className="px-3 py-1.5 bg-white text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors text-sm font-medium"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum pedido encontrado</h3>
            <p className="text-gray-500">Não há pedidos com o status selecionado.</p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes - Mantido mas com melhorias */}
      {showOrderDetails && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            {/* Header */}
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
            
            {/* Conteúdo */}
            <div className="px-6 py-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Informações do Pedido</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Cliente:</span>
                      <p className="font-medium">{showOrderDetails.compradorNome}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Data do Pedido:</span>
                      <p className="font-medium">{formatDate(showOrderDetails.data)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Forma de Pagamento:</span>
                      <p className="font-medium">{formatPaymentMethod(showOrderDetails.formaPagamento)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Status:</span>
                      <p>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyle(showOrderDetails.status)}`}>
                          {getStatusLabel(showOrderDetails.status)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Endereço de Entrega</h4>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{showOrderDetails.endereco.rua}</p>
                    <p>{showOrderDetails.endereco.cidade}, {showOrderDetails.endereco.estado}</p>
                    <p>CEP: {showOrderDetails.endereco.cep}</p>
                  </div>
                  {showOrderDetails.rastreamento && (
                    <div className="mt-3">
                      <span className="text-sm text-gray-500">Código de Rastreio:</span>
                      <p className="font-medium font-mono text-sm">{showOrderDetails.rastreamento}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Itens do Pedido */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Itens do Pedido</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                          Produto
                        </th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                          Qtd
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                          Unitário
                        </th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {showOrderDetails.itens.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-gray-900">
                            {item.nome}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500 text-center">
                            {item.quantidade}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500 text-right">
                            R$ {item.precoUnitario.toFixed(2)}
                          </td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                            R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td colSpan="3" className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                          Total do Pedido:
                        </td>
                        <td className="px-4 py-2 text-base font-bold text-gray-900 text-right">
                          R$ {showOrderDetails.valorTotal.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Status Timeline - Simplificado */}
              {showOrderDetails.status !== 'cancelado' && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Status da Entrega</h4>
                  <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
                    {['pendente', 'separacao', 'transito', 'entregue'].map((status, index) => {
                      const statusOrder = ['pendente', 'separacao', 'transito', 'entregue'];
                      const currentIndex = statusOrder.indexOf(showOrderDetails.status);
                      const isCompleted = index <= currentIndex;
                      
                      return (
                        <div key={status} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                            isCompleted ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-500'
                          }`}>
                            {isCompleted ? '✓' : index + 1}
                          </div>
                          <span className={`text-xs ${isCompleted ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>
                            {getStatusLabel(status)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer */}
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
                        const next = getNextStatus(showOrderDetails.status);
                        if (next) {
                            updateOrderStatus(showOrderDetails.id, next.status);
                        }
                      }}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
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