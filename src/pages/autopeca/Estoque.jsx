import React, { useState, useEffect, useRef } from 'react'; // Added useRef

const EstoquePage = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Ref for the file input
  const imageFileInputRef = useRef(null);

  // Estado para novo produto (ou produto sendo editado)
  const [productData, setProductData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    categoria: 'motor',
    quantidadeEstoque: '',
    imagemUrl: '', // Will store the URL string from input
    imagemPreview: null // For the <img src> in the form
  });

  useEffect(() => {
    const userInfo = sessionStorage.getItem('autofacil_currentUser');
    if (userInfo) {
      setCurrentUser(JSON.parse(userInfo));
    }
    loadProducts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = products.filter(product =>
        product.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.categoria.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchTerm, products]);

  const loadProducts = () => {
    let savedProducts = JSON.parse(localStorage.getItem('autofacil_products') || '[]');
    if (savedProducts.length < 5) {
      const exampleProducts = [
        {
          id: '1',
          vendedorId: currentUser?.id || 'example_user',
          nome: 'Filtro de Óleo Premium',
          descricao: 'Filtro de óleo de alta qualidade compatível com diversos modelos de veículos.',
          preco: 25.90,
          categoria: 'filtros',
          quantidadeEstoque: 150,
          imagemUrl: 'https://m.media-amazon.com/images/I/61zZpX0P+kL._AC_UF1000,1000_QL80_.jpg'
        },
        {
          id: '2',
          vendedorId: currentUser?.id || 'example_user',
          nome: 'Kit de Pastilhas de Freio',
          descricao: 'Kit completo de pastilhas de freio para veículos de passeio. Alta durabilidade.',
          preco: 89.90,
          categoria: 'freios',
          quantidadeEstoque: 75,
          imagemUrl: 'https://d2q38n0ohsv27h.cloudfront.net/Custom/Content/Products/20/15/2015606_kit-pastilha-e-disco-de-freio-dianteiro-ventilado-acdelco-cruze-1-4-turbo-2016-a-2023_z2_638295873640452568.webp'
        },
        {
          id: '3',
          vendedorId: currentUser?.id || 'example_user',
          nome: 'Óleo de Motor Sintético 5W30',
          descricao: 'Óleo sintético de alta performance. Embalagem com 1 litro.',
          preco: 45.00,
          categoria: 'oleos',
          quantidadeEstoque: 200,
          imagemUrl: 'https://via.placeholder.com/100x100.png?text=Oleo+Motor' // Placeholder example
        },
        {
          id: '4',
          vendedorId: currentUser?.id || 'example_user',
          nome: 'Velas de Ignição - Conjunto com 4',
          descricao: 'Conjunto com 4 velas de ignição de platina, compatível com motores flex.',
          preco: 120.50,
          categoria: 'eletrica',
          quantidadeEstoque: 60,
          imagemUrl: 'https://via.placeholder.com/100x100.png?text=Velas' // Placeholder example
        },
        {
          id: '5',
          vendedorId: currentUser?.id || 'example_user',
          nome: 'Amortecedor Dianteiro',
          descricao: 'Amortecedor dianteiro para veículos compactos. Garantia de 1 ano.',
          preco: 249.90,
          categoria: 'suspensao',
          quantidadeEstoque: 30,
          imagemUrl: 'https://via.placeholder.com/100x100.png?text=Amortecedor' // Placeholder example
        }
      ];
      savedProducts = [...savedProducts, ...exampleProducts.filter(ex => !savedProducts.find(sp => sp.id === ex.id))]; // Avoid duplicates
      const uniqueProducts = [];
      const productIds = new Set();
      savedProducts.forEach(product => {
        if (!productIds.has(product.id)) {
          productIds.add(product.id);
          uniqueProducts.push(product);
        }
      });
      localStorage.setItem('autofacil_products', JSON.stringify(uniqueProducts));
      setProducts(uniqueProducts);
    } else {
      setProducts(savedProducts);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'imagemUrl') {
      setProductData(prevData => ({
        ...prevData,
        imagemUrl: value,
        imagemPreview: value // Update preview directly from URL input
      }));
      // Clear file input if URL is typed
      if (imageFileInputRef.current) {
        imageFileInputRef.current.value = '';
      }
    } else {
      setProductData(prevData => ({
        ...prevData,
        [name]: value
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setProductData(prevData => ({
        ...prevData,
        imagemUrl: '', // Clear the text input for URL if a file is chosen
        imagemPreview: objectUrl
      }));
    }
    // No need to reset e.target.value here if using ref to clear it from handleInputChange
    // or if we decide not to auto-clear it. For now, let's keep it simple:
    // if user selects a file, it clears the URL input for preview purposes.
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductData({
      nome: product.nome,
      descricao: product.descricao,
      preco: product.preco.toString(),
      categoria: product.categoria,
      quantidadeEstoque: product.quantidadeEstoque.toString(),
      imagemUrl: product.imagemUrl || '', // Use product's URL for the input
      imagemPreview: product.imagemUrl || null // And for the preview
    });
    setShowModal(true);
  };

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setProductData({
      nome: '',
      descricao: '',
      preco: '',
      categoria: 'motor',
      quantidadeEstoque: '',
      imagemUrl: '',
      imagemPreview: null
    });
    if (imageFileInputRef.current) {
        imageFileInputRef.current.value = ''; // Clear file input when adding new
    }
    setShowModal(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();

    if (!productData.nome || !productData.preco || !productData.quantidadeEstoque) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Determine the final image URL to save
    // Prioritize the URL from the text input.
    // If it's empty (e.g., user uploaded a file, which clears this input, or just didn't provide one),
    // then fall back to the existing product's image URL (if editing) or a placeholder.
    let finalImageUrl = productData.imagemUrl.trim();
    if (!finalImageUrl) {
        if (editingProduct && editingProduct.imagemUrl) {
            finalImageUrl = editingProduct.imagemUrl;
        } else {
            finalImageUrl = 'https://via.placeholder.com/100x100.png?text=Sem+Imagem'; // Default placeholder
        }
    }
    // If the preview is a blob, but the URL input is also filled, the URL input wins.
    // If URL input is empty and preview is a blob, it means file was uploaded and we fallback.

    const productPayload = {
      nome: productData.nome,
      descricao: productData.descricao,
      preco: parseFloat(productData.preco),
      categoria: productData.categoria,
      quantidadeEstoque: parseInt(productData.quantidadeEstoque),
      imagemUrl: finalImageUrl
    };

    let updatedProducts;

    if (editingProduct) {
      updatedProducts = products.map(p =>
        p.id === editingProduct.id
          ? { ...p, ...productPayload }
          : p
      );
    } else {
      const newProduct = {
        id: Date.now().toString(),
        vendedorId: currentUser?.id || 'default_user',
        ...productPayload,
        dataCadastro: new Date().toISOString()
      };
      updatedProducts = [...products, newProduct];
    }

    setProducts(updatedProducts);
    localStorage.setItem('autofacil_products', JSON.stringify(updatedProducts));

    setShowModal(false);
    setEditingProduct(null);
    setProductData({ // Reset form
      nome: '',
      descricao: '',
      preco: '',
      categoria: 'motor',
      quantidadeEstoque: '',
      imagemUrl: '',
      imagemPreview: null
    });
    if (imageFileInputRef.current) {
        imageFileInputRef.current.value = ''; // Clear file input after save
    }
  };

  const handleDeleteProduct = (productId) => {
    const updatedProducts = products.filter(product => product.id !== productId);
    setProducts(updatedProducts);
    localStorage.setItem('autofacil_products', JSON.stringify(updatedProducts));
    setShowDeleteConfirm(null);
  };

  const getCategoryLabel = (category) => {
    const categories = {
      'motor': 'Motor', 'freios': 'Freios', 'suspensao': 'Suspensão',
      'eletrica': 'Elétrica', 'filtros': 'Filtros', 'oleos': 'Óleos e Fluídos',
      'carroceria': 'Carroceria', 'acessorios': 'Acessórios'
    };
    return categories[category] || category;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Estoque</h1>
        <button
          onClick={handleAddNewProduct}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Adicionar Produto
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <li key={product.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 rounded overflow-hidden bg-gray-100">
                        <img 
                            src={product.imagemUrl || 'https://via.placeholder.com/100x100.png?text=Sem+Imagem'} 
                            alt={product.nome} 
                            className="h-12 w-12 object-cover" 
                            onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/100x100.png?text=Erro'; }}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.nome}</div>
                        <div className="text-sm text-gray-500 max-w-md truncate" title={product.descricao}>{product.descricao}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-6">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">R$ {Number(product.preco).toFixed(2)}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Estoque: <span className={`font-medium ${product.quantidadeEstoque < 30 ? 'text-red-600' : 'text-green-600'}`}>
                          {product.quantidadeEstoque}
                        </span>
                      </div>
                      <div>
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {getCategoryLabel(product.categoria)}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-gray-500 hover:text-gray-700"
                          title="Editar produto"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(product)}
                          className="text-red-500 hover:text-red-700"
                          title="Excluir produto"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center text-gray-500">
              Nenhum produto encontrado. Adicione um novo produto ou ajuste sua pesquisa.
            </li>
          )}
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    {editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}
                  </h3>
                  <form onSubmit={handleSaveProduct}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome do Produto *</label>
                        <input type="text" name="nome" id="nome" required value={productData.nome} onChange={handleInputChange} className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea name="descricao" id="descricao" rows="3" value={productData.descricao} onChange={handleInputChange} className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"></textarea>
                      </div>
                      <div>
                        <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) *</label>
                        <input type="number" name="preco" id="preco" required min="0" step="0.01" value={productData.preco} onChange={handleInputChange} className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                      </div>
                      <div>
                        <label htmlFor="quantidadeEstoque" className="block text-sm font-medium text-gray-700 mb-1">Quantidade em Estoque *</label>
                        <input type="number" name="quantidadeEstoque" id="quantidadeEstoque" required min="0" value={productData.quantidadeEstoque} onChange={handleInputChange} className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border" />
                      </div>
                      <div>
                        <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                        <select name="categoria" id="categoria" value={productData.categoria} onChange={handleInputChange} className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border">
                          <option value="motor">Motor</option> <option value="freios">Freios</option> <option value="suspensao">Suspensão</option>
                          <option value="eletrica">Elétrica</option> <option value="filtros">Filtros</option> <option value="oleos">Óleos e Fluídos</option>
                          <option value="carroceria">Carroceria</option> <option value="acessorios">Acessórios</option>
                        </select>
                      </div>
                      
                      <div className="col-span-2">
                        <label htmlFor="imagemUrlInput" className="block text-sm font-medium text-gray-700 mb-1">
                          URL da Imagem do Produto
                        </label>
                        <input
                          type="url"
                          name="imagemUrl"
                          id="imagemUrlInput"
                          placeholder="https://exemplo.com/imagem.jpg"
                          value={productData.imagemUrl}
                          onChange={handleInputChange}
                          className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border mb-2"
                        />
                      </div>

                      <div className="col-span-2">
                        <label htmlFor="imagemFile" className="block text-sm font-medium text-gray-700 mb-1">
                          Ou Carregar Imagem do Produto
                        </label>
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                            {productData.imagemPreview ? (
                              <img src={productData.imagemPreview} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src='https://via.placeholder.com/100x100.png?text=Invalida'; }} />
                            ) : (
                              <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <input
                              type="file"
                              name="imagemFile" // Different name to avoid conflict if needed
                              id="imagemFile"
                              ref={imageFileInputRef} // Assign ref
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                            />
                            <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF. (Pré-visualização apenas)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                      <button type="submit" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm">
                        {editingProduct ? 'Salvar Alterações' : 'Adicionar Produto'}
                      </button>
                      <button type="button" onClick={() => { setShowModal(false); setEditingProduct(null); if (imageFileInputRef.current) imageFileInputRef.current.value = ''; }} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.262 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Confirmar Exclusão</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Tem certeza que deseja excluir o produto "{showDeleteConfirm.nome}"? Esta ação não pode ser desfeita.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="button" onClick={() => handleDeleteProduct(showDeleteConfirm.id)} className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                Excluir
              </button>
              <button type="button" onClick={() => setShowDeleteConfirm(null)} className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstoquePage;