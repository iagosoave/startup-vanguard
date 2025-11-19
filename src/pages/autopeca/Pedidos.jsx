import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, RefreshCw, ChevronDown, ChevronUp, Package } from 'lucide-react';
import { pedidoAPI, carrinhoAPI, produtoAPI, usuarioAPI, handleApiError } from '../../services/api';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [expandedPedidoId, setExpandedPedidoId] = useState(null);
  const [detalhesPedidos, setDetalhesPedidos] = useState({});

  const statusOptions = ['Pendente', 'Em Processamento', 'Enviado', 'Entregue', 'Cancelado'];

  const carregarPedidos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userInfo = sessionStorage.getItem('autofacil_currentUser');
      const currentUser = userInfo ? JSON.parse(userInfo) : null;
      
      if (!currentUser || !currentUser.id) {
        setError('Usuário não identificado. Faça login novamente.');
        setIsLoading(false);
        return;
      }

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 [PEDIDOS] Carregando pedidos para lojista ID:', currentUser.id);
      
      const todosPedidos = await pedidoAPI.getAll();
      console.log('📋 [PEDIDOS] Total de pedidos retornados:', todosPedidos.length);
      
      if (todosPedidos.length > 0) {
        console.log('📋 [PEDIDOS] Exemplo de pedido:', todosPedidos[0]);
        console.log('📋 [PEDIDOS] Chaves disponíveis:', Object.keys(todosPedidos[0]));
      }
      
      // ✅ FILTRAR: Buscar produtos do lojista e verificar quais pedidos os contêm
      const meusProdutos = await produtoAPI.findAll();
      const meusProdutosIds = meusProdutos.map(p => p.id);
      
      console.log('📋 [PEDIDOS] Meus produtos IDs:', meusProdutosIds);
      
      // Enriquecer pedidos com informações do carrinho
      const pedidosEnriquecidos = await Promise.all(
        todosPedidos.map(async (pedido) => {
          try {
            // Buscar carrinho do pedido
            let itensCarrinho = [];
            if (pedido.idCarrinho) {
              try {
                const carrinho = await carrinhoAPI.findById(pedido.idCarrinho);
                itensCarrinho = carrinho.itens || [];
              } catch (err) {
                console.warn(`⚠️ Carrinho ${pedido.idCarrinho} não encontrado`);
              }
            }
            
            // Verificar se algum item do carrinho é meu produto
            const contemMeusProdutos = itensCarrinho.some(item => 
              meusProdutosIds.includes(item.produtoId || item.idProduto)
            );
            
            // Buscar informações do comprador
            let nomeComprador = 'Cliente Desconhecido';
            if (pedido.idComprador || pedido.usuarioId) {
              try {
                const comprador = await usuarioAPI.findById(pedido.idComprador || pedido.usuarioId);
                nomeComprador = comprador.nomeCompleto || comprador.nome || comprador.email || 'Cliente Desconhecido';
              } catch (err) {
                console.warn(`⚠️ Comprador não encontrado`);
              }
            }
            
            return {
              ...pedido,
              nomeComprador,
              itensCarrinho,
              contemMeusProdutos
            };
          } catch (err) {
            console.error('❌ Erro ao enriquecer pedido:', err);
            return {
              ...pedido,
              nomeComprador: 'Cliente Desconhecido',
              itensCarrinho: [],
              contemMeusProdutos: false
            };
          }
        })
      );
      
      // Filtrar apenas pedidos que contêm meus produtos
      const pedidosFiltrados = pedidosEnriquecidos.filter(p => p.contemMeusProdutos);
      
      console.log('📋 [PEDIDOS] Pedidos filtrados:', pedidosFiltrados.length);
      
      const pedidosOrdenados = pedidosFiltrados.sort((a, b) => 
        new Date(b.dataCompra || b.dataPedido || b.createdAt) - new Date(a.dataCompra || a.dataPedido || a.createdAt)
      );
      
      setPedidos(pedidosOrdenados);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
    } catch (err) {
      console.error('❌ [PEDIDOS] Erro ao carregar:', err);
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarPedidos();
  }, []);

  const handleStatusChange = async (pedidoId, novoStatus) => {
    setUpdatingStatusId(pedidoId);
    setError(null);

    try {
      await pedidoAPI.update(pedidoId, { status: novoStatus });

      setPedidos(prevPedidos =>
        prevPedidos.map(pedido =>
          pedido.id === pedidoId ? { ...pedido, status: novoStatus } : pedido
        )
      );
    } catch (err) {
      const errorInfo = handleApiError(err);
      setError(`Erro ao atualizar status: ${errorInfo.message}`);
      alert(`Erro ao atualizar status: ${errorInfo.message}`);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const toggleDetalhes = async (pedidoId) => {
    if (expandedPedidoId === pedidoId) {
      setExpandedPedidoId(null);
      return;
    }

    setExpandedPedidoId(pedidoId);

    // Se já carregou detalhes, não carregar novamente
    if (detalhesPedidos[pedidoId]) return;

    // Carregar detalhes do pedido
    const pedido = pedidos.find(p => p.id === pedidoId);
    if (!pedido || !pedido.itensCarrinho) return;

    try {
      const itensDetalhados = await Promise.all(
        pedido.itensCarrinho.map(async (item) => {
          try {
            const produto = await produtoAPI.findById(item.produtoId || item.idProduto);
            return {
              ...item,
              produto
            };
          } catch (err) {
            return {
              ...item,
              produto: { nome: 'Produto não encontrado', preco: 0 }
            };
          }
        })
      );

      setDetalhesPedidos(prev => ({
        ...prev,
        [pedidoId]: itensDetalhados
      }));
    } catch (err) {
      console.error('❌ Erro ao carregar detalhes:', err);
    }
  };

  const formatarData = (dataString) => {
    if (!dataString) return '-';
    try {
      return new Date(dataString).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return dataString;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Em Processamento': return 'bg-blue-100 text-blue-800';
      case 'Enviado': return 'bg-purple-100 text-purple-800';
      case 'Entregue': return 'bg-green-100 text-green-800';
      case 'Cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Pedidos Recebidos</h2>
        <button
          onClick={carregarPedidos}
          disabled={isLoading}
          className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-wait"
          title="Atualizar lista de pedidos"
        >
          <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          <span className="ml-3 text-gray-600">Carregando pedidos...</span>
        </div>
      )}

      {!isLoading && error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-3" />
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pedido</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pedidos.length > 0 ? (
                <>
                  {pedidos.map(pedido => (
                    <React.Fragment key={pedido.id}>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{pedido.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{pedido.nomeComprador}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatarData(pedido.dataCompra || pedido.dataPedido || pedido.createdAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">R$ {(pedido.valorTotal || pedido.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="relative flex items-center">
                            <select
                              value={pedido.status || 'Pendente'}
                              onChange={(e) => handleStatusChange(pedido.id, e.target.value)}
                              disabled={updatingStatusId === pedido.id}
                              className={`appearance-none w-full text-xs font-medium rounded-full px-3 py-1 pr-8 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed ${getStatusColor(pedido.status || 'Pendente')}`}
                            >
                              {statusOptions.map(status => (
                                <option key={status} value={status}>{status}</option>
                              ))}
                            </select>
                            {updatingStatusId === pedido.id && (
                              <Loader2 className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                          <button
                            onClick={() => toggleDetalhes(pedido.id)}
                            className="text-red-600 hover:text-red-800 transition-colors flex items-center justify-center mx-auto"
                            title="Ver detalhes"
                          >
                            {expandedPedidoId === pedido.id ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                      </tr>
                      {expandedPedidoId === pedido.id && (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 bg-gray-50">
                            <div className="space-y-3">
                              <h4 className="font-medium text-gray-900">Itens do Pedido:</h4>
                              {detalhesPedidos[pedido.id] ? (
                                <div className="space-y-2">
                                  {detalhesPedidos[pedido.id].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                                      <div className="flex items-center">
                                        {item.produto.urlFoto && (
                                          <img 
                                            src={item.produto.urlFoto} 
                                            alt={item.produto.nome} 
                                            className="h-12 w-12 object-cover rounded-md mr-3 border"
                                            onError={(e) => {
                                              e.target.style.display = 'none';
                                            }}
                                          />
                                        )}
                                        <div>
                                          <p className="text-sm font-medium text-gray-900">{item.produto.nome}</p>
                                          <p className="text-xs text-gray-500">Quantidade: {item.quantidade}</p>
                                        </div>
                                      </div>
                                      <p className="text-sm font-semibold text-gray-900">
                                        R$ {(item.produto.preco * item.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="flex justify-center py-4">
                                  <Loader2 className="h-6 w-6 animate-spin text-red-600" />
                                  <span className="ml-2 text-gray-600">Carregando detalhes...</span>
                                </div>
                              )}
                              
                              {pedido.enderecoEntrega && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                  <h4 className="font-medium text-gray-900 mb-2">Endereço de Entrega:</h4>
                                  <div className="text-sm text-gray-700 space-y-1">
                                    <p>{pedido.enderecoEntrega.rua}, {pedido.enderecoEntrega.numero}</p>
                                    {pedido.enderecoEntrega.complemento && <p>Complemento: {pedido.enderecoEntrega.complemento}</p>}
                                    <p>{pedido.enderecoEntrega.bairro} - {pedido.enderecoEntrega.cidade}/{pedido.enderecoEntrega.estado}</p>
                                    <p>CEP: {pedido.enderecoEntrega.cep}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </>
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-base font-medium">Nenhum pedido recebido ainda.</p>
                    <p className="text-sm text-gray-400 mt-1">Os pedidos que contêm seus produtos aparecerão aqui.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Pedidos;