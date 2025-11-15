import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, usuarioAPI, handleApiError } from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const currentUserJson = sessionStorage.getItem('autofacil_currentUser');
    if (currentUserJson) {
      console.log(' [LOGIN] Usuário já logado, redirecionando...');
      navigate('/dashboard');
    }
    const savedEmail = localStorage.getItem('autofacil_rememberedEmail');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(' [LOGIN] Iniciando processo de login...');
    console.log(' [LOGIN] Email:', email);
    setIsLoading(true);

    try {
      const loginResponse = await authAPI.login(email, password);
      
      console.log('[LOGIN] Response do backend:', loginResponse);
      console.log('[LOGIN] Chaves do response:', Object.keys(loginResponse));
      
      const authToken = loginResponse.jwt || loginResponse.token;
      
      if (!authToken) {
        console.error('[LOGIN] Token não encontrado no response!');
        setError('Resposta inválida do servidor - sem token');
        setIsLoading(false);
        return;
      }

      console.log(' [LOGIN] Token recebido:', authToken.substring(0, 50) + '...');

      try {
        const base64Url = authToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        
        const jwtData = JSON.parse(jsonPayload);
        const emailFromJwt = jwtData.sub;
        
        console.log(' [LOGIN] Email extraído do JWT:', emailFromJwt);
        console.log(' [LOGIN] Payload completo do JWT:', jwtData);

        const tempUserData = {
          email: emailFromJwt,
          jwt: authToken,
        };
        sessionStorage.setItem('autofacil_currentUser', JSON.stringify(tempUserData));
        console.log('[LOGIN] JWT temporário salvo no sessionStorage');

        console.log('[LOGIN] Buscando dados completos do usuário...');
        
        const todosUsuarios = await usuarioAPI.getAll();
        console.log(' [LOGIN] Total de usuários retornados:', todosUsuarios.length);
        
        if (todosUsuarios.length > 0) {
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log(' [LOGIN DEBUG] PRIMEIRO USUÁRIO (exemplo):');
          console.log(JSON.stringify(todosUsuarios[0], null, 2));
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log(' [LOGIN DEBUG] CHAVES DO PRIMEIRO USUÁRIO:', Object.keys(todosUsuarios[0]));
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        }
        
        const usuarioCompleto = todosUsuarios.find(u => 
          u.email?.toLowerCase() === emailFromJwt.toLowerCase()
        );
        
        if (!usuarioCompleto) {
          console.error(' [LOGIN] Usuário não encontrado na lista de usuários!');
          console.error(' [LOGIN] Email procurado:', emailFromJwt);
          console.error(' [LOGIN] Emails disponíveis:', todosUsuarios.map(u => u.email));
          throw new Error('Dados do usuário não encontrados. Tente novamente.');
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(' [LOGIN] Usuário completo encontrado:');
        console.log(JSON.stringify(usuarioCompleto, null, 2));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(' [LOGIN] ID:', usuarioCompleto.id);
        console.log(' [LOGIN] Nome:', usuarioCompleto.nomeCompleto);
        console.log(' [LOGIN] Email:', usuarioCompleto.email);
        console.log(' [LOGIN] Tipo (tipoUsuario):', usuarioCompleto.tipoUsuario);
        console.log(' [LOGIN] Tipo (tipo_usuario):', usuarioCompleto.tipo_usuario);
        console.log(' [LOGIN] Tipo (tipo):', usuarioCompleto.tipo);
        console.log(' [LOGIN] Tipo (perfil):', usuarioCompleto.perfil);
        console.log(' [LOGIN] Tipo (role):', usuarioCompleto.role);
        console.log(' [LOGIN] TODAS AS CHAVES:', Object.keys(usuarioCompleto));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        const tipoUsuarioFinal = usuarioCompleto.tipoUsuario || 
                                 usuarioCompleto.tipo_usuario || 
                                 usuarioCompleto.tipo || 
                                 usuarioCompleto.perfil ||
                                 usuarioCompleto.role ||
                                 'COMPRADOR';

        const userData = {
          id: usuarioCompleto.id,
          nome: usuarioCompleto.nomeCompleto || usuarioCompleto.nome || emailFromJwt,
          email: emailFromJwt,
          jwt: authToken,
          tipoUsuario: tipoUsuarioFinal,
        };

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(' [LOGIN] Dados finais para salvar:');
        console.log(JSON.stringify(userData, null, 2));
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(' [LOGIN] ID do usuário:', userData.id);
        console.log(' [LOGIN] Tipo de usuário FINAL:', userData.tipoUsuario);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        if (rememberMe) {
          localStorage.setItem('autofacil_rememberedEmail', email);
        } else {
          localStorage.removeItem('autofacil_rememberedEmail');
        }

        sessionStorage.setItem('autofacil_currentUser', JSON.stringify(userData));
        
        console.log(' [LOGIN] Dados completos salvos no sessionStorage');
        console.log(' [LOGIN] Login bem-sucedido!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        setLoginSuccess(true);

        setTimeout(() => {
          console.log(' [LOGIN] Redirecionando para dashboard...');
          navigate('/dashboard', { replace: true });
        }, 1500);

      } catch (decodeErr) {
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error(' [LOGIN] Erro ao processar dados:', decodeErr);
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        setError('Erro ao processar dados do usuário. Tente novamente.');
        sessionStorage.removeItem('autofacil_currentUser');
      }

    } catch (err) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error(' [LOGIN] Erro durante login:', err);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const errorInfo = handleApiError(err);
      
      if (errorInfo.status === 401 || errorInfo.message.toLowerCase().includes('credenciais')) {
        setError('Email ou senha incorretos');
      } else if (errorInfo.status === 0) {
        setError('Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        setError(errorInfo.message || 'Erro ao fazer login. Tente novamente.');
      }
      
      sessionStorage.removeItem('autofacil_currentUser');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen bg-white text-black flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full z-20 px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl md:text-2xl font-bold tracking-tight text-black">
              Peça<span className="text-red-600">Já!</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-1 h-32 bg-red-600"></div>
      <div className="absolute bottom-0 right-0 w-1 h-32 bg-red-600"></div>

      <div className="max-w-md w-full mx-auto px-4 sm:px-8 py-12 bg-white z-10 shadow-lg rounded-lg">
        <div className="mb-10 text-center">
          <div className="flex justify-center"><div className="w-12 h-1 bg-red-600 mb-6"></div></div>
          <h1 className="text-3xl font-bold tracking-tight mb-6">Entrar</h1>
          <p className="text-gray-600 mb-8">Acesse sua conta para gerenciar seus pedidos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600" placeholder="seu@email.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
            <div className="relative">
              <input id="password" name="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 pr-12 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700">
                {showPassword ? ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> )}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember_me" name="remember_me" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-300 rounded" />
              <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">Lembrar-me</label>
            </div>
            <div className="text-sm"><Link to="/recuperar-senha" className="text-red-600 hover:text-red-700">Esqueceu a senha?</Link></div>
          </div>
          {error && (<div className="mt-4 p-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>)}
          <div>
            <button type="submit" disabled={isLoading} className={`w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 tracking-wider uppercase transition-all duration-300 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
          {loginSuccess && (<div className="mt-4 p-3 bg-green-100 text-green-800 rounded">Login realizado com sucesso! Redirecionando...</div>)}
        </form>
        <div className="mt-8 text-center"><p className="text-gray-600">Não tem uma conta?{' '}<Link to="/cadastro" className="text-red-600 hover:text-red-700 font-medium">Cadastre-se</Link></p></div>
      </div>
      <div className="absolute bottom-4 left-0 w-full text-center z-20">
        <div className="flex items-center justify-center">
          <div className="h-px w-12 sm:w-16 bg-gray-300"></div>
          <p className="text-xs uppercase tracking-wider text-gray-400 mx-4">
            © 2025 Peça<span className="text-red-600">Já!</span>
          </p>
          <div className="h-px w-12 sm:w-16 bg-gray-300"></div>
        </div>
      </div>
    </section>
  );
};

export default Login;