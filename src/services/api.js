import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://prj-startup-java.onrender.com';

const FIXED_TOKEN = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJMaGVucmlxdWUiLCJpYXQiOjE3NDA3NTY2NDUsImV4cCI6MTc0MDc3NDY0NX0.g9ILyzzyjUB71BuDj8zKpzFqn747lz5KcuYca9TcKMmo0i3gyqabZrx0_AMUoNiWHJJIluYaa44ot00jSSSfIg';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${FIXED_TOKEN}`, 
  },
  timeout: 30000, 
});

api.interceptors.request.use(
  (config) => {
    const currentUser = sessionStorage.getItem('autofacil_currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
        return config;
      }
    }
    
    config.headers.Authorization = `Bearer ${FIXED_TOKEN}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Token expirado ou inválido. Faça login novamente.');
      sessionStorage.removeItem('autofacil_currentUser');
      
      
    }
    return Promise.reject(error);
  }
);


export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/api/auth/login', {
      username: email,
      password: password,
    });
    
    if (response.data.token) {
      sessionStorage.setItem('autofacil_currentUser', JSON.stringify({
        token: response.data.token,
        user: response.data.usuario || response.data.user,
      }));
    }
    
    return response.data;
  },
};


export const usuarioAPI = {
  create: async (usuarioData) => {
    const response = await api.post('/api/usuario/create', usuarioData);
    return response.data;
  },

  findById: async (id) => {
    const response = await api.get(`/api/usuario/${id}`);
    return response.data;
  },

  findAll: async () => {
    const response = await api.get('/api/usuario');
    return response.data;
  },

  update: async (id, usuarioData) => {
    const response = await api.put(`/api/usuario/${id}`, usuarioData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/api/usuario/${id}`);
  },

  findEnderecoById: async (usuarioId) => {
    const response = await api.get(`/api/usuario/${usuarioId}/endereco`);
    return response.data;
  },

  updateEndereco: async (usuarioId, endereco) => {
    const response = await api.put(`/api/usuario/${usuarioId}/endereco`, endereco);
    return response.data;
  },
};


export const produtoAPI = {
  findAll: async () => {
    const response = await api.get('/api/produto');
    return response.data;
  },

  findById: async (id) => {
    const response = await api.get(`/api/produto/${id}`);
    return response.data;
  },

  create: async (produtoData, foto, documento) => {
    const formData = new FormData();
    formData.append('produto', new Blob([JSON.stringify(produtoData)], { type: 'application/json' }));
    
    if (foto) {
      formData.append('foto', foto);
    }
    if (documento) {
      formData.append('documento', documento);
    }

    const response = await api.post('/api/produto', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (produtoData) => {
    const response = await api.put('/api/produto', produtoData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/api/produto/${id}`);
  },
};


export const categoriaAPI = {
  findAll: async () => {
    const response = await api.get('/api/categoria');
    return response.data;
  },

  findById: async (id) => {
    const response = await api.get(`/api/categoria/${id}`);
    return response.data;
  },

  create: async (categoriaData) => {
    const response = await api.post('/api/categoria', categoriaData);
    return response.data;
  },

  update: async (id, categoriaData) => {
    const response = await api.put(`/api/categoria/${id}`, categoriaData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/api/categoria/${id}`);
  },
};


export const carrinhoAPI = {
  findAll: async () => {
    const response = await api.get('/api/carrinho');
    return response.data;
  },

  findById: async (id) => {
    const response = await api.get(`/api/carrinho/${id}`);
    return response.data;
  },

  create: async (carrinhoData) => {
    const response = await api.post('/api/carrinho', carrinhoData);
    return response.data;
  },

  update: async (id, carrinhoData) => {
    const response = await api.put(`/api/carrinho/${id}`, carrinhoData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/api/carrinho/${id}`);
  },

  insertItem: async (id, itemData) => {
    const response = await api.post(`/api/carrinho/${id}`, itemData);
    return response.data;
  },
};


export const pedidoAPI = {
  getAll: async () => {
    const response = await api.get('/api/pedido');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/api/pedido/${id}`);
    return response.data;
  },

  create: async (pedidoData) => {
    const response = await api.post('/api/pedido', pedidoData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/api/pedido/${id}`);
  },
};

export const s3API = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getImageUrl: async (filename) => {
    const response = await api.get(`/imagens/${filename}/url`);
    return response.data;
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
      message: 'Não foi possível conectar ao servidor. Verifique sua conexão ou aguarde o servidor inicializar (cold start pode levar até 60 segundos).',
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