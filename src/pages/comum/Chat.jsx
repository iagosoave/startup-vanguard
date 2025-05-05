import React, { useState, useEffect, useRef } from 'react';

const ChatPage = ({ userType }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    // Carregar usuário atual
    const userInfo = sessionStorage.getItem('autofacil_currentUser');
    if (userInfo) {
      setCurrentUser(JSON.parse(userInfo));
    }
    
    // Carregar conversas do localStorage ou criar exemplos
    loadConversations();
  }, []);
  
  useEffect(() => {
    // Rolar para a última mensagem quando a conversa é selecionada ou quando novas mensagens são adicionadas
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConversation]);
  
  const loadConversations = () => {
    // Tentar carregar conversas do localStorage
    let savedConversations = JSON.parse(localStorage.getItem('autofacil_chats') || '[]');
    
    // Se não houver conversas, criar exemplos
    if (savedConversations.length === 0) {
      const exampleConversations = [
        {
          id: '1',
          participants: [
            { id: 'example_user', nome: 'Auto Peças Silva', tipo: 'autopeca' },
            { id: 'cliente_1', nome: 'Oficina São Pedro', tipo: 'mecanica' }
          ],
          messages: [
            { id: '1', senderId: 'example_user', text: 'Olá! Como posso ajudar?', timestamp: '2025-05-01T10:00:00' },
            { id: '2', senderId: 'cliente_1', text: 'Bom dia! Gostaria de saber se vocês têm em estoque filtro de óleo para Toyota Corolla 2023?', timestamp: '2025-05-01T10:05:00' },
            { id: '3', senderId: 'example_user', text: 'Sim, temos disponível! Posso separar um para você.', timestamp: '2025-05-01T10:07:00' },
            { id: '4', senderId: 'cliente_1', text: 'Ótimo! Vou fazer o pedido pelo marketplace então.', timestamp: '2025-05-01T10:10:00' },
            { id: '5', senderId: 'example_user', text: 'Perfeito! Qualquer dúvida estou à disposição.', timestamp: '2025-05-01T10:12:00' }
          ],
          lastMessageDate: '2025-05-01T10:12:00',
          unreadCount: 0
        },
        {
          id: '2',
          participants: [
            { id: 'example_user', nome: 'Auto Peças Silva', tipo: 'autopeca' },
            { id: 'cliente_2', nome: 'Auto Center Sorocaba', tipo: 'mecanica' }
          ],
          messages: [
            { id: '1', senderId: 'cliente_2', text: 'Boa tarde! Vocês têm disponibilidade para entregar uma encomenda ainda hoje?', timestamp: '2025-05-03T14:30:00' },
            { id: '2', senderId: 'example_user', text: 'Olá! Depende da região. Para onde seria a entrega?', timestamp: '2025-05-03T14:35:00' },
            { id: '3', senderId: 'cliente_2', text: 'Zona norte de Sorocaba', timestamp: '2025-05-03T14:37:00' },
            { id: '4', senderId: 'example_user', text: 'Sim, conseguimos entregar hoje até às 18h!', timestamp: '2025-05-03T14:40:00' }
          ],
          lastMessageDate: '2025-05-03T14:40:00',
          unreadCount: 1
        },
        {
          id: '3',
          participants: [
            { id: 'example_user', nome: 'Auto Peças Silva', tipo: 'autopeca' },
            { id: 'cliente_3', nome: 'Mecânica do João', tipo: 'mecanica' }
          ],
          messages: [
            { id: '1', senderId: 'cliente_3', text: 'Bom dia! Estou com uma dúvida sobre uma peça que comprei.', timestamp: '2025-05-04T09:15:00' },
            { id: '2', senderId: 'example_user', text: 'Bom dia! Claro, pode me dizer qual peça e qual a dúvida?', timestamp: '2025-05-04T09:20:00' }
          ],
          lastMessageDate: '2025-05-04T09:20:00',
          unreadCount: 2
        }
      ];
      
      // Salvar no localStorage
      localStorage.setItem('autofacil_chats', JSON.stringify(exampleConversations));
      
      setConversations(exampleConversations);
    } else {
      setConversations(savedConversations);
    }
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim() || !selectedConversation) return;
    
    // Criar nova mensagem
    const newMessage = {
      id: Date.now().toString(),
      senderId: currentUser?.id || 'example_user',
      text: message.trim(),
      timestamp: new Date().toISOString()
    };
    
    // Adicionar mensagem à conversa selecionada
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessageDate: newMessage.timestamp,
          unreadCount: 0 // Zerar não lidas para o usuário atual
        };
      }
      return conv;
    });
    
    // Atualizar estado e localStorage
    setConversations(updatedConversations);
    localStorage.setItem('autofacil_chats', JSON.stringify(updatedConversations));
    
    // Atualizar conversa selecionada
    setSelectedConversation({
      ...selectedConversation,
      messages: [...selectedConversation.messages, newMessage],
      lastMessageDate: newMessage.timestamp
    });
    
    // Limpar campo de mensagem
    setMessage('');
  };
  
  const formatMessageDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };
  
  const formatConversationDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  };
  
  const getOtherParticipant = (conversation) => {
    return conversation.participants.find(p => p.id !== (currentUser?.id || 'example_user'));
  };
  
  const filteredConversations = conversations.filter(conversation => {
    const otherParticipant = getOtherParticipant(conversation);
    return otherParticipant.nome.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  return (
    <div className="container mx-auto h-[calc(100vh-150px)]">
      <h1 className="text-2xl font-bold mb-4">Mensagens</h1>
      
      <div className="bg-white rounded-lg shadow-md h-full flex overflow-hidden">
        {/* Lista de conversas */}
        <div className="w-1/3 border-r flex flex-col">
          {/* Barra de pesquisa */}
          <div className="p-4 border-b">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                placeholder="Buscar conversas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Lista de conversas */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredConversations.map(conversation => {
                  const otherParticipant = getOtherParticipant(conversation);
                  const lastMessage = conversation.messages[conversation.messages.length - 1];
                  
                  return (
                    <li
                      key={conversation.id}
                      className={`
                        hover:bg-gray-50 cursor-pointer
                        ${selectedConversation?.id === conversation.id ? 'bg-gray-100' : ''}
                        ${conversation.unreadCount > 0 ? 'font-semibold' : ''}
                      `}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="px-4 py-3 flex items-center">
                        <div className="mr-3 bg-gray-300 rounded-full h-10 w-10 flex items-center justify-center text-gray-700 font-semibold">
                          {otherParticipant.nome.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm truncate">{otherParticipant.nome}</p>
                            <p className="text-xs text-gray-500">
                              {formatConversationDate(conversation.lastMessageDate)}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 truncate max-w-[180px]">
                              {lastMessage ? (
                                lastMessage.senderId === (currentUser?.id || 'example_user') ? 
                                `Você: ${lastMessage.text}` : 
                                lastMessage.text
                              ) : 'Nenhuma mensagem'}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-red-600 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Nenhuma conversa encontrada.
              </div>
            )}
          </div>
        </div>
        
        {/* Área de mensagens */}
        <div className="w-2/3 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Cabeçalho da conversa */}
              <div className="p-4 border-b flex items-center">
                <div className="mr-3 bg-gray-300 rounded-full h-10 w-10 flex items-center justify-center text-gray-700 font-semibold">
                  {getOtherParticipant(selectedConversation).nome.charAt(0)}
                </div>
                <div>
                  <h2 className="font-medium">{getOtherParticipant(selectedConversation).nome}</h2>
                  <p className="text-xs text-gray-500">
                    {getOtherParticipant(selectedConversation).tipo === 'mecanica' ? 'Oficina Mecânica' : 'Autopeça'}
                  </p>
                </div>
              </div>
              
              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === (currentUser?.id || 'example_user') ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        msg.senderId === (currentUser?.id || 'example_user')
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${
                        msg.senderId === (currentUser?.id || 'example_user')
                          ? 'text-red-100'
                          : 'text-gray-500'
                      }`}>
                        {formatMessageDate(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Formulário de mensagem */}
              <form onSubmit={handleSendMessage} className="p-4 border-t flex">
                <input
                  type="text"
                  className="flex-1 border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  placeholder="Digite sua mensagem..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-r-md hover:bg-red-700"
                >
                  Enviar
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Selecione uma conversa para começar a enviar mensagens.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;