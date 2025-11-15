import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, RefreshCw, Package } from 'lucide-react';
import { pedidoAPI, handleApiError } from '../../services/api';

const ComprasPage = () => {
  const [compras, setCompras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCurrentUser = () => {
    try {
      const userData = sessionStorage.getItem('autofacil_currentUser');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error('⚠️ Erro ao recuperar usuário:', error);
      return null;
    }
  };

  const carregarCompras = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const currentUser = getCurrentUser();
      const userId = currentUser?.id || currentUser?.userId || currentUser?.ID || currentUser?.usuarioId;
      
      console.log('📦 [COMPRAS] Usuário atual:', { userId, user: currentUser });
      
      const todosPedidos = await pedidoAPI.getAll();
      console.log('📦 [COMPRAS] Todos os pedidos:', todosPedidos);
      
      // Filtrar pedidos do usuário atual
      const comprasData = todosPedidos.filter(p => {
        // Tentar várias propriedades possíveis para o ID do usuário
        const pedidoUserId = p.usuarioId || p.idComprador || p.userId || p.user_id || p.idUsuario;
        return pedidoUserId === userId;
      });
      
      console.log('📦 [COMPRAS] Pedidos filtrados do usuário:', comprasData);
      
      // Ordenar por data (mais recentes primeiro)
      const comprasOrdenadas = comprasData.sort((a, b) => {
        const dataA = new Date(a.dataCompra || a.dataPedido || a.createdAt || a.created_at || 0);
        const dataB = new Date(b.dataCompra || b.dataPedido || b.createdAt || b.created_at || 0);
        return dataB - dataA;
      });
      
      setCompras(comprasOrdenadas);
    } catch (err) {
      console.error('❌ [COMPRAS] Erro ao carregar:', err);
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    carregarCompras();
  }, []);

  const formatarData = (dataString) => {
    if (!dataString) return '-';
    try {
      return new Date(dataString).toLocaleDateString('pt-BR', {
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit'
      });
    } catch (e) { 
      return dataString; 
    }
  };

  const getStatusColor = (status) => {
    const statusNormalized = (status || '').toLowerCase();
    
    if (statusNormalized.includes('pendente')) return 'bg-yellow-100 text-yellow-800';
    if (statusNormalized.includes('processamento') || statusNormalized.includes('processando')) return 'bg-blue-100 text-blue-800';
    if (statusNormalized.includes('enviado') || statusNormalized.includes('transporte')) return 'bg-purple-100 text-purple-800';
    if (statusNormalized.includes('entregue') || statusNormalized.includes('concluído') || statusNormalized.includes('concluido')) return 'bg-green-100 text-green-800';
    if (statusNormalized.includes('cancelado')) return 'bg-red-100 text-red-800';
    
    return 'bg-gray-100 text-gray-800';
  };

  const formatarValor = (valor) => {
    if (!valor) return '0,00';
    
    // Se já for número
    if (typeof valor === 'number') {
      return valor.toLocaleString('pt-BR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
    }
    
    // Se for string, converter
    const valorNum = parseFloat(valor);
    if (!isNaN(valorNum)) {
      return valorNum.toLocaleString('pt-BR', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
      });
    }
    
    return '0,00';
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Package className="h-7 w-7 text-red-600 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-800">Minhas Compras</h2>
        </div>
        <button
          onClick={carregarCompras}
          disabled={isLoading}
          className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-wait"
          title="Atualizar histórico"
        >
          <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          <span className="ml-3 text-gray-600">Carregando histórico...</span>
        </div>
      )}

      {!isLoading && error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-3 flex-shrink-0" />
          <div>
            <p className="font-medium">Erro ao carregar compras</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Pedido</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {compras.length > 0 ? (
                compras.map(compra => {
                  const dataCompra = compra.dataCompra || compra.dataPedido || compra.createdAt || compra.created_at;
                  const valorTotal = compra.valorTotal || compra.valor_total || compra.total || 0;
                  const pedidoId = compra.id || compra.idPedido || compra.pedidoId || '?';
                  
                  return (
                    <tr key={compra.id || Math.random()} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{pedidoId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatarData(dataCompra)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(compra.status)}`}>
                          {compra.status || 'Pendente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                        R$ {formatarValor(valorTotal)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-base font-medium">Você ainda não realizou nenhuma compra.</p>
                    <p className="text-sm text-gray-400 mt-1">Use o Assistente de Pedidos para fazer sua primeira compra!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {!isLoading && !error && compras.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Total de {compras.length} {compras.length === 1 ? 'pedido' : 'pedidos'}
        </div>
      )}
    </div>
  );
};

export default ComprasPage;