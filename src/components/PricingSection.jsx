import React, { useState } from 'react';
import { 
  Store, 
  Package, 
  Wrench, 
  BarChart3, 
  Users, 
  MessageCircle,
  Check,
  Shield,
  Zap,
  Award,
  X,
  Loader2,
  CreditCard,
  QrCode
} from 'lucide-react';

const PricingSection = () => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState({
    nome: '',
    email: '',
    cpf: '',
    formaPagamento: 'cartao',
    numeroCartao: '',
    validadeCartao: '',
    cvvCartao: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  // Função para aplicar máscara no CPF
  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
  };

  // Função para aplicar máscara no cartão
  const formatCardNumber = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
  };

  // Função para aplicar máscara na validade
  const formatCardExpiry = (value) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length >= 2) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
    }
    return numbers;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'numeroCartao') {
      formattedValue = formatCardNumber(value);
    } else if (name === 'validadeCartao') {
      formattedValue = formatCardExpiry(value);
    } else if (name === 'cvvCartao') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
    }

    setCheckoutDetails(prev => ({ ...prev, [name]: formattedValue }));
  };

  const handleFakeCheckoutSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubscriptionSuccess(false);

    // Validações básicas
    if (!checkoutDetails.nome || !checkoutDetails.email || !checkoutDetails.cpf) {
      alert('Por favor, preencha seu nome, email e CPF.');
      setIsSubmitting(false);
      return;
    }
    if (checkoutDetails.formaPagamento === 'cartao' && (!checkoutDetails.numeroCartao || !checkoutDetails.validadeCartao || !checkoutDetails.cvvCartao)) {
      alert('Por favor, preencha os dados do cartão.');
      setIsSubmitting(false);
      return;
    }

    console.log("Iniciando assinatura com:", checkoutDetails);
    setTimeout(() => {
      console.log("Assinatura Falsa Processada!");
      setIsSubmitting(false);
      setSubscriptionSuccess(true);
    }, 2000);
  };

  const openCheckout = () => {
    const userInfo = sessionStorage.getItem('autofacil_currentUser');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setCheckoutDetails(prev => ({
        ...prev,
        nome: user.nome || user.nomeEmpresa || '',
        email: user.email || '',
      }));
    }
    setSubscriptionSuccess(false);
    setShowCheckoutModal(true);
  };

  return (
    <section id="pricing" className="relative w-full bg-gradient-to-br from-gray-50 via-white to-gray-100 text-black py-32 px-6 overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-red-600/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      
      {/* Linhas decorativas */}
      <div className="absolute top-20 left-0 w-1 h-24 bg-red-600"></div>
      <div className="absolute bottom-20 right-0 w-1 h-24 bg-red-600"></div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header da seção */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center justify-center mb-8">
            <div className="w-12 h-1 bg-red-600 mr-4"></div>
            <span className="text-sm font-bold tracking-[0.3em] text-red-600 uppercase">Planos</span>
            <div className="w-12 h-1 bg-red-600 ml-4"></div>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black tracking-tight uppercase mb-8 leading-none">
            <span className="block text-gray-900">Acesso</span>
            <span className="block text-red-600">Completo</span>
          </h2>
          
          <p className="max-w-2xl mx-auto text-gray-600 text-lg md:text-xl leading-relaxed">
            Desbloqueie todo o potencial da plataforma AutoFácil. 
            <br className="hidden md:block" />
            <span className="font-semibold text-gray-800">Conecte-se, gerencie e cresça sem limites.</span>
          </p>
        </div>

        {/* Card de preço principal */}
        <div className="relative max-w-lg mx-auto">
          {/* Badge de destaque */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold tracking-wide shadow-lg">
              MAIS POPULAR
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 hover:shadow-3xl transition-all duration-500 group">
            {/* Header do card */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">AutoFácil Pro</h3>
                <p className="text-red-100 text-sm tracking-wide">Acesso ilimitado a todos os recursos</p>
              </div>
              
              {/* Elementos decorativos */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full"></div>
            </div>

            {/* Preço */}
            <div className="px-8 py-10 text-center border-b border-gray-100">
              <div className="flex items-baseline justify-center">
                <span className="text-6xl md:text-7xl font-black text-gray-900">R$20</span>
                <span className="text-xl font-medium text-gray-500 ml-2">/mês</span>
              </div>
              <p className="text-sm text-gray-500 mt-3">Cancele quando quiser • Sem taxas ocultas</p>
            </div>

            {/* Features */}
            <div className="p-8">
              <h4 className="font-bold text-gray-900 mb-6 text-center">Tudo que você precisa:</h4>
              <ul className="space-y-4 mb-10">
                {[
                  { 
                    icon: Store, 
                    title: "Marketplace Integrado", 
                    desc: "Compra e venda sem complicações" 
                  },
                  { 
                    icon: Package, 
                    title: "Gestão de Estoque", 
                    desc: "Controle inteligente para autopeças" 
                  },
                  { 
                    icon: Wrench, 
                    title: "Painel de Compras", 
                    desc: "Otimizado para mecânicos" 
                  },
                  { 
                    icon: BarChart3, 
                    title: "Dashboards Inteligentes", 
                    desc: "Análises e insights em tempo real" 
                  },
                  { 
                    icon: Users, 
                    title: "Conexão Direta", 
                    desc: "Fornecedores e clientes na palma da mão" 
                  },
                  { 
                    icon: MessageCircle, 
                    title: "Suporte Prioritário", 
                    desc: "Atendimento especializado via e-mail" 
                  }
                ].map((feature, index) => (
                  <li key={index} className="flex items-start group/item">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 group-hover/item:bg-green-200 transition-colors">
                      <Check className="w-4 h-4 text-green-600" strokeWidth={3} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <feature.icon className="w-5 h-5 text-red-600 mr-3" strokeWidth={2} />
                        <span className="font-semibold text-gray-900">{feature.title}</span>
                      </div>
                      <p className="text-sm text-gray-600">{feature.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                onClick={openCheckout}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-5 px-8 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-red-300 group relative overflow-hidden"
              >
                <span className="relative z-10">Começar Agora • Transformar meu Negócio</span>
                <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </div>
          </div>

          {/* Badges de confiança */}
          <div className="flex items-center justify-center space-x-8 mt-12 text-gray-500">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Seguro</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium">Garantido</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium">Instantâneo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Checkout Melhorado */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] flex flex-col overflow-hidden animate-slide-up">
            {/* Header do Modal */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6 text-white relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="text-xl font-bold">Finalizar Assinatura</h3>
                  <p className="text-red-100 text-sm">AutoFácil Pro • R$20,00/mês</p>
                </div>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  disabled={isSubmitting}
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
              {!subscriptionSuccess ? (
                <form onSubmit={handleFakeCheckoutSubmit} className="space-y-6">
                  {/* Dados Pessoais */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                      Dados Pessoais
                    </h4>
                    
                    <div>
                      <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome Completo <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        name="nome" 
                        id="nome" 
                        value={checkoutDetails.nome} 
                        onChange={handleInputChange} 
                        required 
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        disabled={isSubmitting}
                        placeholder="Seu nome completo"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                          E-mail <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="email" 
                          name="email" 
                          id="email" 
                          value={checkoutDetails.email} 
                          onChange={handleInputChange} 
                          required 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                          disabled={isSubmitting}
                          placeholder="seu@email.com"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-2">
                          CPF <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          name="cpf" 
                          id="cpf" 
                          value={checkoutDetails.cpf} 
                          onChange={handleInputChange} 
                          placeholder="000.000.000-00" 
                          required 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                          disabled={isSubmitting}
                          maxLength={14}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Forma de Pagamento */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <span className="w-2 h-2 bg-red-600 rounded-full mr-3"></span>
                      Forma de Pagamento
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div 
                        className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          checkoutDetails.formaPagamento === 'cartao' 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => handleInputChange({ target: { name: 'formaPagamento', value: 'cartao' } })}
                      >
                        <div className="flex items-center">
                          <input 
                            id="cartao" 
                            name="formaPagamento" 
                            type="radio" 
                            value="cartao" 
                            checked={checkoutDetails.formaPagamento === 'cartao'} 
                            onChange={handleInputChange} 
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" 
                            disabled={isSubmitting}
                          />
                          <div className="ml-3">
                            <CreditCard className="w-8 h-5 text-gray-600" strokeWidth={1.5} />
                            <span className="block text-sm font-medium text-gray-900 mt-1">Cartão</span>
                          </div>
                        </div>
                      </div>
                      
                      <div 
                        className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          checkoutDetails.formaPagamento === 'pix' 
                            ? 'border-red-500 bg-red-50' 
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        onClick={() => handleInputChange({ target: { name: 'formaPagamento', value: 'pix' } })}
                      >
                        <div className="flex items-center">
                          <input 
                            id="pix_checkout" 
                            name="formaPagamento" 
                            type="radio" 
                            value="pix" 
                            checked={checkoutDetails.formaPagamento === 'pix'} 
                            onChange={handleInputChange} 
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" 
                            disabled={isSubmitting}
                          />
                          <div className="ml-3">
                            <QrCode className="w-8 h-5 text-green-600" strokeWidth={1.5} />
                            <span className="block text-sm font-medium text-gray-900 mt-1">PIX</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Dados do Cartão */}
                  {checkoutDetails.formaPagamento === 'cartao' && (
                    <div className="space-y-4 p-6 bg-gray-50 rounded-2xl">
                      <h5 className="font-medium text-gray-900">Dados do Cartão</h5>
                      
                      <div>
                        <label htmlFor="numeroCartao" className="block text-sm font-medium text-gray-700 mb-2">
                          Número do Cartão <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="text" 
                          name="numeroCartao" 
                          id="numeroCartao" 
                          value={checkoutDetails.numeroCartao} 
                          onChange={handleInputChange} 
                          placeholder="0000 0000 0000 0000" 
                          required 
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white"
                          disabled={isSubmitting}
                          maxLength={19}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="validadeCartao" className="block text-sm font-medium text-gray-700 mb-2">
                            Validade <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text" 
                            name="validadeCartao" 
                            id="validadeCartao" 
                            value={checkoutDetails.validadeCartao} 
                            onChange={handleInputChange} 
                            placeholder="MM/AA" 
                            required 
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white"
                            disabled={isSubmitting}
                            maxLength={5}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="cvvCartao" className="block text-sm font-medium text-gray-700 mb-2">
                            CVV <span className="text-red-500">*</span>
                          </label>
                          <input 
                            type="text" 
                            name="cvvCartao" 
                            id="cvvCartao" 
                            value={checkoutDetails.cvvCartao} 
                            onChange={handleInputChange} 
                            placeholder="123" 
                            required 
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all bg-white"
                            disabled={isSubmitting}
                            maxLength={3}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* PIX Info */}
                  {checkoutDetails.formaPagamento === 'pix' && (
                    <div className="p-6 bg-green-50 rounded-2xl border border-green-200">
                      <div className="flex items-center mb-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <h5 className="font-medium text-green-900">Pagamento via PIX</h5>
                      </div>
                      <p className="text-sm text-green-800">
                        Após confirmar, você receberá o código PIX para pagamento instantâneo.
                        <br />
                        <span className="font-medium">Aprovação em até 2 minutos!</span>
                      </p>
                    </div>
                  )}

                  {/* Botão de Confirmação */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-4 px-6 rounded-2xl text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                        Processando...
                      </div>
                    ) : (
                      `Confirmar Assinatura • R$20,00`
                    )}
                  </button>
                </form>
              ) : (
                // Tela de Sucesso
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Check className="w-10 h-10 text-green-600" strokeWidth={2} />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    🎉 Assinatura Confirmada!
                  </h3>
                  
                  <p className="text-gray-600 mb-2">
                    <span className="font-semibold text-gray-900">Bem-vindo(a) ao AutoFácil Pro!</span>
                    <br />
                    Você agora tem acesso completo à plataforma.
                  </p>
                  
                  <p className="text-sm text-gray-500 mb-8">
                    Um e-mail de confirmação foi enviado para{' '}
                    <span className="font-medium text-gray-700">{checkoutDetails.email}</span>
                  </p>
                  
                  <button
                    onClick={() => {
                      setShowCheckoutModal(false);
                      setCheckoutDetails({ 
                        nome: '', email: '', cpf: '', formaPagamento: 'cartao', 
                        numeroCartao: '', validadeCartao: '', cvvCartao: '' 
                      });
                    }}
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Começar a Usar Agora
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Estilos customizados */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </section>
  );
};

export default PricingSection;