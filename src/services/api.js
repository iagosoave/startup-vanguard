import axios from 'axios';

// ✅ Usar variável de ambiente para a URL da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://prj-startup-java.onrender.com';

console.log('🔧 [API CONFIG] URL Base:', API_BASE_URL);

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
    await new Promise(resolve => setTimeout(resolve, delay));
    return axiosRetry(fn, retries - 1, delay * 1.5);
  }
};

api.interceptors.request.use(
  (config) => {
    const rotasPublicas = [
      '/api/auth/login',
      '/api/usuario/create'
    ];
    
    const isRotaPublica = rotasPublicas.some(rota => config.url.includes(rota));
    
    if (isRotaPublica) {
      return config;
    }
    
    const currentUser = sessionStorage.getItem('autofacil_currentUser');
    
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        if (user.jwt) {
          config.headers.Authorization = `Bearer ${user.jwt}`;
        }
      } catch (e) {
        // Silent error
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email, password) => {
    return axiosRetry(async () => {
      const response = await api.post('/api/auth/login', {
        username: email,
        password: password,
      });
      return response.data;
    });
  },
};

export const usuarioAPI = {
  create: async (usuarioData) => {
    return axiosRetry(async () => {
      const response = await api.post('/api/usuario/create', usuarioData);
      return response.data;
    }, 1);
  },

  getAll: async () => {
    return axiosRetry(async () => {
      const response = await api.get('/api/usuario');
      return response.data;
    });
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
  if (error.response) {
    const message = error.response.data?.message || error.response.data?.error || 'Erro ao processar requisição';
    return {
      status: error.response.status,
      message: message,
      data: error.response.data,
    };
  } else if (error.request) {
    return {
      status: 0,
      message: 'Não foi possível conectar ao servidor. Verifique sua conexão.',
      data: null,
    };
  } else {
    return {
      status: -1,
      message: error.message || 'Erro desconhecido',
      data: null,
    };
  }
};

export default api;