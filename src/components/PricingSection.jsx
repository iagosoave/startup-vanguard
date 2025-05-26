// src/components/PricingSection.js (or wherever you keep your components)
import React, { useState } from 'react';

const PricingSection = () => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutDetails, setCheckoutDetails] = useState({
    nome: '',
    email: '',
    cpf: '',
    formaPagamento: 'cartao', // Default payment method
    // Add card details if you want to simulate them
    numeroCartao: '',
    validadeCartao: '',
    cvvCartao: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCheckoutDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleFakeCheckoutSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubscriptionSuccess(false); // Reset success message

    // Basic validation
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


    // Simulate API call
    console.log("Iniciando assinatura com:", checkoutDetails);
    setTimeout(() => {
      console.log("Assinatura Falsa Processada!");
      setIsSubmitting(false);
      setSubscriptionSuccess(true); // Show success message
      // setShowCheckoutModal(false); // Keep modal open to show success message or close after a delay
      // Clear form (optional, could be done on modal close)
      // setCheckoutDetails({ nome: '', email: '', cpf: '', formaPagamento: 'cartao', numeroCartao: '', validadeCartao: '', cvvCartao: '' });
    }, 2000); // Simulate 2 seconds delay
  };

  const openCheckout = () => {
    // Pre-fill from session storage if user is logged in (optional)
    const userInfo = sessionStorage.getItem('autofacil_currentUser');
    if (userInfo) {
        const user = JSON.parse(userInfo);
        setCheckoutDetails(prev => ({
            ...prev,
            nome: user.nome || user.nomeEmpresa || '',
            email: user.email || '',
            // cpf might not be in currentUser object typically
        }));
    }
    setSubscriptionSuccess(false); // Reset on opening
    setShowCheckoutModal(true);
  };


  return (
    <section id="pricing" className="w-full bg-gray-50 text-black py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-6">
          ACESSO COMPLETO
        </h2>
        <div className="flex items-center justify-center my-6">
          <div className="h-px w-16 bg-gray-400 opacity-50"></div>
          <span className="text-lg md:text-xl tracking-widest font-light px-6 text-gray-600">NOSSO PLANO</span>
          <div className="h-px w-16 bg-gray-400 opacity-50"></div>
        </div>
        <p className="max-w-xl mx-auto text-gray-700 text-lg mb-12">
          Desbloqueie todas as funcionalidades da plataforma AutoFacil com um plano simples e acessível.
          Conecte-se, gerencie e cresça sem complicações.
        </p>

        <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12 max-w-md mx-auto border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Plano AutoFacil Pro</h3>
          <p className="text-gray-500 mb-6">Acesso ilimitado a todos os recursos.</p>
          
          <div className="my-8">
            <span className="text-6xl font-extrabold text-red-600">R$20</span>
            <span className="text-xl font-medium text-gray-500">/mês</span>
          </div>

          <ul className="space-y-3 text-left text-gray-600 mb-10">
            {[
              "Marketplace integrado para compra e venda",
              "Gestão de estoque eficiente (para Autopeças)",
              "Painel de compras otimizado (para Mecânicos)",
              "Dashboards inteligentes com análises chave",
              "Conexão direta com fornecedores e clientes",
              "Suporte prioritário via e-mail"
            ].map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                {feature}
              </li>
            ))}
          </ul>

          <button
            onClick={openCheckout}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-transform duration-150 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300"
          >
            Assinar Agora e Impulsionar meu Negócio
          </button>
          <p className="text-xs text-gray-500 mt-6">Cancele quando quiser. Sem taxas ocultas.</p>
        </div>
      </div>

      {/* Fake Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold text-gray-900">
                Finalizar Assinatura - AutoFacil Pro
              </h3>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                disabled={isSubmitting}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {!subscriptionSuccess ? (
                <form onSubmit={handleFakeCheckoutSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo <span className="text-red-500">*</span></label>
                      <input type="text" name="nome" id="nome" value={checkoutDetails.nome} onChange={handleInputChange} required className="form-input" disabled={isSubmitting} />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail <span className="text-red-500">*</span></label>
                      <input type="email" name="email" id="email" value={checkoutDetails.email} onChange={handleInputChange} required className="form-input" disabled={isSubmitting} />
                    </div>
                    <div>
                      <label htmlFor="cpf" className="block text-sm font-medium text-gray-700 mb-1">CPF <span className="text-red-500">*</span></label>
                      <input type="text" name="cpf" id="cpf" value={checkoutDetails.cpf} onChange={handleInputChange} placeholder="000.000.000-00" required className="form-input" disabled={isSubmitting} />
                    </div>

                    <div className="pt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Forma de Pagamento</label>
                      <div className="space-y-2">
                        <div className="flex items-center">
                            <input id="cartao" name="formaPagamento" type="radio" value="cartao" checked={checkoutDetails.formaPagamento === 'cartao'} onChange={handleInputChange} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" disabled={isSubmitting}/>
                            <label htmlFor="cartao" className="ml-3 block text-sm text-gray-700">Cartão de Crédito</label>
                        </div>
                        {/* Add PIX or Boleto if desired */}
                        <div className="flex items-center">
                            <input id="pix_checkout" name="formaPagamento" type="radio" value="pix" checked={checkoutDetails.formaPagamento === 'pix'} onChange={handleInputChange} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" disabled={isSubmitting}/>
                            <label htmlFor="pix_checkout" className="ml-3 block text-sm text-gray-700">PIX</label>
                        </div>
                      </div>
                    </div>
                    
                    {checkoutDetails.formaPagamento === 'cartao' && (
                        <div className="pt-2 space-y-4 border-t border-gray-200 mt-4">
                            <h4 className="text-md font-medium text-gray-800 pt-2">Dados do Cartão</h4>
                            <div>
                                <label htmlFor="numeroCartao" className="block text-sm font-medium text-gray-700 mb-1">Número do Cartão <span className="text-red-500">*</span></label>
                                <input type="text" name="numeroCartao" id="numeroCartao" value={checkoutDetails.numeroCartao} onChange={handleInputChange} placeholder="0000 0000 0000 0000" required className="form-input" disabled={isSubmitting} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="validadeCartao" className="block text-sm font-medium text-gray-700 mb-1">Validade (MM/AA) <span className="text-red-500">*</span></label>
                                    <input type="text" name="validadeCartao" id="validadeCartao" value={checkoutDetails.validadeCartao} onChange={handleInputChange} placeholder="MM/AA" required className="form-input" disabled={isSubmitting} />
                                </div>
                                <div>
                                    <label htmlFor="cvvCartao" className="block text-sm font-medium text-gray-700 mb-1">CVV <span className="text-red-500">*</span></label>
                                    <input type="text" name="cvvCartao" id="cvvCartao" value={checkoutDetails.cvvCartao} onChange={handleInputChange} placeholder="123" required className="form-input" disabled={isSubmitting} />
                                </div>
                            </div>
                        </div>
                    )}


                  </div>
                  <div className="mt-8">
                    <button
                      type="submit"
                      className="w-full btn-primary py-3 text-base"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Processando...' : 'Confirmar Assinatura (R$20,00)'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-10">
                    <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-4 text-2xl font-semibold text-gray-900">Assinatura Confirmada!</h3>
                    <p className="mt-2 text-gray-600">
                        Bem-vindo(a) ao AutoFacil Pro! Você agora tem acesso completo à plataforma.
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        Um e-mail de confirmação (fictício) foi enviado para {checkoutDetails.email}.
                    </p>
                    <button
                        onClick={() => {
                            setShowCheckoutModal(false);
                            setCheckoutDetails({ nome: '', email: '', cpf: '', formaPagamento: 'cartao', numeroCartao: '', validadeCartao: '', cvvCartao: '' }); // Reset form
                        }}
                        className="mt-8 btn-secondary"
                    >
                        Fechar
                    </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Minimal global styles for form inputs if not using Tailwind Forms plugin */}
       <style jsx global>{`
        .form-input { display: block; width: 100%; padding: 0.5rem 0.75rem; font-size: 0.875rem; line-height: 1.25rem; border: 1px solid #D1D5DB; border-radius: 0.375rem; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .form-input:focus { outline: 2px solid transparent; outline-offset: 2px; border-color: #EF4444; box-shadow: 0 0 0 1px #EF4444; }
        .btn-primary { padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500; color: white; background-color: #DC2626; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .btn-primary:hover { background-color: #B91C1C; }
        .btn-primary:focus { outline: 2px solid transparent; outline-offset: 2px; box-shadow: 0 0 0 2px #FCA5A5, 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }
        .btn-secondary { padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500; color: #374151; background-color: white; border: 1px solid #D1D5DB; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .btn-secondary:hover { background-color: #F9FAFB; }
      `}</style>
    </section>
  );
};

export default PricingSection;