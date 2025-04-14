import React from 'react';

const ContactSection = () => {
  return (
    <section className="w-full bg-black text-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Cabeçalho com estilo minimalista */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase mb-4">
            CONTATO
          </h2>
          <div className="flex items-center justify-center my-6">
            <div className="h-px w-16 bg-white opacity-30"></div>
            <span className="text-lg md:text-xl tracking-widest font-light px-6 opacity-70">MARKETPLACE</span>
            <div className="h-px w-16 bg-white opacity-30"></div>
          </div>
        </div>
        
        {/* Container do formulário com grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Coluna da esquerda - Informações */}
          <div className="p-10 md:p-16 border border-white border-opacity-10">
            <div className="mb-10 opacity-80">
              <div className="w-12 h-[1px] bg-white mb-8"></div>
              <span className="text-xs tracking-widest uppercase opacity-50">MARKETPLACE</span>
            </div>
            
            <h3 className="text-3xl font-bold mb-6 tracking-tight">
              CONECTE-SE AO ECOSSISTEMA AUTOMOTIVO
            </h3>
            
            <p className="text-gray-400 leading-relaxed mb-12">
              Entre em contato para descobrir como nossa plataforma pode conectar sua 
              mecânica ou loja de autopeças a um novo universo de oportunidades.
            </p>
            
            {/* Itens de vantagens em design minimalista */}
            <div className="space-y-8 mb-12">
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-6 h-[1px] bg-white opacity-50 mr-3"></div>
                  <span className="text-sm uppercase tracking-wider">Acesso imediato</span>
                </div>
                <p className="text-gray-400 pl-9">Comece a usar a plataforma no mesmo dia</p>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-6 h-[1px] bg-white opacity-50 mr-3"></div>
                  <span className="text-sm uppercase tracking-wider">Suporte dedicado</span>
                </div>
                <p className="text-gray-400 pl-9">Equipe especializada no setor automotivo</p>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <div className="w-6 h-[1px] bg-white opacity-50 mr-3"></div>
                  <span className="text-sm uppercase tracking-wider">Sem contratos longos</span>
                </div>
                <p className="text-gray-400 pl-9">Flexibilidade para crescer no seu ritmo</p>
              </div>
            </div>
          </div>
          
          {/* Coluna da direita - Formulário */}
          <div className="p-10 md:p-16 bg-white text-black">
            <div className="mb-10">
              <div className="w-12 h-[1px] bg-black mb-8"></div>
              <h3 className="text-2xl font-bold tracking-tight">ENTRE EM CONTATO</h3>
            </div>
            
            <form className="space-y-6">
              {/* Campo Nome */}
              <div>
                <label htmlFor="name" className="block text-xs uppercase tracking-widest mb-2 opacity-60">Nome</label>
                <input
                  type="text"
                  id="name"
                  className="w-full bg-transparent border-b border-black pb-2 focus:outline-none focus:border-gray-600 transition-colors"
                  placeholder="Digite seu nome completo"
                />
              </div>
              
              {/* Campo Empresa */}
              <div>
                <label htmlFor="company" className="block text-xs uppercase tracking-widest mb-2 opacity-60">Empresa</label>
                <input
                  type="text"
                  id="company"
                  className="w-full bg-transparent border-b border-black pb-2 focus:outline-none focus:border-gray-600 transition-colors"
                  placeholder="Nome da sua empresa"
                />
              </div>
              
              {/* Campo Email */}
              <div>
                <label htmlFor="email" className="block text-xs uppercase tracking-widest mb-2 opacity-60">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-transparent border-b border-black pb-2 focus:outline-none focus:border-gray-600 transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
              
              {/* Campo Telefone */}
              <div>
                <label htmlFor="phone" className="block text-xs uppercase tracking-widest mb-2 opacity-60">Telefone</label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full bg-transparent border-b border-black pb-2 focus:outline-none focus:border-gray-600 transition-colors"
                  placeholder="(00) 00000-0000"
                />
              </div>
              
              {/* Campo Tipo de Negócio */}
              <div>
                <label htmlFor="business-type" className="block text-xs uppercase tracking-widest mb-2 opacity-60">Tipo de Negócio</label>
                <select
                  id="business-type"
                  className="w-full bg-transparent border-b border-black pb-2 focus:outline-none focus:border-gray-600 transition-colors"
                >
                  <option value="">Selecione uma opção</option>
                  <option value="autoparts">Loja de Autopeças</option>
                  <option value="workshop">Oficina Mecânica</option>
                  <option value="distributor">Distribuidor</option>
                  <option value="other">Outro</option>
                </select>
              </div>
              
              {/* Botão Submit */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="w-full bg-black text-white font-bold tracking-widest py-4 px-6 hover:bg-gray-900 transition-colors uppercase text-sm"
                >
                  Enviar mensagem
                </button>
              </div>
              
              <p className="text-xs opacity-50 mt-4 text-center">
                Ao enviar este formulário, você concorda com nossa política de privacidade.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;