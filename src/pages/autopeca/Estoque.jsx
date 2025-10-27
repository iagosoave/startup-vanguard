import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Loader2, AlertCircle, X } from 'lucide-react';

// ===================================================
// LÓGICA DE API DO BACKEND (COMENTADO)
// ===================================================
// const fetchEstoque = async () => { /* ... */ };
// const adicionarProdutoAPI = async (produto) => { /* ... */ };
// const editarProdutoAPI = async (id, produtoAtualizado) => { /* ... */ };
// const deletarProdutoAPI = async (id) => { /* ... */ };
// ===================================================

const EstoquePage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null); 
  const [formValues, setFormValues] = useState({ nome: '', preco: '', quantidade: '', categoria: '' });
  const [formErrors, setFormErrors] = useState({}); 
  const [isSubmitting, setIsSubmitting] = useState(false); 

  // Busca inicial dos dados
  useEffect(() => {
    const carregarEstoque = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // const estoqueData = await fetchEstoque(); // CHAMADA API REAL
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simula delay API
        const estoqueData = []; // Começa vazio
        setProducts(estoqueData);
        setFilteredProducts(estoqueData);
      } catch (err) {
        setError(err.message || 'Falha ao carregar estoque.');
      } finally {
        setIsLoading(false);
      }
    };
    carregarEstoque();
  }, []);

  // Filtra produtos
  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const result = products.filter(product =>
      product.nome.toLowerCase().includes(lowerSearchTerm) ||
      product.categoria?.toLowerCase().includes(lowerSearchTerm) ||
      product.id?.toString().includes(lowerSearchTerm)
    );
    setFilteredProducts(result);
  }, [searchTerm, products]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if ((name === 'preco' || name === 'quantidade') && value && !/^\d*[,.]?\d*$/.test(value)) {
        return; 
    }
    setFormValues(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formValues.nome.trim()) errors.nome = 'Nome é obrigatório';
    if (!formValues.preco) errors.preco = 'Preço é obrigatório';
    else if (isNaN(parseFloat(formValues.preco.replace(',', '.'))) || parseFloat(formValues.preco.replace(',', '.')) <= 0) errors.preco = 'Preço inválido';
    if (!formValues.quantidade) errors.quantidade = 'Quantidade é obrigatória';
    else if (!/^\d+$/.test(formValues.quantidade) || parseInt(formValues.quantidade, 10) < 0) errors.quantidade = 'Quantidade inválida';
    return errors;
  };

  // Funções para abrir/fechar modal (sem alterações na lógica)
  const openModalForAdd = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    setFormValues({ nome: '', preco: '', quantidade: '', categoria: '' });
    setFormErrors({});
    setError(null); // Limpa erros específicos do modal
    setIsModalOpen(true);
  };

  const openModalForEdit = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setFormValues({
      nome: product.nome,
      preco: product.preco.toString().replace('.', ','),
      quantidade: product.quantidade.toString(),
      categoria: product.categoria || '',
    });
    setFormErrors({});
    setError(null); // Limpa erros específicos do modal
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return; 
    setIsModalOpen(false);
    // Não precisa resetar aqui, openModal já faz isso.
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
    const produtoParaSalvar = {
      nome: formValues.nome.trim(),
      preco: parseFloat(formValues.preco.replace(',', '.')),
      quantidade: parseInt(formValues.quantidade, 10),
      categoria: formValues.categoria.trim() || null,
    };
    try {
      if (isEditing && currentProduct) {
        // const produtoAtualizado = await editarProdutoAPI(currentProduct.id, produtoParaSalvar);
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        const produtoAtualizado = { ...produtoParaSalvar, id: currentProduct.id }; 
        setProducts(prev => prev.map(p => p.id === currentProduct.id ? produtoAtualizado : p));
      } else {
        // const novoProduto = await adicionarProdutoAPI(produtoParaSalvar);
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        const novoProduto = { ...produtoParaSalvar, id: Date.now() }; 
        setProducts(prev => [novoProduto, ...prev]); 
      }
      closeModal();
    } catch (err) {
      setError(err.message || `Erro ao ${isEditing ? 'editar' : 'adicionar'} produto.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
    setError(null);
    try {
      // await deletarProdutoAPI(id); 
      await new Promise(resolve => setTimeout(resolve, 500)); 
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message || 'Erro ao deletar produto.');
      alert(`Erro ao deletar: ${err.message || 'Erro desconhecido'}`);
    } 
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Gerenciamento de Estoque</h2>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-auto flex-grow sm:max-w-xs">
          <input
            type="text"
            placeholder="Buscar por nome, categoria ou ID..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.nome}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">R$ {product.preco?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.quantidade}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.categoria || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-3">
                      <button onClick={() => openModalForEdit(product)} className="text-blue-600 hover:text-blue-800 transition-colors" title="Editar"><Edit className="h-5 w-5 inline" /></button>
                      <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-800 transition-colors" title="Excluir"><Trash2 className="h-5 w-5 inline" /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    {searchTerm ? 'Nenhum produto encontrado.' : 'Nenhum produto cadastrado.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal (JSX inalterado, apenas remoção da animação CSS) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300 ease-out opacity-100"> {/* Animação removida daqui */}
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out scale-100 opacity-100"> {/* Animação removida daqui */}
             {/* Header */}
            <div className="px-6 py-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">{isEditing ? 'Editar Produto' : 'Adicionar Novo Produto'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 disabled:opacity-50" disabled={isSubmitting}><X size={20} /></button>
            </div>
            {/* Form */}
            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {error && ( <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center text-sm"><AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />{error}</div> )}
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome <span className="text-red-500">*</span></label>
                <input type="text" id="nome" name="nome" value={formValues.nome} onChange={handleInputChange} required className={`w-full px-3 py-2 border ${formErrors.nome ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500`} />
                {formErrors.nome && <p className="text-red-500 text-xs mt-1">{formErrors.nome}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="preco" className="block text-sm font-medium text-gray-700 mb-1">Preço (R$) <span className="text-red-500">*</span></label>
                  <input type="text" id="preco" name="preco" value={formValues.preco} onChange={handleInputChange} required inputMode="decimal" placeholder="Ex: 25,99" className={`w-full px-3 py-2 border ${formErrors.preco ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500`} />
                  {formErrors.preco && <p className="text-red-500 text-xs mt-1">{formErrors.preco}</p>}
                </div>
                <div>
                  <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700 mb-1">Quantidade <span className="text-red-500">*</span></label>
                  <input type="number" id="quantidade" name="quantidade" value={formValues.quantidade} onChange={handleInputChange} required min="0" step="1" inputMode="numeric" className={`w-full px-3 py-2 border ${formErrors.quantidade ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500`} />
                  {formErrors.quantidade && <p className="text-red-500 text-xs mt-1">{formErrors.quantidade}</p>}
                </div>
              </div>
              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-gray-700 mb-1">Categoria (Opcional)</label>
                <input type="text" id="categoria" name="categoria" value={formValues.categoria} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500" />
              </div>
            </form>
            {/* Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
              <button type="button" onClick={closeModal} disabled={isSubmitting} className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50">Cancelar</button>
              <button type="submit" onClick={handleFormSubmit} disabled={isSubmitting} className="px-4 py-2 bg-red-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 flex items-center">
                {isSubmitting && <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />}
                {isSubmitting ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Adicionar Produto')}
              </button>
            </div>
          </div>
          {/* REMOVIDO o <style jsx> */}
        </div>
      )}
    </div>
  );
};

export default EstoquePage;