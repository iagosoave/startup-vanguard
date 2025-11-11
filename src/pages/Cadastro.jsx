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
    tipoUsuario: 'COMPRADOR', // ✅ MUDADO: Usar COMPRADOR por padrão
    // Endereço
    cep: '',
    rua: '', // ✅ MUDADO: Era logradouro, agora é rua
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cadastroSuccess, setCadastroSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEndereco, setShowEndereco] = useState(false);

  const LIMITS = {
    nomeEmpresa: 100,
    email: 100
  };

  const formatCNPJ = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
    if (numbers.length <= 8) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
    if (numbers.length <= 12) return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
  };

  const formatPhoneNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const formatCEP = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
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
    } else if (name === 'cnpj') {
      newValue = formatCNPJ(value);
    } else if (name === 'cep') {
      newValue = formatCEP(value);
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
    
    if (showEndereco) {
      if (!formData.cep.trim()) newErrors.cep = "CEP é obrigatório";
      if (!formData.rua.trim()) newErrors.rua = "Rua é obrigatória";
      if (!formData.numero.trim()) newErrors.numero = "Número é obrigatório";
      if (!formData.bairro.trim()) newErrors.bairro = "Bairro é obrigatório";
      if (!formData.cidade.trim()) newErrors.cidade = "Cidade é obrigatória";
      if (!formData.estado.trim()) newErrors.estado = "Estado é obrigatório";
    }
    
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
      // ✅ ENDEREÇO NO FORMATO CORRETO (como o Postman)
      const endereco = showEndereco ? {
        rua: formData.rua, // ✅ Agora é 'rua', não 'logradouro'
        numero: formData.numero,
        complemento: formData.complemento || null,
        bairro: formData.bairro,
        cidade: formData.cidade,
        estado: formData.estado,
        cep: formData.cep.replace(/\D/g, '')
      } : null;

      // ✅ DADOS NO FORMATO EXATO DO POSTMAN
      const usuarioData = {
        email: formData.email,
        password: formData.password,
        telefone: formData.telefone.replace(/\D/g, ''),
        nomeCompleto: formData.nomeEmpresa,
        documento: formData.cnpj.replace(/\D/g, ''),
        tipoPessoa: 'Fisica', // ✅ MUDADO: Postman usa 'Fisica', não 'JURIDICA'
        tipoUsuario: formData.tipoUsuario, // Agora pode ser COMPRADOR, LOJISTA, etc
        endereco: endereco
      };

      // ✅ LOGS DETALHADOS
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📤 [CADASTRO] Dados que serão enviados:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(JSON.stringify(usuarioData, null, 2));
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      const usuarioCriado = await usuarioAPI.create(usuarioData);
      console.log('✅ [CADASTRO] Resposta do servidor:', usuarioCriado);
      
      // Login automático
      console.log('🔐 [CADASTRO] Tentando login automático...');
      const loginResponse = await authAPI.login(formData.email, formData.password);
      console.log('✅ [CADASTRO] Login realizado:', loginResponse);
      
      // Salvar no sessionStorage
      const userData = {
        id: usuarioCriado.id,
        nome: formData.nomeEmpresa,
        email: formData.email,
        jwt: loginResponse.token || loginResponse.jwt,
        tipoUsuario: formData.tipoUsuario
      };
      
      sessionStorage.setItem('autofacil_currentUser', JSON.stringify(userData));
      console.log('💾 [CADASTRO] Dados salvos no sessionStorage:', userData);
      
      setCadastroSuccess(true);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
      
    } catch (err) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ [CADASTRO] ERRO CAPTURADO');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('📋 Status:', err.response?.status);
      console.error('📋 Data completa:', err.response?.data);
      console.error('📋 Message:', err.response?.data?.message);
      console.error('📋 Error:', err.response?.data?.error);
      console.error('📋 Details:', err.response?.data?.details);
      console.error('📋 Trace:', err.response?.data?.trace);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      const errorInfo = handleApiError(err);
      
      if (errorInfo.message.toLowerCase().includes('email')) {
        setErrors(prev => ({ ...prev, email: 'Este email já está registrado' }));
      } else if (errorInfo.message.toLowerCase().includes('cnpj') || errorInfo.message.toLowerCase().includes('documento')) {
        setErrors(prev => ({ ...prev, cnpj: 'Este CNPJ já está registrado' }));
      } else {
        setErrors(prev => ({ ...prev, form: errorInfo.message || 'Erro ao criar usuário' }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full min-h-screen bg-white text-black flex items-center justify-center relative overflow-hidden py-20">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-20 px-4 sm:px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="text-xl md:text-2xl font-bold tracking-tight text-black">
              Peça<span className="text-red-600">Já!</span>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Decorative Lines */}
      <div className="absolute top-0 left-0 w-1 h-32 bg-red-600"></div>
      <div className="absolute bottom-0 right-0 w-1 h-32 bg-red-600"></div>
      
      {/* Form Container */}
      <div className="max-w-xl w-full mx-auto px-4 sm:px-8 py-12 bg-white z-10 mt-12 shadow-lg rounded-lg">
        <div className="mb-10 text-center">
          <div className="flex justify-center"><div className="w-12 h-1 bg-red-600 mb-6"></div></div>
          <h1 className="text-3xl font-bold tracking-tight mb-6">Cadastre-se</h1>
          <p className="text-gray-600 mb-8">Crie sua conta para começar a usar o Peça Já!</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ✅ SELEÇÃO DE TIPO DE USUÁRIO */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div 
              className={`border p-4 text-center cursor-pointer transition-all duration-300 ${formData.tipoUsuario === 'COMPRADOR' ? 'border-red-600 text-red-600' : 'border-gray-300'}`}
              onClick={() => handleChange({ target: { name: 'tipoUsuario', value: 'COMPRADOR' } })}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span className="text-sm">Comprador</span>
            </div>
            <div 
              className={`border p-4 text-center cursor-pointer transition-all duration-300 ${formData.tipoUsuario === 'LOJISTA' ? 'border-red-600 text-red-600' : 'border-gray-300'}`}
              onClick={() => handleChange({ target: { name: 'tipoUsuario', value: 'LOJISTA' } })}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              <span className="text-sm">Lojista</span>
            </div>
          </div>
          
          {/* Nome da Empresa */}
          <div>
            <label htmlFor="nomeEmpresa" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo / Empresa</label>
            <div className="relative">
              <input id="nomeEmpresa" name="nomeEmpresa" type="text" required value={formData.nomeEmpresa} onChange={handleChange} maxLength={LIMITS.nomeEmpresa} className={`w-full px-4 py-3 border ${errors.nomeEmpresa ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`} placeholder="Seu nome ou nome da empresa"/>
              <div className="text-xs text-gray-500 mt-1 text-right">{formData.nomeEmpresa.length}/{LIMITS.nomeEmpresa}</div>
            </div>
            {errors.nomeEmpresa && <p className="text-red-500 text-xs mt-1">{errors.nomeEmpresa}</p>}
          </div>
          
          {/* CNPJ/CPF */}
          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-1">CNPJ / CPF</label>
            <input id="cnpj" name="cnpj" type="text" required value={formData.cnpj} onChange={handleChange} className={`w-full px-4 py-3 border ${errors.cnpj ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`} placeholder="XX.XXX.XXX/XXXX-XX" maxLength="18"/>
            {errors.cnpj && <p className="text-red-500 text-xs mt-1">{errors.cnpj}</p>}
          </div>
          
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} maxLength={LIMITS.email} className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`} placeholder="seu@email.com"/>
              <div className="text-xs text-gray-500 mt-1 text-right">{formData.email.length}/{LIMITS.email}</div>
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          {/* Telefone */}
          <div>
            <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input id="telefone" name="telefone" type="tel" required value={formData.telefone} onChange={handleChange} className={`w-full px-4 py-3 border ${errors.telefone ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`} placeholder="(XX) XXXXX-XXXX"/>
            {errors.telefone && <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>}
          </div>
          
          {/* Senha */}
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
          
          {/* Confirmar Senha */}
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

          {/* ✅ BOTÃO PARA ADICIONAR ENDEREÇO */}
          <div className="border-t pt-4">
            <button
              type="button"
              onClick={() => setShowEndereco(!showEndereco)}
              className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center">
              {showEndereco ? '− Remover endereço' : '+ Adicionar endereço (opcional)'}
            </button>
          </div>

          {/* ✅ CAMPOS DE ENDEREÇO */}
          {showEndereco && (
            <div className="space-y-4 border p-4 rounded bg-gray-50">
              <h3 className="font-medium text-gray-700">Endereço</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                  <input id="cep" name="cep" type="text" value={formData.cep} onChange={handleChange} className={`w-full px-4 py-3 border ${errors.cep ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`} placeholder="XXXXX-XXX" maxLength="9"/>
                  {errors.cep && <p className="text-red-500 text-xs mt-1">{errors.cep}</p>}
                </div>
                
                <div>
                  <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <input id="estado" name="estado" type="text" value={formData.estado} onChange={handleChange} className={`w-full px-4 py-3 border ${errors.estado ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`} placeholder="SP" maxLength="2"/>
                  {errors.estado && <p className="text-red-500 text-xs mt-1">{errors.estado}</p>}
                </div>
              </div>
              
              <div>
                <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                <input id="cidade" name="cidade" type="text" value={formData.cidade} onChange={handleChange} className={`w-full px-4 py-3 border ${errors.cidade ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`} placeholder="São Paulo"/>
                {errors.cidade && <p className="text-red-500 text-xs mt-1">{errors.cidade}</p>}
              </div>
              
              <div>
                <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
                <input id="bairro" name="bairro" type="text" value={formData.bairro} onChange={handleChange} className={`w-full px-4 py-3 border ${errors.bairro ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`} placeholder="Centro"/>
                {errors.bairro && <p className="text-red-500 text-xs mt-1">{errors.bairro}</p>}
              </div>
              
              <div>
                <label htmlFor="rua" className="block text-sm font-medium text-gray-700 mb-1">Rua</label>
                <input id="rua" name="rua" type="text" value={formData.rua} onChange={handleChange} className={`w-full px-4 py-3 border ${errors.rua ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`} placeholder="Rua das Flores"/>
                {errors.rua && <p className="text-red-500 text-xs mt-1">{errors.rua}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                  <input id="numero" name="numero" type="text" value={formData.numero} onChange={handleChange} className={`w-full px-4 py-3 border ${errors.numero ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600`} placeholder="123"/>
                  {errors.numero && <p className="text-red-500 text-xs mt-1">{errors.numero}</p>}
                </div>
                
                <div>
                  <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                  <input id="complemento" name="complemento" type="text" value={formData.complemento} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600" placeholder="Apto, Sala, etc."/>
                </div>
              </div>
            </div>
          )}
          
          {/* Termos */}
          <div className="flex items-center">
            <input id="termos" name="termos" type="checkbox" required className="h-4 w-4 text-red-600 focus:ring-red-600 border-gray-300 rounded"/>
            <label htmlFor="termos" className="ml-2 block text-sm text-gray-700">Eu concordo com os <a href="#" className="text-red-600 hover:text-red-700">termos de serviço</a> e <a href="#" className="text-red-600 hover:text-red-700">política de privacidade</a></label>
          </div>
          
          {errors.form && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-red-600 text-sm">{errors.form}</p>
            </div>
          )}
          
          {/* Botão de Submissão */}
          <div>
            <button type="submit" disabled={isSubmitting} className={`w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 tracking-wider uppercase transition-all duration-300 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {isSubmitting ? 'Processando...' : 'Cadastrar'}
            </button>
          </div>
          
          {cadastroSuccess && (<div className="mt-4 p-3 bg-green-100 text-green-800 rounded">✅ Cadastro realizado com sucesso! Redirecionando...</div>)}
        </form>
        
        <div className="mt-8 text-center"><p className="text-gray-600">Já tem uma conta? <Link to="/login" className="text-red-600 hover:text-red-700 font-medium">Entrar</Link></p></div>
      </div>
      
      {/* Footer */}
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