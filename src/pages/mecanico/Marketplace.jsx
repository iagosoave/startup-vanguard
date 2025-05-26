import React, { useState, useEffect } from 'react';

const MarketplacePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todos');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [checkoutData, setCheckoutData] = useState({
    formaPagamento: 'cartao',
    endereco: {
      rua: '',
      cidade: '',
      estado: '',
      cep: ''
    }
  });

  // Combined useEffect for initial setup
  useEffect(() => {
    // 1. Load Current User
    const userInfo = sessionStorage.getItem('autofacil_currentUser');
    if (userInfo) {
      const parsedUser = JSON.parse(userInfo);
      setCurrentUser(parsedUser);
      setCheckoutData(prev => ({
        ...prev,
        endereco: { // Pre-fill address from user or defaults
          rua: parsedUser.endereco?.rua || 'Av. Principal, 100',
          cidade: parsedUser.endereco?.cidade || 'MarketCity',
          estado: parsedUser.endereco?.estado || 'MC',
          cep: parsedUser.endereco?.cep || '12345-678'
        }
      }));
    }

    // 2. Load Products (handles its own fallback/seed if necessary)
    loadProductsAndSeedMarketplaceFallback();

    // 3. Load Cart
    const savedCart = localStorage.getItem('autofacil_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []); // Runs once on mount

  // useEffect for filtering products
  useEffect(() => {
    let tempFiltered = [...products];
    if (searchTerm) {
      tempFiltered = tempFiltered.filter(product =>
        product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.descricao && product.descricao.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (categoryFilter !== 'todos') {
      tempFiltered = tempFiltered.filter(product => product.categoria === categoryFilter);
    }
    setFilteredProducts(tempFiltered);
  }, [searchTerm, categoryFilter, products]);


  const loadProductsAndSeedMarketplaceFallback = () => {
    let productsFromStorage = JSON.parse(localStorage.getItem('autofacil_products') || '[]');

    // Fallback seed for Marketplace if localStorage is completely empty.
    // This is a minimal seed and should ideally not conflict with EstoquePage's more comprehensive seed.
    if (productsFromStorage.length === 0) {
      console.warn('Marketplace: No products found in localStorage. Seeding minimal fallback products.');
      const marketplaceFallbackProducts = [
        {
          id: "mkt_prod1", // Different IDs than Estoque seed
          nome: "Óleo de Motor Sintético 5W-30 (Mkt)",
          descricao: "Óleo lubrificante sintético de alto desempenho para motores.",
          preco: 58.90,
          categoria: "oleos",
          vendedorId: "vendedor_fallback_mkt",
          imagemUrl: "https://images.tcdn.com.br/img/img_prod/1027273/oleo_de_motor_mobil_super_5w30_sintetico_api_sp_e_dexos_1_407_2_d22001f9d0a6d6d243be9e7e80c6243f.jpg"
        },
        {
          id: "mkt_prod2",
          nome: "Filtro de Óleo PremiumTech (Mkt)",
          descricao: "Filtro de óleo com tecnologia avançada de retenção de partículas.",
          preco: 27.50,
          categoria: "filtros",
          vendedorId: "vendedor_fallback_mkt",
          imagemUrl: "https://images.tcdn.com.br/img/img_prod/771256/filtro_oleo_tecfil_psl123_ford_f150_f1000_f4000_mwm_agrale_40365_1_4af130e8f59d6a003836d80221163b7a.jpg"
        },
      ];
      // IMPORTANT: This write to localStorage could be contentious if EstoquePage is the primary manager.
      // For a strict "Marketplace only reads" approach, remove the next line and setProducts directly.
      // localStorage.setItem('autofacil_products', JSON.stringify(marketplaceFallbackProducts));
      productsFromStorage = marketplaceFallbackProducts;
    }
    setProducts(productsFromStorage);
  };


  const addToCart = (product) => {
    setCart(prevCart => {
      const existingProductIndex = prevCart.findIndex(item => item.id === product.id);
      let updatedCart;
      if (existingProductIndex >= 0) {
        updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantidade += 1;
      } else {
        updatedCart = [...prevCart, { ...product, quantidade: 1, vendedorId: product.vendedorId }]; // Ensure vendedorId is in cart item
      }
      localStorage.setItem('autofacil_cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => item.id !== productId);
      localStorage.setItem('autofacil_cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart => {
      const updatedCart = prevCart.map(item => {
        if (item.id === productId) {
          return { ...item, quantidade: newQuantity };
        }
        return item;
      });
      localStorage.setItem('autofacil_cart', JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('autofacil_cart');
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };

  const handleCheckoutInputChange = (e) => { // Renamed to avoid conflict if MarketplacePage had other inputs
    const { name, value } = e.target;
    if (name.startsWith('endereco.')) {
      const addressField = name.split('.')[1];
      setCheckoutData(prev => ({
        ...prev,
        endereco: { ...prev.endereco, [addressField]: value }
      }));
    } else {
      setCheckoutData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!cart.length) {
      alert('Seu carrinho está vazio!');
      return;
    }
    const { endereco, formaPagamento } = checkoutData;
    if (!endereco.rua || !endereco.cidade || !endereco.estado || !endereco.cep || !formaPagamento) {
      alert('Por favor, preencha todos os campos obrigatórios de endereço e forma de pagamento.');
      return;
    }

    const ordersByVendedor = cart.reduce((acc, item) => {
        const vendedorId = item.vendedorId || 'default_vendedor_mkt'; // Ensure product in cart has vendedorId
        if (!acc[vendedorId]) {
            acc[vendedorId] = { vendedorId, itens: [], valorTotal: 0 };
        }
        acc[vendedorId].itens.push({
            produtoId: item.id, nome: item.nome, quantidade: item.quantidade, precoUnitario: item.preco, imagemUrl: item.imagemUrl
        });
        acc[vendedorId].valorTotal += item.preco * item.quantidade;
        return acc;
    }, {});

    const existingOrders = JSON.parse(localStorage.getItem('autofacil_orders') || '[]');
    const newOrdersCreatedIds = [];

    Object.values(ordersByVendedor).forEach(vendedorOrder => {
        const newOrder = {
            id: `ord_${Date.now().toString()}_${Math.random().toString(36).substr(2, 5)}`,
            compradorId: currentUser?.id || 'default_comprador',
            compradorNome: currentUser?.nomeEmpresa || currentUser?.nome || 'Usuário Anônimo',
            vendedorId: vendedorOrder.vendedorId,
            data: new Date().toISOString(),
            valorTotal: vendedorOrder.valorTotal,
            status: 'pendente',
            formaPagamento,
            itens: vendedorOrder.itens,
            endereco,
            rastreamento: null,
            entregaEstimada: new Date(Date.now() + (3 + Math.floor(Math.random() * 5)) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            entregaRealizada: null
        };
        existingOrders.push(newOrder);
        newOrdersCreatedIds.push(newOrder.id);
    });

    localStorage.setItem('autofacil_orders', JSON.stringify(existingOrders));
    clearCart();
    setShowCheckout(false);
    alert(`Pedido(s) realizado(s) com sucesso! ID(s): ${newOrdersCreatedIds.join(', ')}`);
  };

  const getCategoryLabel = (category) => {
    const categories = {
      'motor': 'Motor', 'freios': 'Freios', 'suspensao': 'Suspensão', 'eletrica': 'Elétrica',
      'filtros': 'Filtros', 'oleos': 'Óleos e Fluídos', 'carroceria': 'Carroceria', 'acessorios': 'Acessórios'
    };
    return categories[category] || category.charAt(0).toUpperCase() + category.slice(1);
  };

  const availableCategories = ['todos', 'motor', 'freios', 'suspensao', 'eletrica', 'filtros', 'oleos', 'acessorios'];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Marketplace de Autopeças</h1>
        <button
          onClick={() => setShowCart(true)}
          className="relative bg-white border border-gray-300 p-2 rounded-full hover:bg-gray-100 focus:outline-none shadow-sm hover:shadow-md transition-shadow"
        >
          <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cart.reduce((sum, item) => sum + item.quantidade, 0)}
            </span>
          )}
        </button>
      </div>

      <div className="mb-8 bg-gray-50 p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Buscar por nome ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-full md:w-auto">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
            >
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>
                  {getCategoryLabel(cat)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col transition-transform hover:scale-105 duration-300">
              <div className="h-48 w-full bg-gray-200 relative group">
                <img
                  src={product.imagemUrl || "https://via.placeholder.com/400x300.png?text=Sem+Imagem"}
                  alt={product.nome}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://via.placeholder.com/400x300.png?text=Erro+Img"; }}
                />
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-md shadow-sm">
                    {getCategoryLabel(product.categoria)}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                  <p className="text-sm truncate">{product.descricao}</p>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate h-14 flex items-center" title={product.nome}>{product.nome}</h3>
                </div>
                <div className="flex justify-between items-center mt-auto pt-3">
                  <p className="text-xl font-bold text-red-600">
                    R$ {Number(product.preco).toFixed(2)}
                  </p>
                  <button
                    onClick={() => addToCart(product)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    <svg className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum produto encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">Verifique o estoque ou adicione novos produtos na página de gestão.</p>
          </div>
        )}
      </div>

      {/* Modal do carrinho */}
      {showCart && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold text-gray-900">Seu Carrinho</h3>
              <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length > 0 ? cart.map(item => (
                <div key={item.id} className="flex items-start border-b border-gray-200 pb-4 last:border-b-0">
                  <img src={item.imagemUrl || "https://via.placeholder.com/100x100.png?text=Sem+Img"} alt={item.nome} className="h-24 w-24 flex-shrink-0 rounded-md border border-gray-200 object-cover"/>
                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between text-base font-medium text-gray-900"><h3 className="truncate pr-2" title={item.nome}>{item.nome}</h3><p className="ml-4 whitespace-nowrap">R$ {(item.preco * item.quantidade).toFixed(2)}</p></div>
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.descricao}</p>
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm mt-2">
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-500">Qtd:</p>
                        <button onClick={() => updateQuantity(item.id, item.quantidade - 1)} className="text-gray-600 hover:text-red-600 bg-gray-100 hover:bg-red-100 h-7 w-7 rounded-full flex items-center justify-center text-lg" disabled={item.quantidade <= 1 && cart.length === 1}>-</button>
                        <span className="text-gray-900 font-medium w-8 text-center">{item.quantidade}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantidade + 1)} className="text-gray-600 hover:text-green-600 bg-gray-100 hover:bg-green-100 h-7 w-7 rounded-full flex items-center justify-center text-lg">+</button>
                      </div>
                      <button type="button" onClick={() => removeFromCart(item.id)} className="font-medium text-red-600 hover:text-red-500">Remover</button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-10">
                  <svg className="mx-auto h-12 w-12 text-gray-400" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" clipRule="evenodd" /></svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Seu carrinho está vazio</h3>
                  <p className="mt-1 text-sm text-gray-500">Adicione produtos do marketplace.</p>
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-4 sticky bottom-0 bg-white z-10">
                <div className="flex justify-between text-lg font-semibold text-gray-900 mb-4"><p>Subtotal</p><p>R$ {calculateTotal().toFixed(2)}</p></div>
                <div className="flex flex-col sm:flex-row justify-between gap-3">
                  <button onClick={clearCart} className="w-full sm:w-auto rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">Limpar carrinho</button>
                  <button onClick={() => { setShowCart(false); setShowCheckout(true);}} className="w-full sm:w-auto flex items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700">Finalizar Compra</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de checkout */}
      {showCheckout && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold text-gray-900">Finalizar Compra</h3>
              <button onClick={() => setShowCheckout(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleCheckout}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-6"> {/* Coluna Esquerda: Resumo e Pagamento */}
                    <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Resumo do Pedido</h4>
                    {cart.length > 0 ? (
                      <div className="space-y-2 mb-6 max-h-60 overflow-y-auto pr-2">
                        {cart.map(item => (
                          <div key={item.id} className="flex justify-between items-center text-sm">
                            <span className="truncate pr-2 flex-grow flex items-center">
                                <img src={item.imagemUrl || "https://via.placeholder.com/30x30.png?text=P"} alt={item.nome} className="w-8 h-8 inline-block mr-2 rounded object-cover"/>
                                {item.nome} (x{item.quantidade})
                            </span>
                            <span className="font-medium whitespace-nowrap">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-sm text-gray-500 mb-4">Seu carrinho está vazio.</p>}
                    <div className="border-t pt-3 flex justify-between text-lg font-semibold"><span>Total Geral:</span><span>R$ {calculateTotal().toFixed(2)}</span></div>
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-3 border-b pb-2 mt-4">Forma de Pagamento</h4>
                      <div className="space-y-3">
                        {['cartao', 'boleto', 'pix'].map(method => (
                          <div key={method} className="flex items-center">
                            <input id={method} name="formaPagamento" type="radio" value={method} checked={checkoutData.formaPagamento === method} onChange={handleCheckoutInputChange} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"/>
                            <label htmlFor={method} className="ml-3 block text-sm font-medium text-gray-700">{method === 'cartao' ? 'Cartão de Crédito' : method === 'boleto' ? 'Boleto Bancário' : 'PIX'}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6"> {/* Coluna Direita: Endereço */}
                    <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Endereço de Entrega</h4>
                    <div className="space-y-4">
                      <div><label htmlFor="endereco.rua" className="block text-sm font-medium text-gray-700 mb-1">Rua / Número <span className="text-red-500">*</span></label><input type="text" id="endereco.rua" name="endereco.rua" value={checkoutData.endereco.rua} onChange={handleCheckoutInputChange} className="form-input" required /></div>
                      <div><label htmlFor="endereco.cidade" className="block text-sm font-medium text-gray-700 mb-1">Cidade <span className="text-red-500">*</span></label><input type="text" id="endereco.cidade" name="endereco.cidade" value={checkoutData.endereco.cidade} onChange={handleCheckoutInputChange} className="form-input" required /></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><label htmlFor="endereco.estado" className="block text-sm font-medium text-gray-700 mb-1">Estado <span className="text-red-500">*</span></label><select id="endereco.estado" name="endereco.estado" value={checkoutData.endereco.estado} onChange={handleCheckoutInputChange} className="form-select bg-white" required><option value="">Selecione...</option>{['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(uf => (<option key={uf} value={uf}>{uf}</option>))}</select></div>
                        <div><label htmlFor="endereco.cep" className="block text-sm font-medium text-gray-700 mb-1">CEP <span className="text-red-500">*</span></label><input type="text" id="endereco.cep" name="endereco.cep" value={checkoutData.endereco.cep} onChange={handleCheckoutInputChange} placeholder="00000-000" className="form-input" required /></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
                  <button type="button" onClick={() => { setShowCheckout(false); setShowCart(true);}} className="btn-secondary w-full sm:w-auto">Voltar ao Carrinho</button>
                  <button type="submit" className="btn-primary w-full sm:w-auto" disabled={cart.length === 0}>Confirmar e Pagar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Basic styling for form inputs and buttons if not using Tailwind's @forms plugin */}
      <style jsx global>{`
        .form-input {
          display: block;
          width: 100%;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
          border: 1px solid #D1D5DB; /* gray-300 */
          border-radius: 0.375rem; /* rounded-md */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
        }
        .form-input:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          border-color: #EF4444; /* red-500 */
          box-shadow: 0 0 0 0.125em #FEE2E2; /* ring-red-500 with opacity */
        }
        .form-select {
          display: block;
          width: 100%;
          padding: 0.5rem 2.5rem 0.5rem 0.75rem;
          font-size: 0.875rem;
          line-height: 1.25rem;
          border: 1px solid #D1D5DB;
          border-radius: 0.375rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          appearance: none;
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
        }
        .form-select:focus {
          outline: 2px solid transparent;
          outline-offset: 2px;
          border-color: #EF4444;
          box-shadow: 0 0 0 0.125em #FEE2E2;
        }
        .btn-primary {
          padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500; color: white;
          background-color: #DC2626; /* red-600 */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .btn-primary:hover { background-color: #B91C1C; /* red-700 */ }
        .btn-primary:focus { outline: 2px solid transparent; outline-offset: 2px; box-shadow: 0 0 0 0.125em #FEE2E2, 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-secondary {
          padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500; color: #374151; /* gray-700 */
          background-color: white; border: 1px solid #D1D5DB; /* gray-300 */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .btn-secondary:hover { background-color: #F9FAFB; /* gray-50 */ }
        .btn-secondary:focus { outline: 2px solid transparent; outline-offset: 2px; box-shadow: 0 0 0 0.125em #FEE2E2, 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
      `}</style>
    </div>
  );
};

export default MarketplacePage;