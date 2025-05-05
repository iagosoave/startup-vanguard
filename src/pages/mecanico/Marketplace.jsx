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

  useEffect(() => {
    // Carregar usuário atual
    const userInfo = sessionStorage.getItem('autofacil_currentUser');
    if (userInfo) {
      setCurrentUser(JSON.parse(userInfo));
      
      // Pré-preencher endereço (em um caso real, viria do banco de dados)
      setCheckoutData(prev => ({
        ...prev,
        endereco: {
          rua: 'Rua das Flores, 123',
          cidade: 'Sorocaba',
          estado: 'SP',
          cep: '18040-050'
        }
      }));
    }
    
    // Carregar produtos cadastrados
    loadProducts();
    
    // Carregar carrinho do localStorage se existir
    const savedCart = localStorage.getItem('autofacil_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);
  
  useEffect(() => {
    // Filtrar produtos com base na pesquisa e categoria
    let filtered = [...products];
    
    // Filtrar por termo de pesquisa
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtrar por categoria
    if (categoryFilter !== 'todos') {
      filtered = filtered.filter(product => product.categoria === categoryFilter);
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, products]);
  
  const loadProducts = () => {
    // Carregar produtos do localStorage
    const savedProducts = JSON.parse(localStorage.getItem('autofacil_products') || '[]');
    setProducts(savedProducts);
  };
  
  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingProductIndex >= 0) {
      // Produto já existe no carrinho, incrementar quantidade
      const updatedCart = [...cart];
      updatedCart[existingProductIndex].quantidade += 1;
      setCart(updatedCart);
      localStorage.setItem('autofacil_cart', JSON.stringify(updatedCart));
    } else {
      // Adicionar novo produto ao carrinho
      const updatedCart = [...cart, { ...product, quantidade: 1 }];
      setCart(updatedCart);
      localStorage.setItem('autofacil_cart', JSON.stringify(updatedCart));
    }
  };
  
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('autofacil_cart', JSON.stringify(updatedCart));
  };
  
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        return { ...item, quantidade: newQuantity };
      }
      return item;
    });
    
    setCart(updatedCart);
    localStorage.setItem('autofacil_cart', JSON.stringify(updatedCart));
  };
  
  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('autofacil_cart');
  };
  
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.preco * item.quantidade), 0);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested address fields
    if (name.startsWith('endereco.')) {
      const addressField = name.split('.')[1];
      setCheckoutData(prev => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          [addressField]: value
        }
      }));
    } else {
      setCheckoutData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleCheckout = (e) => {
    e.preventDefault();
    
    if (!cart.length) {
      alert('Seu carrinho está vazio!');
      return;
    }
    
    // Validação básica de campos
    const { endereco, formaPagamento } = checkoutData;
    if (!endereco.rua || !endereco.cidade || !endereco.estado || !endereco.cep || !formaPagamento) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // Criar novo pedido
    const newOrder = {
      id: Date.now().toString(),
      compradorId: currentUser?.id || 'default_user',
      compradorNome: currentUser?.nomeEmpresa || 'Usuário Padrão',
      vendedorId: 'example_user', // Em uma aplicação real, seria o ID do vendedor
      data: new Date().toISOString(),
      valorTotal: calculateTotal(),
      status: 'pendente',
      formaPagamento: checkoutData.formaPagamento,
      itens: cart.map(item => ({
        produtoId: item.id,
        nome: item.nome,
        quantidade: item.quantidade,
        precoUnitario: item.preco
      })),
      endereco: checkoutData.endereco,
      rastreamento: null,
      entregaEstimada: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 dias a partir de hoje
      entregaRealizada: null
    };
    
    // Carregar pedidos existentes
    const existingOrders = JSON.parse(localStorage.getItem('autofacil_orders') || '[]');
    
    // Adicionar novo pedido
    const updatedOrders = [...existingOrders, newOrder];
    
    // Salvar no localStorage
    localStorage.setItem('autofacil_orders', JSON.stringify(updatedOrders));
    
    // Limpar carrinho
    clearCart();
    
    // Fechar modal de checkout
    setShowCheckout(false);
    
    // Mostrar confirmação
    alert('Pedido realizado com sucesso! Número do pedido: #' + newOrder.id);
  };
  
  const getCategoryLabel = (category) => {
    const categories = {
      'motor': 'Motor',
      'freios': 'Freios',
      'suspensao': 'Suspensão',
      'eletrica': 'Elétrica',
      'filtros': 'Filtros',
      'oleos': 'Óleos e Fluídos',
      'carroceria': 'Carroceria',
      'acessorios': 'Acessórios'
    };
    
    return categories[category] || category;
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        
        {/* Botão do carrinho */}
        <button
          onClick={() => setShowCart(true)}
          className="relative bg-white border border-gray-300 p-2 rounded-full hover:bg-gray-100 focus:outline-none"
        >
          <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </button>
      </div>
      
      {/* Filtros e pesquisa */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between mb-4 space-y-4 md:space-y-0">
          {/* Barra de pesquisa */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Filtro de categorias */}
          <div className="flex flex-wrap space-x-2">
            <button
              onClick={() => setCategoryFilter('todos')}
              className={`px-3 py-1 text-sm rounded-full ${
                categoryFilter === 'todos'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setCategoryFilter('motor')}
              className={`px-3 py-1 text-sm rounded-full ${
                categoryFilter === 'motor'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              Motor
            </button>
            <button
              onClick={() => setCategoryFilter('freios')}
              className={`px-3 py-1 text-sm rounded-full ${
                categoryFilter === 'freios'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              Freios
            </button>
            <button
              onClick={() => setCategoryFilter('suspensao')}
              className={`px-3 py-1 text-sm rounded-full ${
                categoryFilter === 'suspensao'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              Suspensão
            </button>
            <button
              onClick={() => setCategoryFilter('filtros')}
              className={`px-3 py-1 text-sm rounded-full ${
                categoryFilter === 'filtros'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              Filtros
            </button>
            <button
              onClick={() => setCategoryFilter('oleos')}
              className={`px-3 py-1 text-sm rounded-full ${
                categoryFilter === 'oleos'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              Óleos
            </button>
          </div>
        </div>
      </div>
      
      {/* Grid de produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              <div className="h-48 bg-gray-200 relative">
                <img
                  src={product.imagemUrl}
                  alt={product.nome}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                    {getCategoryLabel(product.categoria)}
                  </span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-medium text-gray-900 mb-1">{product.nome}</h3>
                <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-2">{product.descricao}</p>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-gray-900">
                    R$ {product.preco.toFixed(2)}
                  </p>
                  <button
                    onClick={() => addToCart(product)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            Nenhum produto encontrado. Tente ajustar seus filtros de pesquisa.
          </div>
        )}
      </div>
      
      {/* Modal do carrinho */}
      {showCart && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Seu Carrinho
              </h3>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length > 0 ? (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex border-b pb-4">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={item.imagemUrl}
                          alt={item.nome}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>

                      <div className="ml-4 flex flex-1 flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.nome}</h3>
                            <p className="ml-4">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 line-clamp-1">{item.descricao}</p>
                        </div>
                        <div className="flex flex-1 items-end justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <p className="text-gray-500">Qtd:</p>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantidade - 1)}
                              className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 h-6 w-6 rounded-full flex items-center justify-center"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="text-gray-900 font-medium">{item.quantidade}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantidade + 1)}
                              className="text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 h-6 w-6 rounded-full flex items-center justify-center"
                            >
                              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="font-medium text-red-600 hover:text-red-500"
                          >
                            Remover
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Seu carrinho está vazio.
                </div>
              )}
            </div>
            
            {cart.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-4">
                <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                  <p>Subtotal</p>
                  <p>R$ {calculateTotal().toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={clearCart}
                    className="text-sm font-medium text-red-600 hover:text-red-500"
                  >
                    Limpar carrinho
                  </button>
                  <button
                    onClick={() => {
                      setShowCart(false);
                      setShowCheckout(true);
                    }}
                    className="flex items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-red-700"
                  >
                    Finalizar Compra
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Modal de checkout */}
      {showCheckout && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                Finalizar Compra
              </h3>
              <button
                onClick={() => setShowCheckout(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleCheckout}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Resumo do pedido */}
                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-4">Resumo do Pedido</h4>
                    {cart.length > 0 ? (
                      <div className="space-y-2 mb-6">
                        {cart.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.nome} x {item.quantidade}</span>
                            <span className="font-medium">R$ {(item.preco * item.quantidade).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="border-t pt-2 flex justify-between font-medium">
                          <span>Total:</span>
                          <span>R$ {calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mb-4">Seu carrinho está vazio.</p>
                    )}
                    
                    {/* Forma de pagamento */}
                    <h4 className="text-base font-medium text-gray-900 mb-2">Forma de Pagamento</h4>
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center">
                        <input
                          id="cartao"
                          name="formaPagamento"
                          type="radio"
                          value="cartao"
                          checked={checkoutData.formaPagamento === 'cartao'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <label htmlFor="cartao" className="ml-3 block text-sm font-medium text-gray-700">
                          Cartão de Crédito
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="boleto"
                          name="formaPagamento"
                          type="radio"
                          value="boleto"
                          checked={checkoutData.formaPagamento === 'boleto'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <label htmlFor="boleto" className="ml-3 block text-sm font-medium text-gray-700">
                          Boleto Bancário
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          id="pix"
                          name="formaPagamento"
                          type="radio"
                          value="pix"
                          checked={checkoutData.formaPagamento === 'pix'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                        />
                        <label htmlFor="pix" className="ml-3 block text-sm font-medium text-gray-700">
                          PIX
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Endereço de entrega */}
                  <div>
                    <h4 className="text-base font-medium text-gray-900 mb-4">Endereço de Entrega</h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="endereco.rua" className="block text-sm font-medium text-gray-700 mb-1">
                          Rua / Número
                        </label>
                        <input
                          type="text"
                          id="endereco.rua"
                          name="endereco.rua"
                          value={checkoutData.endereco.rua}
                          onChange={handleInputChange}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="endereco.cidade" className="block text-sm font-medium text-gray-700 mb-1">
                          Cidade
                        </label>
                        <input
                          type="text"
                          id="endereco.cidade"
                          name="endereco.cidade"
                          value={checkoutData.endereco.cidade}
                          onChange={handleInputChange}
                          className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="endereco.estado" className="block text-sm font-medium text-gray-700 mb-1">
                            Estado
                          </label>
                          <select
                            id="endereco.estado"
                            name="endereco.estado"
                            value={checkoutData.endereco.estado}
                            onChange={handleInputChange}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            required
                          >
                            <option value="">Selecione</option>
                            <option value="AC">Acre</option>
                            <option value="AL">Alagoas</option>
                            <option value="AP">Amapá</option>
                            <option value="AM">Amazonas</option>
                            <option value="BA">Bahia</option>
                            <option value="CE">Ceará</option>
                            <option value="DF">Distrito Federal</option>
                            <option value="ES">Espírito Santo</option>
                            <option value="GO">Goiás</option>
                            <option value="MA">Maranhão</option>
                            <option value="MT">Mato Grosso</option>
                            <option value="MS">Mato Grosso do Sul</option>
                            <option value="MG">Minas Gerais</option>
                            <option value="PA">Pará</option>
                            <option value="PB">Paraíba</option>
                            <option value="PR">Paraná</option>
                            <option value="PE">Pernambuco</option>
                            <option value="PI">Piauí</option>
                            <option value="RJ">Rio de Janeiro</option>
                            <option value="RN">Rio Grande do Norte</option>
                            <option value="RS">Rio Grande do Sul</option>
                            <option value="RO">Rondônia</option>
                            <option value="RR">Roraima</option>
                            <option value="SC">Santa Catarina</option>
                            <option value="SP">São Paulo</option>
                            <option value="SE">Sergipe</option>
                            <option value="TO">Tocantins</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="endereco.cep" className="block text-sm font-medium text-gray-700 mb-1">
                            CEP
                          </label>
                          <input
                            type="text"
                            id="endereco.cep"
                            name="endereco.cep"
                            value={checkoutData.endereco.cep}
                            onChange={handleInputChange}
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCheckout(false);
                      setShowCart(true);
                    }}
                    className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Voltar ao Carrinho
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Finalizar Compra
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;