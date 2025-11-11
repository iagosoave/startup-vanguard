import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usuarioAPI, authAPI, handleApiError } from '../services/api';

const Cadastro = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nomeEmpresa: '',
    cnpj: '',
    email: '',
    telefone: '',
    password: '',
    confirmPassword: '',
    tipoUsuario: 'mecanica'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cadastroSuccess, setCadastroSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const LIMITS = {
    nomeEmpresa: 30,
    email: 30
  };

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const validatePhone = (phone) => {
    const numbers = phone.replace(/\D/g, '');
    return numbers.length >= 10 && numbers.length <= 11;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    if (name === 'telefone') {
      newValue = formatPhoneNumber(value);
    } else if (LIMITS[name] && value.length > LIMITS[name]) {
      newValue = value.slice(0, LIMITS[name]);
    }
    setFormData(prevState => ({ ...prevState, [name]: newValue }));
    if(errors[name]) setErrors({ ...errors, [name]: null });
  };
  
  const validateForm = () => {
    const newErrors = {};
    if (!formData.nomeEmpresa.trim()) newErrors.nomeEmpresa = "Nome da empresa é obrigatório";
    else if (formData.nomeEmpresa.trim().length < 2) newErrors.nomeEmpresa = "Nome deve ter pelo menos 2 caracteres";
    const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
    if (!formData.cnpj.trim()) newErrors.cnpj = "CNPJ é obrigatório";
    else if (!cnpjRegex.test(formData.cnpj)) newErrors.cnpj = "CNPJ inválido (XX.XXX.XXX/XXXX-XX)";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório";
    else if (!emailRegex.test(formData.email)) newErrors.email = "Email inválido";
    if (!formData.telefone.trim()) newErrors.telefone = "Telefone é obrigatório";
    else if (!validatePhone(formData.telefone)) newErrors.telefone = "Telefone inválido ((XX) XXXXX-XXXX)";
    if (!formData.password) newErrors.password = "Senha é obrigatória";
    else if (formData.password.length < 6) newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "As senhas não coincidem";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const usuarioData = {
        nome: formData.nomeEmpresa,
        email: formData.email,
        senha: formData.password,
        telefone: formData.telefone.replace(/\D/g, ''), 
        cnpj: formData.cnpj.replace(/\D/g, ''), 
        tipoUsuario: formData.tipoUsuario.toUpperCase() 
      };

      const usuarioCriado = await usuarioAPI.create(usuarioData);
      
      const loginResponse = await authAPI.login(formData.email, formData.password);
      
      // Alterado de token para jwt
      const userData = {
        id: usuarioCriado.id,
        nome: formData.nomeEmpresa,
        email: formData.email,
        jwt: loginResponse.jwt, // Alterado de token para jwt
        tipoUsuario: formData.tipoUsuario
      };
      
      sessionStorage.setItem('autofacil_currentUser', JSON.stringify(userData));
      setCadastroSuccess(true);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      const errorInfo = handleApiError(err);
      
      if (errorInfo.message.toLowerCase().includes('email')) {
        setErrors(prev => ({ ...prev, email: 'Este email já está registrado' }));
      } else if (errorInfo.message.toLowerCase().includes('cnpj')) {
        setErrors(prev => ({ ...prev, cnpj: 'Este CNPJ já está registrado' }));
      } else {
        setErrors(prev => ({ ...prev, form: errorInfo.message }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full min-h-screen bg-white text-black flex items-center justify-center relative overflow-hidden py-20">
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
      
      <div className="max-w-xl w-full mx-auto px-4 sm:px-8 py-12 bg-white z-10 mt-12 shadow-lg rounded-lg">
        <div className="mb-10 text-center">
          <div className="flex justify-center"><div className="w-12 h-1 bg-red-600 mb-6"></div></div>
          <h1 className="text-3xl font-bold tracking-tight mb-6">Cadastre-se</h1>
          <p className="text-gray-600 mb-8">Crie sua conta para começar a usar o Peça Já!</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div 
              className={`border p-4 text-center cursor-pointer transition-all duration-300 ${formData.tipoUsuario === 'mecanica' ? 'border-red-600 text-red-600' : 'border-gray-300'}`}
              onClick={() => handleChange({ target: { name: 'tipoUsuario', value: 'mecanica' } })}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              <span className="text-sm">Mecânica</span>
            </div>
            <div 
              className={`border p-4 text-center cursor-pointer transition-all duration-300 ${formData.tipoUsuario === 'autopeca' ? 'border-red-600 text-red-600' : 'border-gray-300'}`}
              onClick={() => handleChange({ target: { name: 'tipoUsuario', value: 'autopeca' } })}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              <span className="text-sm">Autopeça</span>
            </div>
          </div>
          
          <div>
            <label htmlFor="nomeEmpresa" className="block text-sm font-medium text-gray-700 mb-1">Nome da Empresa</label>
            <div className="relative">
              <input id="nomeEmpresa" name="nomeEmpresa" type="text" required value={formData.nomeEmpresa} onChange={handleChange} maxLength={LIMITS.nomeEmpresa} className={`w-full px-4 py-3 border ${errors.nomeEmpresa ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`} placeholder="Nome da sua empresa"/>
              <div className="text-xs text-gray-500 mt-1 text-right">{formData.nomeEmpresa.length}/{LIMITS.nomeEmpresa}</div>
            </div>
            {errors.nomeEmpresa && <p className="text-red-500 text-xs mt-1">{errors.nomeEmpresa}</p>}
          </div>
          
          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">CNPJ</label>
            <input id="cnpj" name="cnpj" type="text" required value={formData.cnpj} onChange={handleChange} className={`w-full px-4 py-3 border ${errors.cnpj ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`} placeholder="XX.XXX.XXX/XXXX-XX"/>
            {errors.cnpj && <p className="text-red-500 text-xs mt-1">{errors.cnpj}</p>}
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} maxLength={LIMITS.email} className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`} placeholder="seu@email.com"/>
              <div className="text-xs text-gray-500 mt-1 text-right">{formData.email.length}/{LIMITS.email}</div>
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input id="telefone" name="telefone" type="tel" required value={formData.telefone} onChange={handleChange} className={`w-full px-4 py-3 border ${errors.telefone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`} placeholder="(XX) XXXXX-XXXX"/>
            {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <div className="relative">
              <input id="password" name="password" type={showPassword ? "text" : "password"} required value={formData.password} onChange={handleChange} className={`w-full px-4 py-3 pr-12 border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`} placeholder="••••••••"/>
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700">
                {showPassword ? ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> )}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
            <div className="relative">
              <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} required value={formData.confirmPassword} onChange={handleChange} className={`w-full px-4 py-3 pr-12 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`} placeholder="••••••••"/>
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700">
                {showConfirmPassword ? ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg> ) : ( <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> )}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
          
          <div className="flex items-center">
            <input id="termos" name="termos" type="checkbox" required className="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-300 rounded"/>
            <label htmlFor="termos" className="ml-2 block text-sm text-gray-700">Eu concordo com os <a href="#" className="text-red-600 hover:text-red-700">termos de serviço</a> e <a href="#" className="text-red-600 hover:text-red-700">política de privacidade</a></label>
          </div>
          
          {errors.form && <p className="text-red-500 text-xs mt-1">{errors.form}</p>}
          
          <div>
            <button type="submit" disabled={isSubmitting} className={`w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 tracking-wider uppercase transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {isSubmitting ? 'Processando...' : 'Cadastrar'}
            </button>
          </div>
          
          {cadastroSuccess && (<div className="mt-4 p-3 bg-green-100 text-green-800 rounded">Cadastro realizado com sucesso! Redirecionando...</div>)}
        </form>
        
        <div className="mt-8 text-center"><p className="text-gray-600">Já tem uma conta? <Link to="/login" className="text-red-600 hover:text-red-700 font-medium">Entrar</Link></p></div>
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

export default Cadastro;