import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { pedidoAPI, handleApiError } from '../../services/api';

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  const statusOptions = ['Pendente', 'Em Processamento', 'Enviado', 'Entregue', 'Cancelado'];

  const carregarPedidos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const pedidosData = await pedidoAPI.getAll();
      // Ordenar por data mais recente
      const pedidosOrdenados = pedidosData.sort((a, b) => 
        new Date(b.dataPedido || b.createdAt) - new Date(a.dataPedido || a.createdAt)
      );
      setPedidos(pedidosOrdenados);
    } catch (err) {
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
      // Atualizar status do pedido
      // Se sua API não tiver endpoint específico para status, use o update
      const pedidoAtualizado = await pedidoAPI.update(pedidoId, { status: novoStatus });

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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pedidos.length > 0 ? (
                pedidos.map(pedido => (
                  <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{pedido.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{pedido.nomeCliente || pedido.cliente?.nome || 'Cliente Desconhecido'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatarData(pedido.dataPedido || pedido.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">R$ {pedido.valorTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="relative flex items-center">
                        <select
                          value={pedido.status}
                          onChange={(e) => handleStatusChange(pedido.id, e.target.value)}
                          disabled={updatingStatusId === pedido.id}
                          className={`appearance-none w-full text-xs font-medium rounded-full px-3 py-1 pr-8 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed ${getStatusColor(pedido.status)}`}
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    Nenhum pedido recebido ainda.
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