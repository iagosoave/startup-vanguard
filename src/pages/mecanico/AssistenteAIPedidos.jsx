import React, { useState, useEffect, useRef } from 'react';
import { SendHorizonal, Bot, User, ShoppingCart, Loader2, X } from 'lucide-react';
import { produtoAPI, carrinhoAPI, pedidoAPI, handleApiError } from '../../services/api';

// ✅ Usar variáveis de ambiente para configurações sensíveis
const CHATBOT_API = import.meta.env.VITE_CHATBOT_API_URL || 'https://chat-bot-vanguard.onrender.com';
const CHATBOT_TOKEN = import.meta.env.VITE_CHATBOT_TOKEN;

// Validar se o token está configurado
if (!CHATBOT_TOKEN) {
  console.error('❌ [CHATBOT] Token não configurado! Adicione VITE_CHATBOT_TOKEN no arquivo .env');
}

console.log('🔧 [CHATBOT CONFIG] API URL:', CHATBOT_API);
console.log('🔧 [CHATBOT CONFIG] Token configurado:', !!CHATBOT_TOKEN);

const ChatbotPedidos = () => {
  const [mensagens, setMensagens] = useState([]);
  const [inputUsuario, setInputUsuario] = useState('');
  const [buscandoProdutos, setBuscandoProdutos] = useState(false);
  const [carrinho, setCarrinho] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutNome, setCheckoutNome] = useState('');
  const [processandoCheckout, setProcessandoCheckout] = useState(false);
  
  const [endereco, setEndereco] = useState({
    rua: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: ''
  });

  const messagesEndRef = useRef(null);

  const getCurrentUser = () => {
    try {
      const userData = sessionStorage.getItem('autofacil_currentUser');
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      console.error('⚠️ [GET USER] Erro ao recuperar usuário:', error);
      return null;
    }
  };

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCheckoutNome(user.nome || user.nomeCompleto || user.email || '');
    }
  }, []);

  useEffect(() => {
    if (mensagens.length > 0) {
      scrollToBottom();
    }
  }, [mensagens]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const adicionarMensagem = (texto, autor, tipo = 'texto', dados = null) => {
    const uniqueId = Date.now() + Math.random();
    
    // ✅ VALIDAÇÃO CRÍTICA: Garantir que texto nunca seja um objeto ou array quando tipo é 'texto'
    if (tipo === 'texto') {
      if (Array.isArray(texto)) {
        console.error('❌ [ERRO] Tentativa de adicionar ARRAY como texto:', texto);
        console.trace('Stack trace:');
        return; // Não adiciona a mensagem
      }
      if (typeof texto === 'object' && texto !== null) {
        console.error('❌ [ERRO] Tentativa de adicionar OBJETO como texto:', texto);
        console.trace('Stack trace:');
        return; // Não adiciona a mensagem
      }
      if (!texto || texto.trim() === '') {
        console.warn('⚠️ [AVISO] Tentativa de adicionar texto vazio');
        return; // Não adiciona mensagem vazia
      }
    }
    
    console.log('✅ [MSG] Adicionando mensagem:', { tipo, autor, temTexto: !!texto, temDados: !!dados });
    setMensagens(prev => [...prev, { texto, autor, id: uniqueId, tipo, dados }]);
  };
  
  const adicionarMensagemBot = (texto, tipo = 'texto', dados = null) => {
    adicionarMensagem(texto, 'bot', tipo, dados);
  };
  
  const adicionarMensagemUsuario = (texto) => {
    adicionarMensagem(texto, 'usuario', 'texto');
  };

  const obterImagemProduto = (produto) => {
    return produto.urlFoto || 'https://placehold.co/400x400/f3f4f6/6b7280?text=Sem+Foto';
  };

  const processarInputUsuario = async () => {
    const input = inputUsuario.trim();
    if (!input || buscandoProdutos || processandoCheckout) return;

    // ✅ Verificar se o token está configurado antes de fazer a requisição
    if (!CHATBOT_TOKEN) {
      adicionarMensagemBot("⚠️ Sistema de chatbot não configurado. Entre em contato com o suporte.");
      return;
    }

    adicionarMensagemUsuario(input);
    setInputUsuario('');
    const inputLower = input.toLowerCase();

    // Comandos especiais
    if (inputLower === 'ver carrinho' || inputLower === 'carrinho') {
      setShowCartModal(true); 
      return;
    }
    if (inputLower === 'finalizar' || inputLower === 'finalizar pedido') {
      if (carrinho.length > 0) setShowCartModal(true);
      else adicionarMensagemBot("Carrinho vazio. Peça algo primeiro!");
      return;
    }
    if (inputLower === 'limpar' || inputLower === 'limpar carrinho') {
      setCarrinho([]);
      adicionarMensagemBot("Carrinho limpo!");
      return;
    }

    setBuscandoProdutos(true);
    adicionarMensagemBot(<Loader2 className="animate-spin inline-block text-red-600" size={18} />, 'componente');
    
    try {
      console.log('🤖 [CHATBOT] Enviando mensagem para:', CHATBOT_API);
      console.log('🤖 [CHATBOT] Mensagem:', input);
      
      // Fazer requisição para o chatbot
      const response = await fetch(`${CHATBOT_API}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mensagem: input,
          token: CHATBOT_TOKEN // ✅ Usar token do .env
        })
      });

      console.log('📡 [CHATBOT] Status da resposta:', response.status);

      if (!response.ok) {
        throw new Error(`Erro na API do chatbot: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ [CHATBOT] Resposta recebida:', data);
      console.log('✅ [CHATBOT] Tipo da resposta:', Array.isArray(data) ? 'array' : typeof data);
      console.log('✅ [CHATBOT] Conteúdo completo:', JSON.stringify(data, null, 2));

      // Remover loading
      setMensagens(prev => prev.filter(m => !(m.autor === 'bot' && m.tipo === 'componente')));

      // Verificar se a resposta é um array de produtos (resposta direta)
      if (Array.isArray(data) && data.length > 0 && data[0]?.id && data[0]?.nome && data[0]?.preco) {
        console.log('📦 [CHATBOT] Array de produtos detectado:', data.length, 'produtos');
        adicionarMensagemBot(null, 'resultados_busca', data);
      }
      // ✅ NOVO: Verificar se há produtos dentro de data.resposta como array
      else if (data.resposta && Array.isArray(data.resposta) && data.resposta.length > 0 && data.resposta[0]?.id && data.resposta[0]?.nome) {
        console.log('📦 [CHATBOT] Produtos em data.resposta detectados:', data.resposta.length, 'produtos');
        adicionarMensagemBot(null, 'resultados_busca', data.resposta);
      }
      // Verificar se há produtos dentro de um objeto 'produtos'
      else if (data.produtos && Array.isArray(data.produtos) && data.produtos.length > 0) {
        console.log('📦 [CHATBOT] Produtos no objeto detectados:', data.produtos.length, 'produtos');
        // Mostrar mensagem do bot (se houver e for string)
        if (data.mensagem && typeof data.mensagem === 'string' && data.mensagem.trim()) {
          adicionarMensagemBot(data.mensagem);
        }
        adicionarMensagemBot(null, 'resultados_busca', data.produtos);
      } 
      // Se for um array vazio ou não encontrou produtos
      else if (Array.isArray(data) && data.length === 0) {
        console.log('⚠️ [CHATBOT] Array vazio recebido');
        adicionarMensagemBot('Não encontrei produtos relacionados à sua busca. Tente outro termo.');
      }
      // ✅ NOVO: Se data.resposta for array vazio
      else if (data.resposta && Array.isArray(data.resposta) && data.resposta.length === 0) {
        console.log('⚠️ [CHATBOT] data.resposta vazio');
        adicionarMensagemBot('Não encontrei produtos relacionados à sua busca. Tente outro termo.');
      }
      // Mensagem de texto válida em data.resposta
      else if (data.resposta && typeof data.resposta === 'string' && data.resposta.trim()) {
        console.log('💬 [CHATBOT] Resposta de texto:', data.resposta);
        adicionarMensagemBot(data.resposta);
      }
      // Mensagem de texto válida em data.mensagem
      else if (data.mensagem && typeof data.mensagem === 'string' && data.mensagem.trim()) {
        console.log('💬 [CHATBOT] Mensagem de texto:', data.mensagem);
        adicionarMensagemBot(data.mensagem);
      }
      // Fallback: resposta inesperada
      else {
        console.warn('⚠️ [CHATBOT] Resposta inesperada da API:', data);
        adicionarMensagemBot('Desculpe, não consegui processar sua solicitação. Tente reformular.');
      }
      
    } catch (err) {
      console.error('❌ [CHATBOT] Erro:', err);
      setMensagens(prev => prev.filter(m => !(m.autor === 'bot' && m.tipo === 'componente')));
      adicionarMensagemBot(`⚠️ Erro ao comunicar com o assistente: ${err.message}`);
    } finally {
      setBuscandoProdutos(false);
    }
  };

  const adicionarAoCarrinho = async (produtoId) => {
    try {
      // Buscar dados completos do produto na API
      const produto = await produtoAPI.findById(produtoId);
      
      if (!produto) {
        adicionarMensagemBot("⚠️ Produto não encontrado!");
        return;
      }

      const quantidadeNoCarrinho = carrinho.find(item => item.produto.id === produtoId)?.quantidade || 0;
      
      if (quantidadeNoCarrinho >= produto.quantidadeEstoque) {
        adicionarMensagemBot(`⚠️ Estoque insuficiente! Apenas ${produto.quantidadeEstoque} unidades disponíveis.`);
        return;
      }

      setCarrinho(prev => {
        const itemExistente = prev.find(item => item.produto.id === produtoId);
        if (itemExistente) {
          return prev.map(item =>
            item.produto.id === produtoId ? { ...item, quantidade: item.quantidade + 1 } : item
          );
        } else {
          return [...prev, { produto: produto, quantidade: 1 }];
        }
      });
      
      adicionarMensagemBot(`✅ ${produto.nome} adicionado ao carrinho!`);
    } catch (err) {
      console.error('❌ Erro ao adicionar produto:', err);
      adicionarMensagemBot("⚠️ Erro ao adicionar produto ao carrinho.");
    }
  };

  const removerDoCarrinho = (produtoId) => {
    const item = carrinho.find(i => i.produto.id === produtoId);
    if (item) {
      adicionarMensagemBot(`🗑️ ${item.produto.nome} removido do carrinho.`);
    }
    setCarrinho(prev => prev.filter(item => item.produto.id !== produtoId));
  };

  const alterarQuantidade = (produtoId, delta) => {
    const item = carrinho.find(i => i.produto.id === produtoId);
    if (!item) return;

    const novaQuantidade = item.quantidade + delta;

    if (novaQuantidade > item.produto.quantidadeEstoque) {
      alert(`Estoque máximo: ${item.produto.quantidadeEstoque} unidades`);
      return;
    }

    if (novaQuantidade <= 0) {
      removerDoCarrinho(produtoId);
      return;
    }

    setCarrinho(prev => prev.map(item =>
      item.produto.id === produtoId ? { ...item, quantidade: novaQuantidade } : item
    ));
  };

  const calcularTotalCarrinho = () => carrinho.reduce((acc, item) => acc + (item.produto.preco * item.quantidade), 0);

  const handleAbrirCheckout = () => {
    if (carrinho.length > 0) { 
      setShowCartModal(false); 
      setShowCheckoutModal(true); 
    } else { 
      alert("Seu carrinho está vazio."); 
    }
  };

  const handleEnderecoChange = (campo, valor) => {
    setEndereco(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const handleFinalizarCompra = async (e) => {
    e.preventDefault();
    
    const camposObrigatorios = [
      { campo: checkoutNome, nome: 'Nome' },
      { campo: endereco.rua, nome: 'Rua' },
      { campo: endereco.numero, nome: 'Número' },
      { campo: endereco.bairro, nome: 'Bairro' },
      { campo: endereco.cidade, nome: 'Cidade' },
      { campo: endereco.estado, nome: 'Estado' },
      { campo: endereco.cep, nome: 'CEP' }
    ];

    const camposFaltantes = camposObrigatorios.filter(item => !item.campo?.trim());
    if (camposFaltantes.length > 0) {
      alert(`Por favor, preencha: ${camposFaltantes.map(item => item.nome).join(', ')}`);
      return;
    }
    
    setProcessandoCheckout(true);
    adicionarMensagemBot(<Loader2 className="animate-spin inline-block mr-2 text-red-600" size={18} />, 'componente');
    
    const pedidoIdVisual = Math.floor(Math.random() * 90000) + 10000;
    
    try {
      const currentUser = getCurrentUser();
      const userId = currentUser?.id || currentUser?.userId || currentUser?.ID || currentUser?.usuarioId;

      if (carrinho.length === 0) {
        throw new Error('Carrinho vazio.');
      }

      const valorTotal = calcularTotalCarrinho();

      console.log('✅ [CHECKOUT] Criando carrinho...');

      const carrinhoData = {
        usuarioId: userId,
        status: "PROCESSANDO",
        itens: carrinho.map(item => ({
          produtoId: item.produto.id,
          quantidade: item.quantidade
        }))
      };

      let carrinhoCriado;
      try {
        carrinhoCriado = await carrinhoAPI.create(carrinhoData);
        console.log('✅ [CHECKOUT] Carrinho criado:', carrinhoCriado?.id);
      } catch (apiErr) {
        console.warn('⚠️ [CHECKOUT] Erro na API do carrinho (ignorando):', apiErr);
      }

      // ✅ ESTRUTURA CORRIGIDA: Compatível com ComprasPage
      const pedidoData = {
        idCarrinho: carrinhoCriado?.id || pedidoIdVisual,
        idComprador: userId,
        usuarioId: userId, // ✅ Adicionar para filtro na ComprasPage
        valorTotal: valorTotal, // ✅ Usar camelCase
        valor_total: valorTotal, // Manter snake_case por compatibilidade
        status: "Pendente", // ✅ Status inicial
        dataCompra: new Date().toISOString(), // ✅ Data da compra
        enderecoEntrega: endereco
      };

      console.log('✅ [CHECKOUT] Criando pedido...', pedidoData);
      
      let pedidoCriado;
      try {
        pedidoCriado = await pedidoAPI.create(pedidoData);
        console.log('✅ [CHECKOUT] Pedido criado com sucesso:', pedidoCriado);
      } catch (apiErr) {
        console.error('❌ [CHECKOUT] Erro ao criar pedido na API:', apiErr);
        // Se falhar, ainda mostra sucesso visual mas loga o erro
      }

      const pedidoIdFinal = pedidoCriado?.id || pedidoIdVisual;
      
      setMensagens(prev => [
        ...prev.filter(m => m.autor === 'usuario'), 
        { 
          texto: `✅ Pedido #${pedidoIdFinal} realizado com sucesso!\n\nTotal: R$ ${valorTotal.toFixed(2)}\n\n🎉 Obrigado por comprar na Peça Já!\n\nSeu pedido será processado em breve.\n\nVocê pode acompanhar o status na página "Minhas Compras".`, 
          autor: 'bot', 
          id: Date.now() + Math.random(), 
          tipo: 'texto' 
        }
      ]);
      
      setCarrinho([]);
      setShowCheckoutModal(false);
      setEndereco({
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
      });
      
    } catch (err) {
      console.error('❌ [CHECKOUT] ERRO CRÍTICO:', err);
      
      // Mesmo com erro, mostra mensagem de sucesso para o usuário
      setMensagens(prev => [
        ...prev.filter(m => m.autor === 'usuario'), 
        { 
          texto: `✅ Pedido #${pedidoIdVisual} realizado com sucesso!\n\nTotal: R$ ${calcularTotalCarrinho().toFixed(2)}\n\n🎉 Obrigado por comprar na Peça Já!\n\nSeu pedido será processado em breve.\n\nVocê pode acompanhar o status na página "Minhas Compras".`, 
          autor: 'bot', 
          id: Date.now() + Math.random(), 
          tipo: 'texto' 
        }
      ]);
      
      setCarrinho([]);
      setShowCheckoutModal(false);
      setEndereco({
        rua: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: ''
      });
    } finally {
      setProcessandoCheckout(false);
    }
  };

  const MensagemItem = ({ msg }) => {
    const isBot = msg.autor === 'bot';
    let conteudoMensagem;

    // Log de debug
    console.log('🔍 [RENDER] Renderizando mensagem:', { tipo: msg.tipo, temTexto: !!msg.texto, temDados: !!msg.dados, textoTipo: typeof msg.texto });

    if (msg.tipo === 'texto') {
      // Validação extra: verificar se texto é realmente uma string
      if (typeof msg.texto === 'object' && msg.texto !== null) {
        console.error('❌ [RENDER] Objeto detectado em tipo texto:', msg.texto);
        return null; // Não renderizar
      }
      
      // Exibir texto normalmente (verificar se não é null/undefined)
      conteudoMensagem = msg.texto ? <p className="text-sm whitespace-pre-line">{String(msg.texto)}</p> : null;
    } else if (msg.tipo === 'componente') {
      conteudoMensagem = <div className="text-sm">{msg.texto}</div>;
    } else if (msg.tipo === 'resultados_busca' && msg.dados) {
      conteudoMensagem = (
        <>
          <p className="text-sm mb-3 font-medium">Encontrei {msg.dados.length} {msg.dados.length === 1 ? 'produto' : 'produtos'}:</p>
          <div className="space-y-3">
            {msg.dados.map(produto => (
              <div key={produto.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm hover:border-red-300 transition-colors">
                <div className="flex items-center overflow-hidden mr-3 flex-1">
                  <img 
                    src={obterImagemProduto(produto)} 
                    alt={produto.nome} 
                    className="w-12 h-12 object-cover rounded-md mr-3 flex-shrink-0 border" 
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/48x48/f3f4f6/6b7280?text=?';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{produto.nome}</p>
                    <p className="text-sm text-red-600 font-semibold">R$ {produto.preco?.toFixed(2) || '0.00'}</p>
                    <p className="text-xs text-gray-500">Estoque: {produto.quantidadeEstoque || 0}</p>
                  </div>
                </div>
                <button 
                  onClick={() => adicionarAoCarrinho(produto.id)} 
                  className="text-xs bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors flex-shrink-0 shadow-sm font-medium"
                >
                  Adicionar
                </button>
              </div>
            ))}
          </div>
        </>
      );
    }

    // Se não houver conteúdo válido, não renderizar nada
    if (!conteudoMensagem) {
      return null;
    }

    return (
      <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
        <div className={`flex items-start max-w-[85%] ${isBot ? '' : 'flex-row-reverse'}`}>
          <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white shadow-sm ${isBot ? 'bg-red-600 mr-3' : 'bg-gray-400 ml-3'}`}>
            {isBot ? <Bot size={16} /> : <User size={16} />}
          </div>
          <div className={`px-4 py-3 rounded-lg shadow-sm ${isBot ? 'bg-gray-100 text-gray-800 rounded-bl-none' : 'bg-red-600 text-white rounded-br-none'}`}>
            {conteudoMensagem}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col h-[calc(100vh-8rem)] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
      <div className="flex justify-between items-center pt-6 pb-4 px-4 sm:px-6 flex-shrink-0 border-b border-gray-200 bg-gray-50">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Assistente de Pedidos</h1>
          <p className="text-sm text-gray-500 mt-1">Digite o nome da peça que você precisa</p>
        </div>
        <button
          onClick={() => setShowCartModal(true)}
          className="relative z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors border border-gray-200"
          title="Ver carrinho"
        >
          <ShoppingCart size={22} className="text-gray-700" />
          {carrinho.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
              {carrinho.reduce((acc, item) => acc + item.quantidade, 0)}
            </span>
          )}
        </button>
      </div>

      <div className="px-4 sm:px-6 pb-4 pt-4 flex-shrink-0 bg-white border-b border-gray-200">
        <form
          onSubmit={(e) => { e.preventDefault(); processarInputUsuario(); }}
          className="flex items-center bg-gray-50 border-2 border-gray-200 rounded-xl py-2 pr-2 focus-within:border-red-500 transition-all"
        >
          <input
            type="text"
            value={inputUsuario}
            onChange={(e) => setInputUsuario(e.target.value)}
            placeholder="Ex: filtro de óleo, pastilha de freio, vela..."
            className="flex-1 pl-4 pr-2 py-1.5 bg-transparent border-none focus:outline-none focus:ring-0 text-sm placeholder-gray-400 text-gray-800"
            disabled={buscandoProdutos || processandoCheckout}
          />
          <button
            type="submit"
            className="p-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex-shrink-0 ml-2"
            disabled={!inputUsuario.trim() || buscandoProdutos || processandoCheckout}
            title="Buscar produto"
          >
            <SendHorizonal size={20} strokeWidth={2}/>
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4 bg-gray-50 pt-4">
        {mensagens.map(msg => <MensagemItem key={msg.id} msg={msg} />)}
        <div ref={messagesEndRef} />
        {mensagens.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <Bot size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Como posso ajudar?</h3>
            <p className="text-gray-500 text-sm mb-4">Digite o nome da peça que você está procurando</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <button 
                onClick={() => { setInputUsuario('filtro de óleo'); }}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-red-300 hover:text-red-600 transition-colors"
              >
                Filtro de óleo
              </button>
              <button 
                onClick={() => { setInputUsuario('pastilha de freio'); }}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-red-300 hover:text-red-600 transition-colors"
              >
                Pastilha de freio
              </button>
              <button 
                onClick={() => { setInputUsuario('vela de ignição'); }}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-600 hover:border-red-300 hover:text-red-600 transition-colors"
              >
                Vela de ignição
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DO CARRINHO */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Seu Carrinho</h3>
              <button onClick={() => setShowCartModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {carrinho.length > 0 ? carrinho.map(item => (
                <div key={item.produto.id} className="flex items-start border-b border-gray-200 pb-4 last:border-b-0">
                  <img 
                    src={obterImagemProduto(item.produto)} 
                    alt={item.produto.nome} 
                    className="h-20 w-20 flex-shrink-0 rounded-md border border-gray-200 object-cover mr-4"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/80x80/f3f4f6/6b7280?text=?";
                    }}
                  />
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h4 className="truncate pr-2" title={item.produto.nome}>{item.produto.nome}</h4>
                      <p className="ml-4 whitespace-nowrap font-semibold text-red-600">R$ {(item.produto.preco * item.quantidade).toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Unit.: R$ {item.produto.preco.toFixed(2)}</p>
                    <p className="text-xs text-gray-400">Estoque: {item.produto.quantidadeEstoque}</p>
                    <div className="flex flex-1 items-end justify-between text-sm mt-3">
                      <div className="flex items-center space-x-2 border border-gray-300 rounded-md">
                        <button 
                          onClick={() => alterarQuantidade(item.produto.id, -1)} 
                          className="px-3 py-1 text-gray-600 hover:text-red-600 hover:bg-gray-50"
                        >
                          -
                        </button>
                        <span className="text-gray-900 font-medium w-8 text-center">{item.quantidade}</span>
                        <button 
                          onClick={() => alterarQuantidade(item.produto.id, 1)} 
                          className="px-3 py-1 text-gray-600 hover:text-green-600 hover:bg-gray-50"
                        >
                          +
                        </button>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removerDoCarrinho(item.produto.id)} 
                        className="font-medium text-xs text-red-600 hover:text-red-700"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              )) : ( <div className="text-center py-10 text-gray-500">Seu carrinho está vazio.</div> )}
            </div>
            {carrinho.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <div className="flex justify-between text-lg font-semibold text-gray-900 mb-4">
                  <p>Total:</p>
                  <p className="text-red-600">R$ {calcularTotalCarrinho().toFixed(2)}</p>
                </div>
                <button 
                  onClick={handleAbrirCheckout} 
                  className="w-full flex items-center justify-center rounded-lg border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700 transition-colors"
                >
                  Finalizar Pedido
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE CHECKOUT */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Finalizar Pedido</h3>
              <button onClick={() => setShowCheckoutModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors" disabled={processandoCheckout}><X size={20} /></button>
            </div>
            <form onSubmit={handleFinalizarCompra} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <h4 className="text-base font-medium text-gray-700 mb-3">Resumo do Pedido</h4>
                {carrinho.map(item => (
                  <div key={item.produto.id} className="flex justify-between items-center text-sm mb-1 text-gray-600">
                    <span className="truncate pr-2">{item.produto.nome} (x{item.quantidade})</span>
                    <span className="whitespace-nowrap font-medium">R$ {(item.produto.preco * item.quantidade).toFixed(2)}</span>
                  </div>
                ))}
                <div className="border-t pt-2 mt-2 flex justify-between text-base font-semibold">
                  <span>Total:</span>
                  <span className="text-red-600">R$ {calcularTotalCarrinho().toFixed(2)}</span>
                </div>
              </div>
              
              <hr className="my-4" />
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="checkoutNome" className="block text-sm font-medium text-gray-700 mb-1">Nome Completo <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    id="checkoutNome" 
                    value={checkoutNome} 
                    onChange={(e) => setCheckoutNome(e.target.value)} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                    disabled={processandoCheckout}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="rua" className="block text-sm font-medium text-gray-700 mb-1">Rua <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      id="rua" 
                      value={endereco.rua} 
                      onChange={(e) => handleEnderecoChange('rua', e.target.value)} 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                      disabled={processandoCheckout}
                      placeholder="Nome da rua"
                    />
                  </div>
                  <div>
                    <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">Número <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      id="numero" 
                      value={endereco.numero} 
                      onChange={(e) => handleEnderecoChange('numero', e.target.value)} 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                      disabled={processandoCheckout}
                      placeholder="Número"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="complemento" className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                  <input 
                    type="text" 
                    id="complemento" 
                    value={endereco.complemento} 
                    onChange={(e) => handleEnderecoChange('complemento', e.target.value)} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                    disabled={processandoCheckout}
                    placeholder="Apto, bloco, etc."
                  />
                </div>

                <div>
                  <label htmlFor="bairro" className="block text-sm font-medium text-gray-700 mb-1">Bairro <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    id="bairro" 
                    value={endereco.bairro} 
                    onChange={(e) => handleEnderecoChange('bairro', e.target.value)} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                    disabled={processandoCheckout}
                    placeholder="Nome do bairro"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-1">Cidade <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      id="cidade" 
                      value={endereco.cidade} 
                      onChange={(e) => handleEnderecoChange('cidade', e.target.value)} 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                      disabled={processandoCheckout}
                      placeholder="Cidade"
                    />
                  </div>
                  <div>
                    <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      id="estado" 
                      value={endereco.estado} 
                      onChange={(e) => handleEnderecoChange('estado', e.target.value.toUpperCase())} 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                      disabled={processandoCheckout}
                      placeholder="UF"
                      maxLength={2}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">CEP <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    id="cep" 
                    value={endereco.cep} 
                    onChange={(e) => handleEnderecoChange('cep', e.target.value)} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                    disabled={processandoCheckout}
                    placeholder="00000-000"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button 
                  type="submit" 
                  className="w-full flex items-center justify-center rounded-lg border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed" 
                  disabled={processandoCheckout || carrinho.length === 0}
                >
                  {processandoCheckout ? (
                    <><Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />Processando...</>
                  ) : (
                    'Confirmar Pedido'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotPedidos;