import React, { useState } from 'react';

const ContactSection = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      question: "Como funciona o marketplace autoFácil?",
      answer: "Nossa plataforma conecta diretamente mecânicas e lojas de autopeças, eliminando intermediários. Você pode comprar, vender e gerenciar seu inventário em um só lugar, com acesso a milhares de produtos e fornecedores verificados."
    },
    {
      question: "Quem pode usar a plataforma?",
      answer: "A autoFácil é destinada a oficinas mecânicas, lojas de autopeças, distribuidores e qualquer profissional do setor automotivo que deseje comprar ou vender peças de forma direta e eficiente."
    },
    {
      question: "Quais são os custos para usar a plataforma?",
      answer: "Oferecemos diferentes planos para atender às necessidades do seu negócio. Não há contratos longos e você pode começar com um plano básico e expandir conforme seu crescimento."
    },
    {
      question: "Como posso garantir a qualidade das peças?",
      answer: "Todos os fornecedores passam por um processo de verificação rigoroso. Além disso, temos sistema de avaliações, garantias e suporte dedicado para resolver qualquer questão relacionada à qualidade dos produtos."
    },
    {
      question: "A plataforma oferece logística integrada?",
      answer: "Sim! Calculamos fretes automaticamente, geramos etiquetas de envio e permitimos o acompanhamento de entregas em tempo real. Tudo integrado na plataforma para sua comodidade."
    },
    {
      question: "Como funciona o sistema de pagamentos?",
      answer: "Oferecemos múltiplas formas de pagamento seguras e processamento rápido. O sistema é totalmente integrado com proteção para compradores e vendedores, garantindo transações seguras."
    },
    {
      question: "Posso integrar com meu sistema atual?",
      answer: "Sim, nossa plataforma oferece APIs e integrações com os principais sistemas de gestão do setor automotivo. Nossa equipe técnica pode auxiliar na implementação."
    },
    {
      question: "Qual o suporte disponível?",
      answer: "Oferecemos suporte dedicado com equipe especializada no setor automotivo. Você pode contar com chat ao vivo, telefone e email para resolver qualquer dúvida ou problema rapidamente."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <section className="w-full bg-gray-50 text-gray-900 py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4">
            FAQ
          </h2>
          <div className="flex items-center justify-center my-6">
            <div className="h-px w-16 bg-gray-400 opacity-50"></div>
            <span className="text-lg md:text-xl tracking-widest font-light px-6 text-gray-600">PERGUNTAS FREQUENTES</span>
            <div className="h-px w-16 bg-gray-400 opacity-50"></div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Encontre respostas para as principais dúvidas sobre nossa plataforma
          </p>
        </div>
        
        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 bg-white overflow-hidden">
              <button
                onClick={() => toggleFaq(index)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <div className={`w-6 h-6 flex items-center justify-center transition-transform duration-200 ${
                      openFaq === index ? 'transform rotate-45' : ''
                    }`}>
                      <div className="w-4 h-0.5 bg-red-600 absolute"></div>
                      <div className="w-0.5 h-4 bg-red-600"></div>
                    </div>
                  </div>
                </div>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${
                openFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="p-6 pt-0">
                  <div className="w-12 h-0.5 bg-red-600 mb-4"></div>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
       
      </div>
    </section>
  );
};

export default ContactSection;