import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Loader2, AlertCircle, X, Upload, FileText, Image as ImageIcon } from 'lucide-react';
import { produtoAPI, handleApiError } from '../../services/api';

const EstoquePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); 
  const [formValues, setFormValues] = useState({ 
    nome: '', 
    descricao: '', 
    preco: '', 
    quantidadeEstoque: '', 
    idCategoria: '',
    foto: null,
    documento: null
  });
  const [formErrors, setFormErrors] = useState({}); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewFoto, setPreviewFoto] = useState(null);

  useEffect(() => {
    carregarEstoque();
  }, []);

  const carregarEstoque = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const userInfo = sessionStorage.getItem('autofacil_currentUser');
      const currentUser = userInfo ? JSON.parse(userInfo) : null;
      
      if (!currentUser || !currentUser.id) {
        setError('Usuário não identificado. Faça login novamente.');
        setIsLoading(false);
        return;
      }

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(' [ESTOQUE] Carregando produtos...');
      console.log(' [ESTOQUE] ID do lojista logado:', currentUser.id);
      
      const estoqueData = await produtoAPI.findAll();
      console.log(' [ESTOQUE] Total de produtos retornados:', estoqueData.length);
      
      if (estoqueData.length > 0) {
        console.log(' [ESTOQUE] Primeiro produto:', estoqueData[0]);
        console.log(' [ESTOQUE] Chaves disponíveis:', Object.keys(estoqueData[0]));
      }
      
      
      console.log(' [ESTOQUE] Mostrando TODOS os produtos (backend deveria filtrar)');
      setProducts(estoqueData);
      setFilteredProducts(estoqueData);
      console.log('[ESTOQUE] Produtos carregados com sucesso');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
    } catch (err) {
      console.error(' [ESTOQUE] Erro ao carregar:', err);
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const result = products.filter(product =>
      product.nome.toLowerCase().includes(lowerSearchTerm) ||
      product.descricao?.toLowerCase().includes(lowerSearchTerm) ||
      product.id?.toString().includes(lowerSearchTerm)
    );
    setFilteredProducts(result);
  }, [searchTerm, products]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'preco' || name === 'quantidadeEstoque') && value && !/^\d*[,.]?\d*$/.test(value)) {
        return; 
    }
    setFormValues(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      console.log(` [ESTOQUE] Arquivo selecionado (${name}):`, file.name, file.type, file.size, 'bytes');
      
      setFormValues(prev => ({ ...prev, [name]: file }));
      
      if (name === 'foto') {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            console.log('[ESTOQUE] Preview gerado com sucesso');
            setPreviewFoto(reader.result);
          };
          reader.onerror = () => {
            console.error('[ESTOQUE] Erro ao gerar preview');
          };
          reader.readAsDataURL(file);
        } else {
          console.warn('[ESTOQUE] Arquivo não é uma imagem:', file.type);
          setPreviewFoto(null);
        }
      }
      
      if (formErrors[name]) {
        setFormErrors(prev => ({ ...prev, [name]: null }));
      }
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.nome.trim()) errors.nome = 'Nome é obrigatório';
    if (!formValues.preco) errors.preco = 'Preço é obrigatório';
    else if (isNaN(parseFloat(formValues.preco.replace(',', '.'))) || parseFloat(formValues.preco.replace(',', '.')) <= 0) errors.preco = 'Preço inválido';
    if (!formValues.quantidadeEstoque) errors.quantidadeEstoque = 'Quantidade é obrigatória';
    else if (!/^\d+$/.test(formValues.quantidadeEstoque) || parseInt(formValues.quantidadeEstoque, 10) < 0) errors.quantidadeEstoque = 'Quantidade inválida';
    
    if (!isEditing) {
      if (!formValues.foto) errors.foto = 'Foto do produto é obrigatória';
      if (!formValues.documento) errors.documento = 'Documento é obrigatório';
    }
    
    return errors;
  };

  const openModalForAdd = () => {
    const userInfo = sessionStorage.getItem('autofacil_currentUser');
    const currentUser = userInfo ? JSON.parse(userInfo) : null;
    
    setIsEditing(false);
    setCurrentProduct(null);
    setFormValues({ 
      nome: '', 
      descricao: '', 
      preco: '', 
      quantidadeEstoque: '', 
      idCategoria: '1',
      idLojista: currentUser?.id || '',
      foto: null,
      documento: null
    });
    setFormErrors({});
    setError(null);
    setPreviewFoto(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setFormValues({
      nome: product.nome,
      descricao: product.descricao || '',
      preco: product.preco.toString().replace('.', ','),
      quantidadeEstoque: product.quantidadeEstoque.toString(),
      idCategoria: product.idCategoria || '1',
      foto: null,
      documento: null
    });
    setFormErrors({});
    setError(null);
    setPreviewFoto(product.urlFoto || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return; 
    setIsModalOpen(false);
    setPreviewFoto(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }
    setIsSubmitting(true);
    setError(null); 
    
    try {
      if (isEditing && currentProduct) {
        const produtoParaAtualizar = {
          id: currentProduct.id,
          nome: formValues.nome.trim(),
          descricao: formValues.descricao.trim() || null,
          price: parseFloat(formValues.preco.replace(',', '.')),
          quantidadeEstoque: parseInt(formValues.quantidadeEstoque, 10),
          id_categoria: parseInt(formValues.idCategoria) || null
        };
        
        console.log('[ESTOQUE] Atualizando produto:', produtoParaAtualizar);
        const produtoAtualizado = await produtoAPI.update(produtoParaAtualizar);
        console.log('[ESTOQUE] Produto atualizado:', produtoAtualizado);
        
        setProducts(prev => prev.map(p => p.id === currentProduct.id ? produtoAtualizado : p));
      } else {
        const userInfo = sessionStorage.getItem('autofacil_currentUser');
        const currentUser = userInfo ? JSON.parse(userInfo) : null;
        
        const produtoParaCriar = {
          idLojista: currentUser?.id || 0,
          idCategoria: parseInt(formValues.idCategoria) || 1,
          nome: formValues.nome.trim(),
          descricao: formValues.descricao.trim() || '',
          preco: parseFloat(formValues.preco.replace(',', '.')),
          quantidadeEstoque: parseInt(formValues.quantidadeEstoque, 10)
        };
        
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(' [ESTOQUE] Criando produto...');
        console.log(' [ESTOQUE] Dados do produto:', produtoParaCriar);
        console.log(' [ESTOQUE] Foto:', formValues.foto?.name, formValues.foto?.type);
        console.log(' [ESTOQUE] Documento:', formValues.documento?.name, formValues.documento?.type);
        
        const novoProduto = await produtoAPI.create(
          produtoParaCriar, 
          formValues.foto, 
          formValues.documento
        );
        
        console.log(' [ESTOQUE] Produto criado com sucesso:', novoProduto);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        
        setProducts(prev => [novoProduto, ...prev]);
        
       
        await carregarEstoque();
      }
      closeModal();
    } catch (err) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error(' [ESTOQUE] Erro ao salvar produto');
      console.error(' [ESTOQUE] Detalhes:', err);
      console.error(' [ESTOQUE] Response:', err.response?.data);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
    setError(null);
    try {
      console.log(' [ESTOQUE] Deletando produto ID:', id);
      await produtoAPI.delete(id);
      console.log(' [ESTOQUE] Produto deletado com sucesso');
      
      setProducts(prev => prev.filter(p => p.id !== id));
      
      await carregarEstoque();
    } catch (err) {
      console.error('[ESTOQUE] Erro ao deletar:', err);
      const errorInfo = handleApiError(err);
      setError(errorInfo.message);
      alert(`Erro ao deletar: ${errorInfo.message}`);
    } 
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Gerenciamento de Estoque</h2>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-auto flex-grow sm:max-w-xs">
          <input
            type="text"
            placeholder="Buscar por nome ou ID..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={openModalForAdd}
          className="w-full sm:w-auto flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Adicionar Produto
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          <span className="ml-3 text-gray-600">Carregando estoque...</span>
        </div>
      )}
      
      {!isLoading && error && !isModalOpen && ( 
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-3" />
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Foto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.urlFoto ? (
                        <img src={product.urlFoto} alt={product.nome} className="h-12 w-12 object-cover rounded-md border" />
                      ) : (
                        <div className="h-12 w-12 bg-gray-200 rounded-md flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.nome}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">{product.descricao || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">R$ {product.preco?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.quantidadeEstoque}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-3">
                      <button onClick={() => openModalForEdit(product)} className="text-blue-600 hover:text-blue-800 transition-colors" title="Editar"><Edit className="h-5 w-5 inline" /></button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 transition-colors" title="Excluir"><Trash2 className="h-5 w-5 inline" /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                    {searchTerm ? 'Nenhum produto encontrado.' : 'Nenhum produto cadastrado. Clique em "Adicionar Produto" para começar.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-out opacity-100">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out scale-100 opacity-100">
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">{isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 disabled:opacity-50" disabled={isSubmitting}><X size={20} /></button>
            </div>
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {error && ( <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center text-sm"><AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />{error}</div> )}
              
              
              {!isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto do Produto <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-start gap-4">
                    {previewFoto && (
                      <div className="flex-shrink-0">
                        <img 
                          src={previewFoto} 
                          alt="Preview" 
                          className="h-24 w-24 object-cover rounded-md border-2 border-gray-300" 
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <label className="cursor-pointer flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50 hover:border-red-400 transition-colors">
                        <Upload className="h-5 w-5 text-gray-600" />
                        <span className="text-sm text-gray-700">
                          {formValues.foto ? formValues.foto.name : 'Clique para escolher uma foto'}
                        </span>
                        <input 
                          type="file" 
                          id="foto" 
                          name="foto" 
                          accept="image/*" 
                          onChange={handleFileChange} 
                          className="hidden" 
                        />
                      </label>
                      {formErrors.foto && <p className="text-red-500 text-xs mt-1">{formErrors.foto}</p>}
                    </div>
                  </div>
                </div>
              )}

              {!isEditing && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Documento (PDF, DOC, etc.) <span className="text-red-500">*</span>
                  </label>
                  <label className="cursor-pointer flex items-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50 hover:border-red-400 transition-colors">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {formValues.documento ? formValues.documento.name : 'Clique para escolher um documento'}
                    </span>
                    <input 
                      type="file" 
                      id="documento" 
                      name="documento" 
                      accept=".pdf,.doc,.docx" 
                      onChange={handleFileChange} 
                      className="hidden" 
                    />
                  </label>
                  {formErrors.documento && <p className="text-red-500 text-xs mt-1">{formErrors.documento}</p>}
                </div>
              )}
              
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome <span className="text-red-500">*</span></label>
                <input type="text" id="nome" name="nome" value={formValues.nome} onChange={handleInputChange} required className={`w-full px-3 py-2 border ${formErrors.nome ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500`} placeholder="Ex: Filtro de óleo"/>
                {formErrors.nome && <p className="text-red-500 text-xs mt-1">{formErrors.nome}</p>}
              </div>

              <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea id="descricao" name="descricao" value={formValues.descricao} onChange={handleInputChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500" placeholder="Descreva o produto..."/>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) <span className="text-red-500">*</span></label>
                  <input type="text" id="preco" name="preco" value={formValues.preco} onChange={handleInputChange} required inputMode="decimal" placeholder="Ex: 25,99" className={`w-full px-3 py-2 border ${formErrors.preco ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500`} />
                  {formErrors.preco && <p className="text-red-500 text-xs mt-1">{formErrors.preco}</p>}
                </div>
                <div>
                  <label htmlFor="quantidadeEstoque" className="block text-sm font-medium text-gray-700 mb-1">Quantidade <span className="text-red-500">*</span></label>
                  <input type="number" id="quantidadeEstoque" name="quantidadeEstoque" value={formValues.quantidadeEstoque} onChange={handleInputChange} required min="0" step="1" inputMode="numeric" className={`w-full px-3 py-2 border ${formErrors.quantidadeEstoque ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500`} placeholder="Ex: 10"/>
                  {formErrors.quantidadeEstoque && <p className="text-red-500 text-xs mt-1">{formErrors.quantidadeEstoque}</p>}
                </div>
              </div>
            </form>
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button type="button" onClick={closeModal} disabled={isSubmitting} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50">Cancelar</button>
              <button type="submit" onClick={handleFormSubmit} disabled={isSubmitting} className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center">
                {isSubmitting && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                {isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Adicionar Produto')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EstoquePage;