import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Cadastro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nomeEmpresa: '',
    cnpj: '',
    email: '',
    telefone: '',
    password: '',
    confirmPassword: '',
    tipoUsuario: 'mecanica' // Apenas mecanica ou autopeca
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cadastroSuccess, setCadastroSuccess] = useState(false);

  // Simula um banco de dados local para os usuários cadastrados
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('autofacil_users');
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  // Salva os usuários no localStorage quando houver alterações
  useEffect(() => {
    localStorage.setItem('autofacil_users', JSON.stringify(users));
  }, [users]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Limpar mensagens de erro quando o usuário edita o campo
    if(errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    // Validação do nome da empresa
    if (!formData.nomeEmpresa.trim()) {
      newErrors.nomeEmpresa = "Nome da empresa é obrigatório";
    }
    
    // Validação do CNPJ (formato básico: XX.XXX.XXX/XXXX-XX)
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    if (!formData.cnpj.trim()) {
      newErrors.cnpj = "CNPJ é obrigatório";
    } else if (!cnpjRegex.test(formData.cnpj)) {
      newErrors.cnpj = "CNPJ inválido. Use o formato: XX.XXX.XXX/XXXX-XX";
    }
    
    // Validação do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email inválido";
    } else if (users.some(user => user.email === formData.email)) {
      newErrors.email = "Este email já está registrado";
    }
    
    // Validação da senha
    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
    }
    
    // Validação da confirmação de senha
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    // Simula o tempo de processamento de uma API
    setTimeout(() => {
      // Criar novo usuário
      const newUser = {
        id: Date.now().toString(),
        nomeEmpresa: formData.nomeEmpresa,
        cnpj: formData.cnpj,
        email: formData.email,
        telefone: formData.telefone,
        tipoUsuario: formData.tipoUsuario,
        password: formData.password, // Em uma aplicação real, nunca armazene senhas em texto puro
      };
      
      // Adicionar usuário à lista
      setUsers([...users, newUser]);
      
      // Definir como logado na sessão
      sessionStorage.setItem('autofacil_currentUser', JSON.stringify(newUser));
      
      setCadastroSuccess(true);
      setIsSubmitting(false);
      
      // Redirecionar após cadastro bem-sucedido
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }, 1000);
  };

  return (
    <section className="w-full min-h-screen bg-white text-black flex items-center justify-center relative overflow-hidden py-20">
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
      
      {/* Registration Form */}
      <div className="max-w-xl w-full mx-auto px-4 sm:px-8 py-12 bg-white z-10 mt-12 shadow-lg rounded-lg">
        <div className="mb-10 text-center">
          <div className="flex justify-center">
            <div className="w-12 h-1 bg-red-600 mb-6"></div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-6">Cadastre-se</h1>
          <p className="text-gray-600 mb-8">Crie sua conta para começar a usar o autoFácil</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User type selection - Only Mecânica and Autopeça */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div 
              className={`border p-4 text-center cursor-pointer transition-all duration-300 ${
                formData.tipoUsuario === 'mecanica' ? 'border-red-600 text-red-600' : 'border-gray-300'
              }`}
              onClick={() => handleChange({ target: { name: 'tipoUsuario', value: 'mecanica' } })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span className="text-sm">Mecânica</span>
            </div>
            <div 
              className={`border p-4 text-center cursor-pointer transition-all duration-300 ${
                formData.tipoUsuario === 'autopeca' ? 'border-red-600 text-red-600' : 'border-gray-300'
              }`}
              onClick={() => handleChange({ target: { name: 'tipoUsuario', value: 'autopeca' } })}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-sm">Autopeça</span>
            </div>
          </div>
          
          {/* Nome da Empresa */}
          <div>
            <label htmlFor="nomeEmpresa" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Empresa
            </label>
            <input
              id="nomeEmpresa"
              name="nomeEmpresa"
              type="text"
              required
              value={formData.nomeEmpresa}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.nomeEmpresa ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`}
              placeholder="Nome da sua empresa"
            />
            {errors.nomeEmpresa && <p className="text-red-500 text-xs mt-1">{errors.nomeEmpresa}</p>}
          </div>
          
          {/* CNPJ */}
          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">
              CNPJ
            </label>
            <input
              id="cnpj"
              name="cnpj"
              type="text"
              required
              value={formData.cnpj}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.cnpj ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`}
              placeholder="XX.XXX.XXX/XXXX-XX"
            />
            {errors.cnpj && <p className="text-red-500 text-xs mt-1">{errors.cnpj}</p>}
          </div>
          
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`}
              placeholder="seu@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          {/* Phone */}
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              id="telefone"
              name="telefone"
              type="tel"
              required
              value={formData.telefone}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.telefone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`}
              placeholder="(XX) XXXXX-XXXX"
            />
            {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>}
          </div>
          
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          
          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Senha
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          
          {/* Terms */}
          <div className="flex items-center">
            <input
              id="termos"
              name="termos"
              type="checkbox"
              required
              className="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-300 rounded"
            />
            <label htmlFor="termos" className="ml-2 block text-sm text-gray-700">
              Eu concordo com os{' '}
              <a href="#" className="text-red-600 hover:text-red-700">
                termos de serviço
              </a>{' '}
              e{' '}
              <a href="#" className="text-red-600 hover:text-red-700">
                política de privacidade
              </a>
            </label>
          </div>
          
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4
                        tracking-wider uppercase transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'Processando...' : 'Cadastrar'}
            </button>
          </div>
          
          {cadastroSuccess && (
            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded">
              Cadastro realizado com sucesso! Redirecionando...
            </div>
          )}
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-red-600 hover:text-red-700 font-medium">
              Entrar
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

export default Cadastro;