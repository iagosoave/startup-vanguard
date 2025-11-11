import axios from 'axios';

// CORREÇÃO: Sempre usar o servidor real
const API_BASE_URL = 'https://prj-startup-java.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 300000, // 5 minutos
});

const axiosRetry = async (fn, retries = 3, delay = 2000) => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0 || (error.response && error.response.status < 500)) {
      throw error;
    }
    console.log(`⏳ Tentando novamente... (${3 - retries + 1}/3)`);
    await new Promise(resolve => setTimeout(resolve, delay));
    return axiosRetry(fn, retries - 1, delay * 1.5);
  }
};

api.interceptors.request.use(
  (config) => {
    console.log('🔍 [INTERCEPTOR] Verificando autenticação...');
    console.log('🔍 [INTERCEPTOR] URL completa:', config.baseURL + config.url);
    
    // Rotas públicas que NÃO precisam de autenticação
    const rotasPublicas = [
      '/api/auth/login',
      '/api/usuario/create'
    ];
    
    const isRotaPublica = rotasPublicas.some(rota => config.url.includes(rota));
    
    if (isRotaPublica) {
      console.log('🌍 [INTERCEPTOR] Rota pública detectada - SEM autenticação');
      return config;
    }
    
    const currentUser = sessionStorage.getItem('autofacil_currentUser');
    
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        console.log('👤 [INTERCEPTOR] Usuário encontrado');
        
        if (user.jwt) {
          console.log('✅ [INTERCEPTOR] JWT encontrado, adicionando ao header');
          config.headers.Authorization = `Bearer ${user.jwt}`;
          return config;
        } else {
          console.warn('⚠️ [INTERCEPTOR] JWT NÃO encontrado');
        }
      } catch (e) {
        console.error('❌ [INTERCEPTOR] Erro ao parsear usuário:', e);
      }
    } else {
      console.log('⚠️ [INTERCEPTOR] Nenhum usuário no sessionStorage');
    }
    
    console.log('⚠️ [INTERCEPTOR] Requisição sem autenticação');
    return config;
  },
  (error) => {
    console.error('❌ [INTERCEPTOR REQUEST ERROR]:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('✅ [RESPONSE SUCCESS]', response.config.url, '- Status:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ [RESPONSE ERROR]');
    console.error('   URL:', error.config?.url);
    console.error('   Status:', error.response?.status);
    console.error('   Data:', error.response?.data);
    console.error('   Message:', error.message);
    
    if (error.code === 'ECONNABORTED') {
      console.error('⏱️ [TIMEOUT] Servidor demorou muito para responder');
    }
    
    if (error.response?.status === 401) {
      console.error('🔒 [401 UNAUTHORIZED] Token expirado ou inválido');
    }
    
    if (error.response?.status === 500) {
      console.error('💥 [500 INTERNAL ERROR] Erro no servidor backend');
      console.error('   Detalhes:', error.response?.data);
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    console.log('🔐 [AUTH] Tentando fazer login com email:', email);
    return axiosRetry(async () => {
      const response = await api.post('/api/auth/login', {
        username: email,
        password: password,
      });
      
      console.log('🎉 [AUTH] Login bem-sucedido!');
      console.log('📦 [AUTH] Chaves do response:', Object.keys(response.data));
      
      return response.data;
    });
  },
};

export const usuarioAPI = {
  create: async (usuarioData) => {
    console.log('👤 [USUARIO] Criando usuário:', usuarioData.email);
    console.log('📦 [USUARIO] Dados enviados:', usuarioData);
    return axiosRetry(async () => {
      const response = await api.post('/api/usuario/create', usuarioData);
      console.log('✅ [USUARIO] Usuário criado:', response.data);
      return response.data;
    }, 1); // Apenas 1 tentativa para cadastro (não retry em erro 500)
  },
  findById: async (id) => {
    return axiosRetry(async () => {
      const response = await api.get(`/api/usuario/${id}`);
      return response.data;
    });
  },
  findAll: async () => {
    return axiosRetry(async () => {
      const response = await api.get('/api/usuario');
      return response.data;
    });
  },
  update: async (id, usuarioData) => {
    return axiosRetry(async () => {
      const response = await api.put(`/api/usuario/${id}`, usuarioData);
      return response.data;
    });
  },
  delete: async (id) => {
    return axiosRetry(async () => {
      await api.delete(`/api/usuario/${id}`);
    });
  },
  findEnderecoById: async (usuarioId) => {
    return axiosRetry(async () => {
      const response = await api.get(`/api/usuario/${usuarioId}/endereco`);
      return response.data;
    });
  },
  updateEndereco: async (usuarioId, endereco) => {
    return axiosRetry(async () => {
      const response = await api.put(`/api/usuario/${usuarioId}/endereco`, endereco);
      return response.data;
    });
  },
};

export const produtoAPI = {
  findAll: async () => {
    return axiosRetry(async () => {
      const response = await api.get('/api/produto');
      return response.data;
    });
  },
  findById: async (id) => {
    return axiosRetry(async () => {
      const response = await api.get(`/api/produto/${id}`);
      return response.data;
    });
  },
  create: async (produtoData, foto, documento) => {
    return axiosRetry(async () => {
      const formData = new FormData();
      formData.append('produto', new Blob([JSON.stringify(produtoData)], { type: 'application/json' }));
      if (foto) formData.append('foto', foto);
      if (documento) formData.append('documento', documento);
      const response = await api.post('/api/produto', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    });
  },
  update: async (produtoData) => {
    return axiosRetry(async () => {
      const response = await api.put('/api/produto', produtoData);
      return response.data;
    });
  },
  delete: async (id) => {
    return axiosRetry(async () => {
      await api.delete(`/api/produto/${id}`);
    });
  },
};

export const categoriaAPI = {
  findAll: async () => {
    return axiosRetry(async () => {
      const response = await api.get('/api/categoria');
      return response.data;
    });
  },
  findById: async (id) => {
    return axiosRetry(async () => {
      const response = await api.get(`/api/categoria/${id}`);
      return response.data;
    });
  },
  create: async (categoriaData) => {
    return axiosRetry(async () => {
      const response = await api.post('/api/categoria', categoriaData);
      return response.data;
    });
  },
  update: async (id, categoriaData) => {
    return axiosRetry(async () => {
      const response = await api.put(`/api/categoria/${id}`, categoriaData);
      return response.data;
    });
  },
  delete: async (id) => {
    return axiosRetry(async () => {
      await api.delete(`/api/categoria/${id}`);
    });
  },
};

export const carrinhoAPI = {
  findAll: async () => {
    return axiosRetry(async () => {
      const response = await api.get('/api/carrinho');
      return response.data;
    });
  },
  findById: async (id) => {
    return axiosRetry(async () => {
      const response = await api.get(`/api/carrinho/${id}`);
      return response.data;
    });
  },
  create: async (carrinhoData) => {
    return axiosRetry(async () => {
      const response = await api.post('/api/carrinho', carrinhoData);
      return response.data;
    });
  },
  update: async (id, carrinhoData) => {
    return axiosRetry(async () => {
      const response = await api.put(`/api/carrinho/${id}`, carrinhoData);
      return response.data;
    });
  },
  delete: async (id) => {
    return axiosRetry(async () => {
      await api.delete(`/api/carrinho/${id}`);
    });
  },
  insertItem: async (id, itemData) => {
    return axiosRetry(async () => {
      const response = await api.post(`/api/carrinho/${id}`, itemData);
      return response.data;
    });
  },
};

export const pedidoAPI = {
  getAll: async () => {
    return axiosRetry(async () => {
      const response = await api.get('/api/pedido');
      return response.data;
    });
  },
  getById: async (id) => {
    return axiosRetry(async () => {
      const response = await api.get(`/api/pedido/${id}`);
      return response.data;
    });
  },
  create: async (pedidoData) => {
    return axiosRetry(async () => {
      const response = await api.post('/api/pedido', pedidoData);
      return response.data;
    });
  },
  update: async (id, pedidoData) => {
    return axiosRetry(async () => {
      const response = await api.put(`/api/pedido/${id}`, pedidoData);
      return response.data;
    });
  },
  delete: async (id) => {
    return axiosRetry(async () => {
      await api.delete(`/api/pedido/${id}`);
    });
  },
};

export const s3API = {
  upload: async (file) => {
    return axiosRetry(async () => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    });
  },
  getImageUrl: async (filename) => {
    return axiosRetry(async () => {
      const response = await api.get(`/imagens/${filename}/url`);
      return response.data;
    });
  },
};

export const handleApiError = (error) => {
  console.error('🔥 [HANDLE API ERROR]', error);
  
  if (error.response) {
    const message = error.response.data?.message || error.response.data?.error || 'Erro ao processar requisição';
    console.error('📛 Erro do servidor:', {
      status: error.response.status,
      message: message,
      data: error.response.data
    });
    return {
      status: error.response.status,
      message: message,
      data: error.response.data,
    };
  } else if (error.request) {
    console.error('📛 Sem resposta do servidor');
    return {
      status: 0,
      message: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
      data: null,
    };
  } else {
    console.error('📛 Erro:', error.message);
    return {
      status: -1,
      message: error.message || 'Erro desconhecido',
      data: null,
    };
  }
};

export default api;