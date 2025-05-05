import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  // Recuperar usuários do localStorage
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    // Verificar se o usuário já está logado
    const currentUserJson = sessionStorage.getItem('autofacil_currentUser');
    if (currentUserJson) {
      const currentUser = JSON.parse(currentUserJson);
      // Redirecionar para o dashboard apropriado se já estiver logado
      navigate('/dashboard');
    }
    
    // Carregar a lista de usuários do localStorage
    const savedUsers = localStorage.getItem('autofacil_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    
    // Verificar se há um email salvo no localStorage (lembrar-me)
    const savedEmail = localStorage.getItem('autofacil_rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }
    
    setIsLoading(true);
    
    // Simular delay de processamento (como se fosse uma API)
    setTimeout(() => {
      // Verificar se o usuário existe
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Se a opção "lembrar-me" estiver marcada, salvar o email
        if (rememberMe) {
          localStorage.setItem('autofacil_rememberedEmail', email);
        } else {
          localStorage.removeItem('autofacil_rememberedEmail');
        }
        
        // Salvar o usuário na sessão
        sessionStorage.setItem('autofacil_currentUser', JSON.stringify(user));
        
        setLoginSuccess(true);
        
        // Redirecionar após login bem-sucedido para o dashboard apropriado
        setTimeout(() => {
          // Redirecionar para o dashboard geral, que vai decidir qual dashboard específico mostrar
          navigate('/dashboard');
        }, 1500);
      } else {
        setError('Email ou senha incorretos');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  return (
    <section className="w-full min-h-screen bg-white text-black flex items-center justify-center relative overflow-hidden">
      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full z-20 px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl md:text-2xl font-bold tracking-tight">
              auto<span className="text-red-600 font-black">Fácil</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Minimalist red details */}
      <div className="absolute top-0 left-0 w-1 h-32 bg-red-600"></div>
      <div className="absolute bottom-0 right-0 w-1 h-32 bg-red-600"></div>
      
      {/* Login Form */}
      <div className="max-w-md w-full mx-auto px-4 sm:px-8 py-12 bg-white z-10 shadow-lg rounded-lg">
        <div className="mb-10 text-center">
          <div className="flex justify-center">
            <div className="w-12 h-1 bg-red-600 mb-6"></div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-6">Entrar</h1>
          <p className="text-gray-600 mb-8">Acesse sua conta para gerenciar seus serviços</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-300 rounded"
              />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                Lembrar-me
              </label>
            </div>
            
            <div className="text-sm">
              <a href="#" className="text-red-600 hover:text-red-700">
                Esqueceu a senha?
              </a>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-sm">
              {error}
            </div>
          )}
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4
                        tracking-wider uppercase transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
          
          {loginSuccess && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
              Login realizado com sucesso! Redirecionando...
            </div>
          )}
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <Link to="/cadastro" className="text-red-600 hover:text-red-700 font-medium">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>
      
      {/* Minimalist footer */}
      <div className="absolute bottom-4 left-0 w-full text-center z-20">
        <div className="flex items-center justify-center">
          <div className="h-px w-12 sm:w-16 bg-gray-300"></div>
          <p className="text-xs uppercase tracking-wider text-gray-400 mx-4">
            © 2025 autoFácil
          </p>
          <div className="h-px w-12 sm:w-16 bg-gray-300"></div>
        </div>
      </div>
    </section>
  );
};

export default login;