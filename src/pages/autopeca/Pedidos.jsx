import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

// ===================================================
// INÍCIO - LÓGICA DE API DO BACKEND (COMENTADO)
// ===================================================
// const fetchPedidos = async () => {
//   try {
//     const response = await fetch('URL_DA_SUA_API/pedidos/autopeca'); // Rota específica para autopeça
//     if (!response.ok) {
//       throw new Error('Erro ao buscar pedidos');
//     }
//     const data = await response.json();
//     // Ordenar por data mais recente (exemplo, ajuste conforme sua API)
//     return data.sort((a, b) => new Date(b.dataPedido) - new Date(a.dataPedido));
//   } catch (error) {
//     console.error("API Error (fetchPedidos):", error);
//     throw error;
//   }
// };

// const atualizarStatusPedidoAPI = async (pedidoId, novoStatus) => {
//   try {
//     const response = await fetch(`URL_DA_SUA_API/pedidos/${pedidoId}/status`, {
//       method: 'PATCH', // ou PUT
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ status: novoStatus }),
//     });
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Erro ao atualizar status');
//     }
//     const data = await response.json();
//     return data; // Retorna o pedido atualizado
//   } catch (error) {
//     console.error("API Error (atualizarStatusPedidoAPI):", error);
//     throw error;
//   }
// };
// ===================================================
// FIM - LÓGICA DE API DO BACKEND
// ===================================================

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null); // ID do pedido sendo atualizado

  // Opções de Status (poderia vir da API também)
  const statusOptions = ['Pendente', 'Em Processamento', 'Enviado', 'Entregue', 'Cancelado'];

  // Função para buscar pedidos
  const carregarPedidos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // const pedidosData = await fetchPedidos(); // CHAMADA API REAL
      await new Promise(resolve => setTimeout(resolve, 1200)); // Simula delay
      const pedidosData = []; // Simula resposta vazia ou com mocks
      setPedidos(pedidosData);
    } catch (err) {
      setError(err.message || 'Falha ao carregar pedidos. Tente recarregar.');
    } finally {
      setIsLoading(false);
    }
  };

  // Busca inicial
  useEffect(() => {
    carregarPedidos();
  }, []);

  const handleStatusChange = async (pedidoId, novoStatus) => {
    setUpdatingStatusId(pedidoId); // Mostra loading no select específico
    setError(null);

    try {
      // const pedidoAtualizado = await atualizarStatusPedidoAPI(pedidoId, novoStatus); // CHAMADA API REAL
      await new Promise(resolve => setTimeout(resolve, 800)); // Simula delay
      const pedidoAtualizado = { id: pedidoId, status: novoStatus }; // Simula resposta

      setPedidos(prevPedidos =>
        prevPedidos.map(pedido =>
          pedido.id === pedidoId ? { ...pedido, status: pedidoAtualizado.status } : pedido
        )
      );
    } catch (err) {
      setError(`Erro ao atualizar status do pedido #${pedidoId}: ${err.message}`);
      // Poderia reverter a mudança visual no select se desejado
      alert(`Erro ao atualizar status: ${err.message}`);
    } finally {
      setUpdatingStatusId(null); // Remove loading do select
    }
  };

  // Função para formatar data (exemplo)
  const formatarData = (dataString) => {
    if (!dataString) return '-';
    try {
      return new Date(dataString).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return dataString; // Retorna a string original se a data for inválida
    }
  };

  // Função para obter classe de cor baseada no status
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

      {/* Indicador de Carregamento ou Erro */}
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

      {/* Tabela de Pedidos */}
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
                {/* Adicionar mais colunas se necessário (ex: Itens) */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pedidos.length > 0 ? (
                pedidos.map(pedido => (
                  <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{pedido.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{pedido.nomeCliente || 'Cliente Desconhecido'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatarData(pedido.dataPedido)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">R$ {pedido.valorTotal?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="relative flex items-center">
                        <select
                          value={pedido.status}
                          onChange={(e) => handleStatusChange(pedido.id, e.target.value)}
                          disabled={updatingStatusId === pedido.id} // Desabilita enquanto atualiza
                          className={`appearance-none w-full text-xs font-medium rounded-full px-3 py-1 pr-8 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed ${getStatusColor(pedido.status)}`}
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                         {/* Ícone de loading no select */}
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