// src/pages/Lists.jsx
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { List, Plus, Trash2, Eye } from 'lucide-react';
import { useMessage } from '../hooks/useMessage';
import { useUser } from '../context/UserContext';
import Message from '../components/Message';
import LoadingSpinner from '../components/LoadingSpinner';
import { createList, getUserLists, deleteList } from '../services/lists';

function Lists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // Para desabilitar botões
  const { message, type, showMessage } = useMessage();
  const { user, isAuthenticated } = useUser(); // Pega o usuário e estado de auth
  const navigate = useNavigate();

  const loadLists = useCallback(async () => {
    if (!isAuthenticated || !user) {
      // Se não estiver logado ao tentar carregar, redireciona
      showMessage('Você precisa estar logado para ver suas listas.', 'warning');
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      // --- CORRIGIDO: usa user.id ---
      const data = await getUserLists({ user_id: user.id });
      setLists(data || []);
    } catch (error) {
      showMessage('Erro ao carregar listas', 'error');
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, showMessage, navigate]);

  useEffect(() => {
    loadLists();
  }, [loadLists]);

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      showMessage('Você precisa estar logado para criar uma lista.', 'warning');
      navigate('/login');
      return;
    }
    if (!newListName.trim()) {
      return showMessage('Digite um nome para a lista', 'error');
    }
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = {
        nome: newListName.trim(),
        description: newListDescription.trim() || null,
        user_id: user.id,
      };
      await createList(payload);
      showMessage('Lista criada com sucesso!', 'success');
      setNewListName('');
      setNewListDescription('');
      setShowCreateModal(false);
      loadLists(); // Recarrega as listas
    } catch (error) {
      showMessage('Erro ao criar lista', 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteList = async (listId) => {
    if (!isAuthenticated || !user) {
      showMessage('Você precisa estar logado para excluir uma lista.', 'warning');
      navigate('/login');
      return;
    }
    if (isSubmitting) return;

    // Usar modal customizado
    if (!window.confirm('Tem certeza que deseja excluir esta lista e todos os seus itens?')) return;

    setIsSubmitting(true); // Bloqueia múltiplas exclusões
    try {
      await deleteList({
        lista_id: listId,
        // --- CORRIGIDO: usa user.id ---
        user_id: user.id,
      });
      showMessage('Lista excluída com sucesso!', 'success');
      loadLists(); // Recarrega
    } catch (error) {
      showMessage('Erro ao excluir lista', 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleViewList = (listId) => {
    navigate(`/lists/${listId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LoadingSpinner text="Carregando suas listas..." />
      </div>
    );
  }

  // Se não estiver autenticado após o carregamento, pode mostrar uma mensagem ou já ter redirecionado
  if (!isAuthenticated) {
     return (
       <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
         <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">Acesso Negado</h2>
            <p className="text-slate-600 mb-6">Por favor, faça login para ver suas listas.</p>
            <button onClick={() => navigate('/login')} className="px-6 py-2 bg-blue-600 text-white rounded-lg">
                Ir para Login
            </button>
         </div>
       </div>
     );
   }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Message message={message} type={type} />

      <header className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-16 lg:py-24 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <List className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Minhas Listas</h1>
          </div>
          <p className="text-lg text-slate-300 mb-8">
            Organize suas mídias favoritas em listas personalizadas
          </p>
        </div>
      </header>

      <main className="flex flex-col flex-1">
        <div className="max-w-[1600px] mx-auto w-full px-6 lg:px-12 mt-12 mb-12">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold text-slate-900">
              {lists.length} {lists.length === 1 ? 'Lista' : 'Listas'}
            </h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Plus className="w-5 h-5" />
              <span>Nova Lista</span>
            </button>
          </div>

          {lists.length === 0 ? (
            <div className="text-center py-20">
              <List className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Nenhuma lista criada ainda
              </h3>
              <p className="text-slate-600 mb-6">
                Crie sua primeira lista para organizar suas mídias favoritas
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                Criar Primeira Lista
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {lists.map((list) => (
                <div
                  key={list.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{list.nome}</h3>
                  {list.description && (
                    <p className="text-slate-600 mb-4 line-clamp-2">{list.description}</p>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-sm text-slate-500">
                      {list.item_count || 0} {list.item_count === 1 ? 'item' : 'itens'}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewList(list.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Visualizar Lista"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteList(list.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Excluir Lista"
                        disabled={isSubmitting} // Desabilita enquanto outra exclusão está em progresso
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Criar Nova Lista</h2>
            <form onSubmit={handleCreateList} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nome da Lista
                </label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="Ex: Filmes Favoritos"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Descrição (opcional)
                </label>
                <textarea
                  value={newListDescription}
                  onChange={(e) => setNewListDescription(e.target.value)}
                  placeholder="Adicione uma descrição..."
                  rows="3"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                   disabled={isSubmitting}
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewListName('');
                    setNewListDescription('');
                  }}
                  className="flex-1 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium"
                   disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Criando...' : 'Criar Lista'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Lists;