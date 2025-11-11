import React, { useState } from 'react';
import axios from 'axios';

const TestApiConnection = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setStatus('Testando conexão...');
    
    try {
      const response = await axios.get('https://prj-startup-java.onrender.com/api/produto', {
        timeout: 120000,
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJMaGVucmlxdWUiLCJpYXQiOjE3NDA3NTY2NDUsImV4cCI6MTc0MDc3NDY0NX0.g9ILyzzyjUB71BuDj8zKpzFqn747lz5KcuYca9TcKMmo0i3gyqabZrx0_AMUoNiWHJJIluYaa44ot00jSSSfIg'
        }
      });
      setStatus(`Conexão OK! Status: ${response.status}. Produtos encontrados: ${response.data.length}`);
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        setStatus('ERRO: Timeout - API não respondeu em 2 minutos. Servidor pode estar offline ou em cold start.');
      } else if (error.response) {
        setStatus(`ERRO: Status ${error.response.status} - ${error.response.data?.message || 'Erro na API'}`);
      } else if (error.request) {
        setStatus('ERRO: Sem resposta do servidor. Verifique: 1) URL está correta 2) Servidor está online 3) Sem bloqueio de CORS');
      } else {
        setStatus(`ERRO: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Teste de Conexão com API</h2>
      
      <button 
        onClick={testConnection}
        disabled={loading}
        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 mb-4"
      >
        {loading ? 'Testando...' : 'Testar Conexão'}
      </button>
      
      {status && (
        <div className={`p-4 rounded-lg ${status.includes('OK') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p className="font-mono text-sm whitespace-pre-wrap">{status}</p>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-bold mb-2">Informações:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>URL da API: https://prj-startup-java.onrender.com</li>
          <li>Timeout: 120 segundos</li>
          <li>Endpoint de teste: /api/produto</li>
        </ul>
      </div>
    </div>
  );
};

export default TestApiConnection;