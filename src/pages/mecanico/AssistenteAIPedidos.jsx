import React, { useState, useEffect, useRef } from 'react';
import { SendHorizonal, Bot, User, ShoppingCart, Loader2, X } from 'lucide-react';

// --- Mock de Dados (Substituir pela API) ---
const mockProdutos = [
  { id: 'vela1', nome: 'Vela de Ignição NGK - CG 150', preco: 15.50, imagemUrl: 'https://images.tcdn.com.br/img/img_prod/1027273/vela_de_ignicao_ngk_407_2_d22001f9d0a6d6d243be9e7e80c6243f.jpg' },
  { id: 'vela2', nome: 'Vela de Ignição Iridium - CB 300', preco: 45.00, imagemUrl: 'https://http2.mlstatic.com/D_NQ_NP_667101-MLB44926589201_022021-O.webp' },
  { id: 'filtro1', nome: 'Filtro de Ar Fram - Biz 125', preco: 22.00, imagemUrl: 'https://images.tcdn.com.br/img/img_prod/1153789/filtro_ar_ca11261_fram_837_1_1c981ec7c5e235f921b10b3e3b45b9ad.jpg' },
  { id: 'oleo1', nome: 'Óleo Motul 5100 10W40 Semissintético', preco: 55.90, imagemUrl: 'https://m.media-amazon.com/images/I/61v0aZ4Zz3L._AC_UF1000,1000_QL80_.jpg'},
];

// --- Simulação de API (COMENTADA) ---
// const buscarProdutosAPI = async (termo) => {
//   ...
// };
// const finalizarPedidoAPI = async (carrinho) => {
//   ...
// };
// --- Fim Simulação API ---

const ChatbotPedidos = () => {
  const [mensagens, setMensagens] = useState([]);
  const [inputUsuario, setInputUsuario] = useState('');
  const [buscandoProdutos, setBuscandoProdutos] = useState(false);
  const [carrinho, setCarrinho] = useState([]);
  const [estadoConversa, setEstadoConversa] = useState('inicial');
  const [resultadosBusca, setResultadosBusca] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutNome, setCheckoutNome] = useState('');
  const [checkoutEndereco, setCheckoutEndereco] = useState('');
  const [checkoutPagamento, setCheckoutPagamento] = useState('cartao');
  const [processandoCheckout, setProcessandoCheckout] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const userInfo = sessionStorage.getItem('autofacil_currentUser');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setCheckoutNome(user.nomeEmpresa || user.nome || '');
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

  const adicionarMensagem = (texto, autor, tipo = 'texto') => {
    setMensagens(prev => [...prev, { texto, autor, id: Date.now(), tipo }]);
  };
  const adicionarMensagemBot = (texto, tipo = 'texto') => {
    adicionarMensagem(texto, 'bot', tipo);
  };
  const adicionarMensagemUsuario = (texto) => {
    adicionarMensagem(texto, 'usuario', 'texto');
  };

  const processarInputUsuario = async () => {
    const input = inputUsuario.trim();
    if (!input || buscandoProdutos || estadoConversa === 'finalizando' || processandoCheckout) return;

    adicionarMensagemUsuario(input);
    setInputUsuario('');
    const inputLower = input.toLowerCase();

    if (inputLower === 'ver carrinho' || inputLower === 'carrinho') {
      setShowCartModal(true); return;
    }
    if (inputLower === 'finalizar' || inputLower === 'finalizar pedido') {
       if (carrinho.length > 0) setShowCartModal(true);
       else adicionarMensagemBot("Carrinho vazio. Peça algo primeiro!");
      return;
    }

    setBuscandoProdutos(true);
    setEstadoConversa('buscando');
    adicionarMensagemBot(<Loader2 className="animate-spin inline-block text-red-600" size={18} />, 'componente');
    
    // const resultados = await buscarProdutosAPI(inputLower); // CHAMADA API REAL
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulação
    const resultados = mockProdutos.filter(p => p.nome.toLowerCase().includes(inputLower) || p.id.toLowerCase().includes(inputLower)); // Simulação

    setMensagens(prev => prev.filter(m => !(m.autor === 'bot' && m.tipo === 'componente')));
    setBuscandoProdutos(false);

    if (resultados.length > 0) {
      setResultadosBusca(resultados);
      setEstadoConversa('mostrando_resultados');
      adicionarMensagemBot(resultados, 'resultados_busca');
    } else {
      setEstadoConversa('inicial');
      adicionarMensagemBot(`Desculpe, não encontrei produtos para "${input}". Tente novamente.`);
    }
  };

  const adicionarAoCarrinho = (produtoId) => {
    const produto = resultadosBusca.find(p => p.id === produtoId);
    if (!produto) return;

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
    
    setShowCartModal(true); 
  };

  const calcularTotalCarrinho = () => carrinho.reduce((acc, item) => acc + (item.produto.preco * item.quantidade), 0);

  const handleAbrirCheckout = () => {
    if (carrinho.length > 0) { setShowCartModal(false); setShowCheckoutModal(true); }
    else { alert("Seu carrinho está vazio."); }
  };

  const handleFinalizarCompra = async (e) => {
    e.preventDefault();
    if (!checkoutNome || !checkoutEndereco) { alert("Por favor, preencha nome e endereço."); return; }
    setProcessandoCheckout(true);
    
    adicionarMensagemBot(<Loader2 className="animate-spin inline-block mr-2 text-red-600" size={18} />, 'componente');
    
    // const resultado = await finalizarPedidoAPI(carrinho); // CHAMADA API REAL
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulação
    const pedidoId = `P-${Date.now()}`; // Simulação
    // if (resultado.success) { // Para API REAL
      setMensagens(prev => [
        ...prev.filter(m => m.autor === 'usuario'), 
        { texto: `Pedido #${pedidoId} realizado! Obrigado por comprar na Peça Já!`, autor: 'bot', id: Date.now(), tipo: 'texto' }
      ]);
      setCarrinho([]);
      setShowCheckoutModal(false);
      setCheckoutPagamento('cartao');
      setResultadosBusca([]);
    // } else {
    //   adicionarMensagemBot(`Erro no pedido: ${resultado.message}`);
    // }
    setProcessandoCheckout(false);
    setEstadoConversa('inicial');
  };

  const MensagemItem = ({ msg }) => {
    const isBot = msg.autor === 'bot';
    return (
      <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}>
        <div className={`flex items-start max-w-[85%] ${isBot ? '' : 'flex-row-reverse'}`}>
          <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-white shadow-sm ${isBot ? 'bg-red-600 mr-3' : 'bg-gray-400 ml-3'}`}>
            {isBot ? <Bot size={16} /> : <User size={16} />}
          </div>
          <div className={`px-4 py-3 rounded-lg shadow-sm ${isBot ? 'bg-gray-100 text-gray-800 rounded-bl-none' : 'bg-red-600 text-white rounded-br-none'}`}>
            {msg.tipo === 'texto' && <p className="text-sm">{msg.texto}</p>}
            {msg.tipo === 'componente' && <div className="text-sm">{msg.texto}</div>}
            {msg.tipo === 'resultados_busca' && (
              <>
                <p className="text-sm mb-3 font-medium">Encontrei estes itens:</p>
                <div className="space-y-3">
                  {msg.texto.map(produto => (
                    <div key={produto.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 shadow-sm max-w-sm hover:border-red-300 transition-colors">
                      <div className="flex items-center overflow-hidden mr-3">
                        <img src={produto.imagemUrl || 'https://via.placeholder.com/40'} alt={produto.nome} className="w-10 h-10 object-cover rounded-md mr-3 flex-shrink-0 border" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{produto.nome}</p>
                          <p className="text-sm text-red-600 font-semibold">{`R$ ${produto.preco.toFixed(2)}`}</p>
                        </div>
                      </div>
                      <button onClick={() => adicionarAoCarrinho(produto.id)} className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors flex-shrink-0 shadow-sm">Adicionar</button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col h-[calc(100vh-8rem)] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">

      <div className="flex justify-between items-center pt-6 pb-4 px-4 sm:px-6 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-800">
          Faça seu pedido!
        </h1>
        <button
          onClick={() => setShowCartModal(true)}
          className="relative z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          title="Ver carrinho"
        >
           <ShoppingCart size={20} className="text-gray-700" />
           {carrinho.length > 0 && (
             <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center border border-white text-[10px]">
               {carrinho.reduce((acc, item) => acc + item.quantidade, 0)}
             </span>
           )}
        </button>
      </div>

      <div className="px-4 sm:px-6 pb-4 flex-shrink-0">
        <form
          onSubmit={(e) => { e.preventDefault(); processarInputUsuario(); }}
          className="flex items-center bg-gray-100 border border-gray-200 rounded-full py-1.5 pr-2 focus-within:ring-2 focus-within:ring-red-500 focus-within:border-transparent transition-all"
        >
          <input
            type="text"
            value={inputUsuario}
            onChange={(e) => setInputUsuario(e.target.value)}
            placeholder="Faça seu pedido..."
            className="flex-1 pl-4 pr-2 py-1 bg-transparent border-none focus:outline-none focus:ring-0 text-sm placeholder-gray-500 text-gray-800"
            disabled={buscandoProdutos || estadoConversa === 'finalizando' || processandoCheckout}
          />

          <button
            type="submit"
            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex-shrink-0 ml-2"
            disabled={!inputUsuario.trim() || buscandoProdutos || estadoConversa === 'finalizando' || processandoCheckout}
            title="Enviar pedido"
          >
            <SendHorizonal size={20} strokeWidth={2}/>
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-4 bg-gray-50 border-t border-gray-200 pt-4">
        {mensagens.map(msg => <MensagemItem key={msg.id} msg={msg} />)}
        <div ref={messagesEndRef} />
        {mensagens.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Digite o nome da peça para começar...</p>
          </div>
        )}
      </div>

      {showCartModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Seu Carrinho</h3>
              <button onClick={() => setShowCartModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"><X size={20} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {carrinho.length > 0 ? carrinho.map(item => (
                 <div key={item.produto.id} className="flex items-start border-b border-gray-200 pb-4 last:border-b-0">
                  <img src={item.produto.imagemUrl || "https://via.placeholder.com/80"} alt={item.produto.nome} className="h-20 w-20 flex-shrink-0 rounded-md border border-gray-200 object-cover mr-4"/>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between text-base font-medium text-gray-900"><h4 className="truncate pr-2" title={item.produto.nome}>{item.produto.nome}</h4><p className="ml-4 whitespace-nowrap font-semibold">R$ {(item.produto.preco * item.quantidade).toFixed(2)}</p></div>
                    <p className="mt-1 text-sm text-gray-500">Unit.: R$ {item.produto.preco.toFixed(2)}</p>
                    <div className="flex flex-1 items-end justify-between text-sm mt-3">
                       <div className="flex items-center space-x-2 border border-gray-300 rounded">
                         <button onClick={() => {}} className="px-2 py-0.5 text-gray-600 hover:text-red-600">-</button>
                         <span className="text-gray-900 font-medium w-6 text-center">{item.quantidade}</span>
                         <button onClick={() => {}} className="px-2 py-0.5 text-gray-600 hover:text-green-600">+</button>
                       </div>
                       <button type="button" onClick={() => {}} className="font-medium text-xs text-red-600 hover:text-red-500">Remover</button>
                    </div>
                  </div>
                </div>
              )) : ( <div className="text-center py-10 text-gray-500">Seu carrinho está vazio.</div> )}
            </div>
            {carrinho.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                <div className="flex justify-between text-lg font-semibold text-gray-900 mb-4"><p>Total:</p><p>R$ {calcularTotalCarrinho().toFixed(2)}</p></div>
                <button onClick={handleAbrirCheckout} className="w-full flex items-center justify-center rounded-lg border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700 transition-colors">Finalizar Pedido</button>
              </div>
            )}
          </div>
        </div>
      )}

      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">Checkout</h3>
              <button onClick={() => setShowCheckoutModal(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors" disabled={processandoCheckout}><X size={20} /></button>
            </div>
            <form onSubmit={handleFinalizarCompra} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div><h4 className="text-base font-medium text-gray-700 mb-3">Resumo</h4>{carrinho.map(item => (<div key={item.produto.id} className="flex justify-between items-center text-sm mb-1 text-gray-600"><span className="truncate pr-2">{item.produto.nome} (x{item.quantidade})</span><span className="whitespace-nowrap">R$ {(item.produto.preco * item.quantidade).toFixed(2)}</span></div>))}<div className="border-t pt-2 mt-2 flex justify-between text-base font-semibold"><span>Total:</span><span>R$ {calcularTotalCarrinho().toFixed(2)}</span></div></div><hr />
              <div><label htmlFor="checkoutNome" className="block text-sm font-medium text-gray-700 mb-1">Nome <span className="text-red-500">*</span></label><input type="text" id="checkoutNome" value={checkoutNome} onChange={(e) => setCheckoutNome(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500" disabled={processandoCheckout}/></div>
              <div><label htmlFor="checkoutEndereco" className="block text-sm font-medium text-gray-700 mb-1">Endereço <span className="text-red-500">*</span></label><textarea id="checkoutEndereco" rows={3} value={checkoutEndereco} onChange={(e) => setCheckoutEndereco(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500" placeholder="Rua Exemplo, 123..." disabled={processandoCheckout}/></div>
              <div><h4 className="text-base font-medium text-gray-700 mb-2">Pagamento</h4><div className="space-y-2"><div className="flex items-center"><input id="payCartao" name="pagamento" type="radio" value="cartao" checked={checkoutPagamento === 'cartao'} onChange={(e) => setCheckoutPagamento(e.target.value)} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" disabled={processandoCheckout}/><label htmlFor="payCartao" className="ml-3 block text-sm font-medium text-gray-700">Cartão (Simulado)</label></div><div className="flex items-center"><input id="payPix" name="pagamento" type="radio" value="pix" checked={checkoutPagamento === 'pix'} onChange={(e) => setCheckoutPagamento(e.target.value)} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300" disabled={processandoCheckout}/><label htmlFor="payPix" className="ml-3 block text-sm font-medium text-gray-700">PIX (Simulado)</label></div></div></div>
              <div className="pt-4 border-t border-gray-200"><button type="submit" className="w-full flex items-center justify-center rounded-lg border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed" disabled={processandoCheckout || carrinho.length === 0}>{processandoCheckout ? (<><Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />Processando...</>) : ('Confirmar Compra')}</button></div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ChatbotPedidos;