import React, { useState, useEffect, useRef } from 'react';
import { SendHorizonal, Bot, User, ShoppingCart, Loader2, X, CheckCircle, Clock, Copy, QrCode } from 'lucide-react';
import { produtoAPI, carrinhoAPI } from '../../services/api'; // ✅ READICIONADO carrinhoAPI

// ✅ Usar variáveis de ambiente para configurações sensíveis
const CHATBOT_API = import.meta.env.VITE_CHATBOT_API_URL || 'https://chat-bot-vanguard.onrender.com';
const CHATBOT_TOKEN = import.meta.env.VITE_CHATBOT_TOKEN;
const API_URL = import.meta.env.VITE_API_URL || 'https://prj-startup-java.onrender.com';
const WEBHOOK_URL = import.meta.env.VITE_MERCADOPAGO_WEBHOOK_URL || 'https://prj-startup-java.onrender.com/api/pagamento/webhook';

// =======================================================
// ✅ GAMBIARRA / MOCK: Use TRUE para forçar a aprovação PIX no frontend.
// Mude para FALSE quando o backend em /pix/verificar estiver funcionando.
// =======================================================
const MOCK_PIX_APPROVAL = true; 
// =======================================================

// Validar configurações
if (!CHATBOT_TOKEN) {
  console.error('❌ [CHATBOT] Token não configurado! Adicione VITE_CHATBOT_TOKEN no arquivo .env');
}

console.log('🔧 [CONFIG] API URL:', API_URL);
console.log('🔧 [CONFIG] Webhook URL:', WEBHOOK_URL);
console.log('🔧 [CONFIG] Chatbot API:', CHATBOT_API);
console.log('🔧 [CONFIG] Token configurado:', !!CHATBOT_TOKEN);

const ChatbotPedidos = () => {
  const [mensagens, setMensagens] = useState([]);
  const [inputUsuario, setInputUsuario] = useState('');
  const [buscandoProdutos, setBuscandoProdutos] = useState(false);
  const [carrinho, setCarrinho] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [checkoutNome, setCheckoutNome] = useState('');
  const [processandoCheckout, setProcessandoCheckout] = useState(false);
  
  // Estados do PIX
  const [pixData, setPixData] = useState(null);
  const [pixStatus, setPixStatus] = useState('pending'); // pending, approved, rejected, expired
  const [verificandoPagamento, setVerificandoPagamento] = useState(false);
  const [tempoRestante, setTempoRestante] = useState(600); // 10 minutos
  
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
  const intervalRef = useRef(null);
  const timerRef = useRef(null);

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

  // Timer do PIX
  useEffect(() => {
    if (showPixModal && pixStatus === 'pending') {
      timerRef.current = setInterval(() => {
        setTempoRestante(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setPixStatus('expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [showPixModal, pixStatus]);

  // Limpar intervalos ao desmontar
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const adicionarMensagem = (texto, autor, tipo = 'texto', dados = null) => {
    const uniqueId = Date.now() + Math.random();
    
    if (tipo === 'texto') {
      if (Array.isArray(texto)) {
        console.error('❌ [ERRO] Tentativa de adicionar ARRAY como texto:', texto);
        return;
      }
      if (typeof texto === 'object' && texto !== null) {
        console.error('❌ [ERRO] Tentativa de adicionar OBJETO como texto:', texto);
        return;
      }
      if (!texto || texto.trim() === '') {
        console.warn('⚠️ [AVISO] Tentativa de adicionar texto vazio');
        return;
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
      
      const response = await fetch(`${CHATBOT_API}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mensagem: input,
          token: CHATBOT_TOKEN
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na API do chatbot: ${response.status}`);
      }

      const data = await response.json();
      setMensagens(prev => prev.filter(m => !(m.autor === 'bot' && m.tipo === 'componente')));

      // Processar resposta do chatbot
      if (Array.isArray(data) && data.length > 0 && data[0]?.id && data[0]?.nome && data[0]?.preco) {
        adicionarMensagemBot(null, 'resultados_busca', data);
      }
      else if (data.resposta && Array.isArray(data.resposta) && data.resposta.length > 0 && data.resposta[0]?.id) {
        adicionarMensagemBot(null, 'resultados_busca', data.resposta);
      }
      else if (data.produtos && Array.isArray(data.produtos) && data.produtos.length > 0) {
        if (data.mensagem && typeof data.mensagem === 'string' && data.mensagem.trim()) {
          adicionarMensagemBot(data.mensagem);
        }
        adicionarMensagemBot(null, 'resultados_busca', data.produtos);
      } 
      else if (Array.isArray(data) && data.length === 0) {
        adicionarMensagemBot('Não encontrei produtos relacionados à sua busca. Tente outro termo.');
      }
      else if (data.resposta && typeof data.resposta === 'string' && data.resposta.trim()) {
        adicionarMensagemBot(data.resposta);
      }
      else if (data.mensagem && typeof data.mensagem === 'string' && data.mensagem.trim()) {
        adicionarMensagemBot(data.mensagem);
      }
      else {
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

  // ✅ CRIAR PIX - Corrigido para criar o carrinho antes de chamar a API de PIX
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
    
    try {
      const currentUser = getCurrentUser();
      const userId = currentUser?.id || currentUser?.userId || currentUser?.ID || currentUser?.usuarioId;

      console.log('👤 [DEBUG] Usuário atual:', currentUser);
      console.log('👤 [DEBUG] UserId extraído:', userId);

      if (!userId) {
        throw new Error('Usuário não identificado. Faça login novamente.');
      }

      if (carrinho.length === 0) {
        throw new Error('Carrinho vazio.');
      }

      const valorTotal = calcularTotalCarrinho();
      
      // ======================================================
      // ✅ PASSO 1: CRIAR O CARRINHO E OBTER O ID
      // ======================================================
      const carrinhoData = {
        idComprador: userId,
        itens: carrinho.map(item => ({
            produtoId: item.produto.id,
            quantidade: item.quantidade,
            preco: item.produto.preco
        }))
      };

      console.log('🛒 [CARRINHO] Criando carrinho...');
      const novoCarrinho = await carrinhoAPI.create(carrinhoData); 
      const novoIdCarrinho = novoCarrinho.id || novoCarrinho.idCarrinho;
      
      if (!novoIdCarrinho) {
        throw new Error('Falha ao criar carrinho. ID não retornado pelo servidor.');
      }
      
      console.log(`🛒 [CARRINHO] Carrinho criado com ID: ${novoIdCarrinho}`);
      // ======================================================


      console.log('💳 [PIX] Gerando pagamento PIX direto...');
      console.log('🔗 [WEBHOOK] URL configurada:', WEBHOOK_URL);
      
      // ✅ Montar payload conforme estrutura esperada pelo backend
      const pixPayload = {
        valor: valorTotal,
        descricao: `Pedido Peça Já! - ${carrinho.length} ${carrinho.length === 1 ? 'item' : 'itens'}`,
        email: currentUser.email || 'cliente@pecaja.com',
        nome: checkoutNome,
        cpf: currentUser.cpf || '00000000000',
        pedido: {
          idCarrinho: novoIdCarrinho, // <-- FIX: Usar o ID do carrinho recém-criado
          idComprador: userId,
          enderecoEntrega: endereco,
          itens: carrinho.map(item => ({
            produtoId: item.produto.id,
            quantidade: item.quantidade,
            preco: item.produto.preco
          }))
        },
        webhookUrl: WEBHOOK_URL
      };

      console.log('📤 [PIX] Enviando payload:', pixPayload);
      
      // ✅ Rota correta: /api/pagamento/criar-pix
      const pixResponse = await fetch(`${API_URL}/api/pagamento/criar-pix`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.jwt}`
        },
        body: JSON.stringify(pixPayload)
      });

      if (!pixResponse.ok) {
        const errorData = await pixResponse.json().catch(() => null);
        console.error('❌ [PIX] Erro do backend:', errorData);
        throw new Error(errorData?.message || errorData?.error || `Erro ao gerar PIX: ${pixResponse.status}`);
      }

      const pixDataResponse = await pixResponse.json();
      console.log('✅ [PIX] PIX gerado com sucesso:', pixDataResponse);

      // Armazenar dados do PIX
      setPixData({
        ...pixDataResponse,
        valorTotal: valorTotal
      });

      // Fechar modal de checkout e abrir modal do PIX
      setShowCheckoutModal(false);
      setShowPixModal(true);
      setPixStatus('pending');
      setTempoRestante(600);

      // Iniciar verificação automática do pagamento
      iniciarVerificacaoPagamento(pixDataResponse.pagamentoId || pixDataResponse.id);

    } catch (err) {
      console.error('❌ [CHECKOUT] ERRO:', err);
      alert(`Erro ao processar pagamento: ${err.message}`);
    } finally {
      setProcessandoCheckout(false);
    }
  };

  // ✅ VERIFICAR STATUS DO PAGAMENTO - Polling (MOCKADO PARA TESTES)
  const iniciarVerificacaoPagamento = (pagamentoId) => {
    console.log('🔍 [PIX] Iniciando verificação de pagamento:', pagamentoId);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Verificar a cada 3 segundos
    intervalRef.current = setInterval(async () => {
      try {
        
        // ======================================================
        // ✅ MOCK DE APROVAÇÃO (GAMBIARRA)
        // Se a flag estiver TRUE, simula o sucesso e interrompe a chamada real.
        // ======================================================
        if (MOCK_PIX_APPROVAL) {
            console.log('🎉 [MOCK] Pagamento aprovado SIMULADO!');
            setPixStatus('approved');
            clearInterval(intervalRef.current); // Para o polling
            
            if (timerRef.current) clearInterval(timerRef.current); // Para o timer de contagem regressiva

            // Simula um tempo de processamento antes de exibir a mensagem final
            setTimeout(() => {
                setCarrinho([]);
                setShowPixModal(false);
                setEndereco({
                    rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', cep: ''
                });
                
                // Usa um pedido ID mockado para a mensagem
                const mockPedidoId = pagamentoId + ' (MOCK)';
                
                adicionarMensagemBot(
                  `✅ Pagamento confirmado (SIMULADO)!\n\nPedido #${mockPedidoId} criado com sucesso!\n\nTotal: R$ ${pixData.valorTotal.toFixed(2)}\n\n🎉 Obrigado por comprar na Peça Já!\n\nVocê pode acompanhar o status na página "Minhas Compras".`
                );
            }, 2000); // 2 segundos de delay

            return; // Interrompe o loop para não chamar a API real
        }
        // ======================================================

        // LÓGICA DE POLLING REAL (Será ignorada se MOCK_PIX_APPROVAL for TRUE)
        setVerificandoPagamento(true);
        console.log('🔍 [PIX] Verificando status do pagamento...');

        const currentUser = getCurrentUser();
        const response = await fetch(`${API_URL}/api/pagamento/pix/verificar/${pagamentoId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${currentUser.jwt}`
          }
        });

        if (!response.ok) {
          // Tentar ler o corpo do erro para melhor log
          let errorInfo = `Erro ao verificar pagamento: Status ${response.status}`;
          try {
            const errorJson = await response.json();
            console.error('❌ [PIX POLLING] Erro JSON do servidor:', errorJson);
            errorInfo = errorJson?.message || errorJson?.error || JSON.stringify(errorJson);
          } catch (e) {
            const errorText = await response.text();
            console.error('❌ [PIX POLLING] Erro TEXTO do servidor:', errorText);
            errorInfo = errorText;
          }
          throw new Error(errorInfo);
        }

        const statusData = await response.json();
        console.log('✅ [PIX] Status recebido:', statusData);

        if (statusData.status === 'approved') {
          console.log('🎉 [PIX] Pagamento aprovado!');
          setPixStatus('approved');
          clearInterval(intervalRef.current);
          
          setTimeout(() => {
            setCarrinho([]);
            setShowPixModal(false);
            setEndereco({
              rua: '',
              numero: '',
              complemento: '',
              bairro: '',
              cidade: '',
              estado: '',
              cep: ''
            });
            
            adicionarMensagemBot(
              `✅ Pagamento confirmado!\n\nPedido #${statusData.pedidoId} criado com sucesso!\n\nTotal: R$ ${pixData.valorTotal.toFixed(2)}\n\n🎉 Obrigado por comprar na Peça Já!\n\nVocê pode acompanhar o status na página "Minhas Compras".`
            );
          }, 2000);
        } else if (statusData.status === 'rejected' || statusData.status === 'cancelled') {
          console.log('❌ [PIX] Pagamento rejeitado/cancelado');
          setPixStatus('rejected');
          clearInterval(intervalRef.current);
        }

      } catch (err) {
        console.error('❌ [PIX] Erro ao verificar pagamento:', err);
      } finally {
        setVerificandoPagamento(false);
      }
    }, 3000);
  };

  // ✅ COPIAR CÓDIGO PIX
  const copiarCodigoPix = () => {
    if (pixData?.codigoPix || pixData?.qrCode) {
      navigator.clipboard.writeText(pixData.codigoPix || pixData.qrCode);
      alert('✅ Código PIX copiado!');
    }
  };

  // ✅ FORMATAR TEMPO RESTANTE
  const formatarTempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos}:${segs.toString().padStart(2, '0')}`;
  };

  const MensagemItem = ({ msg }) => {
    const isBot = msg.autor === 'bot';
    let conteudoMensagem;

    if (msg.tipo === 'texto') {
      if (typeof msg.texto === 'object' && msg.texto !== null) {
        return null;
      }
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
      {/* Header */}
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

      {/* Input */}
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

      {/* Mensagens */}
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

      {/* Modal Carrinho */}
      {showCartModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <ShoppingCart className="mr-2 text-red-600" size={24} />
                Meu Carrinho
              </h2>
              <button onClick={() => setShowCartModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {carrinho.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">Seu carrinho está vazio</p>
                  <p className="text-gray-400 text-sm mt-2">Adicione produtos para continuar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {carrinho.map(item => (
                    <div key={item.produto.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-red-300 transition-colors">
                      <div className="flex items-center flex-1 mr-4">
                        <img 
                          src={obterImagemProduto(item.produto)} 
                          alt={item.produto.nome}
                          className="w-16 h-16 object-cover rounded-md mr-4 border"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/64x64/f3f4f6/6b7280?text=?';
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{item.produto.nome}</h3>
                          <p className="text-sm text-red-600 font-semibold">R$ {item.produto.preco?.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">Estoque: {item.produto.quantidadeEstoque}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button 
                            onClick={() => alterarQuantidade(item.produto.id, -1)}
                            className="px-3 py-1 hover:bg-gray-100 transition-colors"
                          >
                            -
                          </button>
                          <span className="px-4 py-1 border-x border-gray-300 font-medium">{item.quantidade}</span>
                          <button 
                            onClick={() => alterarQuantidade(item.produto.id, 1)}
                            className="px-3 py-1 hover:bg-gray-100 transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removerDoCarrinho(item.produto.id)}
                          className="text-red-600 hover:text-red-700 transition-colors p-2"
                          title="Remover"
                        >
                          <X size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {carrinho.length > 0 && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-800">Total:</span>
                  <span className="text-2xl font-bold text-red-600">R$ {calcularTotalCarrinho().toFixed(2)}</span>
                </div>
                <button 
                  onClick={handleAbrirCheckout}
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md"
                >
                  Finalizar Compra
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Checkout */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">Finalizar Pedido</h2>
              <button onClick={() => setShowCheckoutModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleFinalizarCompra} className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    value={checkoutNome}
                    onChange={(e) => setCheckoutNome(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold text-gray-800 mb-3">Endereço de Entrega</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rua *</label>
                      <input
                        type="text"
                        value={endereco.rua}
                        onChange={(e) => handleEnderecoChange('rua', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número *</label>
                      <input
                        type="text"
                        value={endereco.numero}
                        onChange={(e) => handleEnderecoChange('numero', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
                      <input
                        type="text"
                        value={endereco.complemento}
                        onChange={(e) => handleEnderecoChange('complemento', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bairro *</label>
                      <input
                        type="text"
                        value={endereco.bairro}
                        onChange={(e) => handleEnderecoChange('bairro', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cidade *</label>
                      <input
                        type="text"
                        value={endereco.cidade}
                        onChange={(e) => handleEnderecoChange('cidade', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado *</label>
                      <input
                        type="text"
                        value={endereco.estado}
                        onChange={(e) => handleEnderecoChange('estado', e.target.value)}
                        maxLength={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="SP"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">CEP *</label>
                      <input
                        type="text"
                        value={endereco.cep}
                        onChange={(e) => handleEnderecoChange('cep', e.target.value.replace(/\D/g, ''))}
                        maxLength={8}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        placeholder="12345678"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-gray-800">Total a pagar:</span>
                    <span className="text-2xl font-bold text-red-600">R$ {calcularTotalCarrinho().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={processandoCheckout}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={processandoCheckout}
                >
                  {processandoCheckout ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={20} />
                      Processando...
                    </>
                  ) : (
                    'Gerar PIX'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal PIX */}
      {showPixModal && pixData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <QrCode className="mr-2 text-red-600" size={24} />
                  Pagamento PIX
                </h2>
                {pixStatus === 'pending' && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock size={16} className="mr-1" />
                    {formatarTempo(tempoRestante)}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              {pixStatus === 'pending' && (
                <>
                  <div className="text-center mb-6">
                    <p className="text-gray-700 font-medium mb-2">Valor a pagar:</p>
                    <p className="text-3xl font-bold text-red-600">R$ {pixData.valorTotal.toFixed(2)}</p>
                  </div>

                  {pixData.qrCodeBase64 && (
                    <div className="flex justify-center mb-6">
                      <img 
                        src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                        alt="QR Code PIX"
                        className="w-64 h-64 border-4 border-gray-200 rounded-lg"
                      />
                    </div>
                  )}

                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-600 mb-2 font-medium">Código PIX Copia e Cola:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs bg-white p-3 rounded border border-gray-300 break-all">
                        {pixData.codigoPix || pixData.qrCode}
                      </code>
                      <button
                        onClick={copiarCodigoPix}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        title="Copiar código"
                      >
                        <Copy size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-blue-800">
                      <strong>Como pagar:</strong>
                    </p>
                    <ol className="text-sm text-blue-700 mt-2 space-y-1 list-decimal list-inside">
                      <li>Abra o app do seu banco</li>
                      <li>Escolha pagar com PIX</li>
                      <li>Escaneie o QR Code ou cole o código</li>
                      <li>Confirme o pagamento</li>
                    </ol>
                  </div>

                  {verificandoPagamento && (
                    <div className="flex items-center justify-center text-gray-600 text-sm">
                      <Loader2 className="animate-spin mr-2" size={16} />
                      Aguardando pagamento...
                    </div>
                  )}
                </>
              )}

              {pixStatus === 'approved' && (
                <div className="text-center py-8">
                  <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Pagamento Aprovado!</h3>
                  <p className="text-gray-600">Seu pedido foi confirmado com sucesso.</p>
                </div>
              )}

              {pixStatus === 'rejected' && (
                <div className="text-center py-8">
                  <X size={64} className="mx-auto text-red-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Pagamento Recusado</h3>
                  <p className="text-gray-600 mb-4">Não foi possível processar o pagamento.</p>
                  <button
                    onClick={() => {
                      setShowPixModal(false);
                      setShowCheckoutModal(true);
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Tentar Novamente
                  </button>
                </div>
              )}

              {pixStatus === 'expired' && (
                <div className="text-center py-8">
                  <Clock size={64} className="mx-auto text-orange-500 mb-4" />
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">PIX Expirado</h3>
                  <p className="text-gray-600 mb-4">O tempo para pagamento expirou.</p>
                  <button
                    onClick={() => {
                      setShowPixModal(false);
                      setShowCheckoutModal(true);
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Gerar Novo PIX
                  </button>
                </div>
              )}
            </div>

            {pixStatus === 'pending' && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <button
                  onClick={() => {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    if (timerRef.current) clearInterval(timerRef.current);
                    setShowPixModal(false);
                  }}
                  className="w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotPedidos;