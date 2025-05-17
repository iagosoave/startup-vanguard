import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const RecuperarSenha = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: nova senha
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Função para verificar email
  const handleSubmitEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    setTimeout(() => {
      // Verificar se o email existe no sistema
      const users = JSON.parse(localStorage.getItem('autofacil_users') || '[]');
      const userExists = users.some(user => user.email === email);

      if (!userExists) {
        setMessage({ 
          type: 'error', 
          text: 'Email não encontrado no sistema.' 
        });
        setIsSubmitting(false);
        return;
      }

      setMessage({ 
        type: 'success', 
        text: `Email verificado com sucesso. Por favor, defina sua nova senha.`
      });
      setIsSubmitting(false);
      setStep(2);
    }, 1000);
  };

  // Função para definir nova senha
  const handleResetPassword = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    // Validar senhas
    if (newPassword.length < 6) {
      setMessage({ 
        type: 'error', 
        text: 'A senha deve ter pelo menos 6 caracteres.'
      });
      setIsSubmitting(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ 
        type: 'error', 
        text: 'As senhas não coincidem.'
      });
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      // Atualizar a senha do usuário no localStorage
      const users = JSON.parse(localStorage.getItem('autofacil_users') || '[]');
      const updatedUsers = users.map(user => {
        if (user.email === email) {
          return { ...user, password: newPassword };
        }
        return user;
      });

      localStorage.setItem('autofacil_users', JSON.stringify(updatedUsers));
      
      setMessage({ 
        type: 'success', 
        text: 'Senha redefinida com sucesso! Redirecionando para a página de login...'
      });
      setIsSubmitting(false);
      
      // Redirecionar para o login após alguns segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
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
      
      {/* Recuperação de Senha Form */}
      <div className="max-w-md w-full mx-auto px-4 sm:px-8 py-12 bg-white z-10 shadow-lg rounded-lg">
        <div className="mb-10 text-center">
          <div className="flex justify-center">
            <div className="w-12 h-1 bg-red-600 mb-6"></div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-6">Recuperar Senha</h1>
          {step === 1 && (
            <p className="text-gray-600 mb-8">
              Digite seu email para redefinir sua senha
            </p>
          )}
          {step === 2 && (
            <p className="text-gray-600 mb-8">
              Defina sua nova senha
            </p>
          )}
        </div>
        
        {/* Mensagem de sucesso ou erro */}
        {message.text && (
          <div className={`mb-6 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-800'}`}>
            {message.text}
          </div>
        )}
        
        {/* Etapa 1: Email */}
        {step === 1 && (
          <form onSubmit={handleSubmitEmail} className="space-y-6">
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
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4
                          tracking-wider uppercase transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Verificando...' : 'Continuar'}
              </button>
            </div>
          </form>
        )}
        
        {/* Etapa 2: Nova Senha */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Nova Senha
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                placeholder="Digite sua nova senha"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmar Senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                placeholder="Confirme sua nova senha"
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4
                          tracking-wider uppercase transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Redefinindo Senha...' : 'Redefinir Senha'}
              </button>
            </div>
          </form>
        )}
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Lembrou sua senha?{' '}
            <Link to="/login" className="text-red-600 hover:text-red-700 font-medium">
              Voltar para o Login
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

export default RecuperarSenha;