import React from 'react';

const ContactSection = () => {
  return (
    <section className="w-full bg-white py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center bg-gray-50 rounded-lg overflow-hidden">
          {/* Coluna da esquerda - Textos */}
          <div className="lg:w-1/2 p-8 lg:p-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">
              Quer saber mais sobre o Vanguard?
            </h2>
            
            <div className="w-20 h-1 bg-black my-5"></div>
            
            <p className="text-lg text-gray-700 mb-8">
              Entre em contato conosco e descubra como o Vanguard pode transformar a gestão da sua empresa de autopeças.
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <p className="text-gray-700">Suporte especializado para sua empresa</p>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-700">Demonstração personalizada do sistema</p>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-700">Implementação rápida e sem complicações</p>
              </div>
            </div>
          </div>
          
          {/* Coluna da direita - Formulário */}
          <div className="lg:w-1/2 bg-white p-8 lg:p-12 shadow-sm">
            <h3 className="text-2xl font-bold mb-6 text-black">Entre em contato</h3>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
                <input
                  type="text"
                  id="company"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Nome da sua empresa"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="seu@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="(00) 00000-0000"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensagem (opcional)</label>
                <textarea
                  id="message"
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Conte-nos como podemos ajudar"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-black text-white font-medium py-3 px-4 rounded-full hover:bg-gray-900 transition-colors"
              >
                Solicitar contato
              </button>
            </form>
            
            <p className="text-xs text-gray-500 mt-4">
              Ao enviar este formulário, você concorda com nossa política de privacidade e termos de uso.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;