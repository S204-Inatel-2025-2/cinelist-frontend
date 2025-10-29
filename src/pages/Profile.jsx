// src/pages/Profile.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Star, List, Eye, Trash2, AlertTriangle, Pencil } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getUserRatings } from '../services/media';
import { getUserLists, deleteList } from '../services/lists';
import MediaRatedCard from '../components/MediaRatedCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useMessage } from '../hooks/useMessage';
import Message from '../components/Message';
import AvatarModal from '../components/AvatarModal';
import { getAvatarPath, DEFAULT_AVATAR_ID } from '../config/avatars';
import { updateUserAvatar, deleteAccount, updateUsername } from '../services/auth';

const removeDuplicatesById = (mediaList) => {
  if (!Array.isArray(mediaList)) return [];
  const mediaMap = new Map();
  mediaList.forEach(media => {
    // Usa 'media.id' que, no caso dos ratings, é o ID da avaliação (ex: 8, 9, 10)
    mediaMap.set(`${media.type}-${media.id}`, media);
  });
  return Array.from(mediaMap.values());
};

function Profile() {
  const { user, isAuthenticated, updateUser, logout, isDeleting, setDeleteState } = useUser();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { message, type, showMessage } = useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [isSavingName, setIsSavingName] = useState(false);
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);

  // Busca todos os dados do perfil (avaliações e listas) de uma só vez
  const fetchProfileData = useCallback(async () => {
    // Check inicial: se não estiver logado, não busca e redireciona
    if (!isAuthenticated || !user) {
      showMessage('Você precisa estar logado para ver seu perfil.', 'warning');
      navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const [ratingsResponse, listsResponse] = await Promise.all([
        getUserRatings(user.id), // Passa o ID do usuário real
        getUserLists({ user_id: user.id }) // Passa o ID do usuário real
      ]);

      const rawRatings = ratingsResponse.results || [];
      const uniqueRatings = removeDuplicatesById(rawRatings);

      setRatings(uniqueRatings);
      
      setLists(listsResponse || []);
    } catch (error) {
      showMessage('Erro ao carregar dados do perfil.', 'error');
      console.error('Falha ao buscar dados do perfil:', error);
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated, showMessage, navigate]);
  
  useEffect(() => {
    fetchProfileData();
    if (user?.username) {
        setNewUsername(user.username);
    }
  }, [fetchProfileData, user]);

  const sortedRatings = useMemo(() => {
    const getTypePriority = (type) => {
      switch (type) {
        case 'movie': return 1;
        case 'serie': return 2;
        case 'anime': return 3;
        default: return 4;
      }
    };

    return [...ratings].sort((a, b) => {
      const priorityA = getTypePriority(a.type);
      const priorityB = getTypePriority(b.type);

      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }

      const titleA = (a.title || a.name || '').toString();
      const titleB = (b.title || b.name || '').toString();

      return titleA.localeCompare(titleB);
    });

  }, [ratings]);

  const handleSaveUsername = async () => {
    if (!isAuthenticated || !user) {
      showMessage('Sessão expirada. Faça login novamente.', 'warning');
      navigate('/login');
      return;
    }

    const trimmedUsername = newUsername.trim();
    if (trimmedUsername === user.username) {
      setIsNameEditing(false); // Fecha sem salvar se não houver mudança
      return;
    }

    if (trimmedUsername.length < 3) {
      return showMessage('O nome de usuário deve ter pelo menos 3 caracteres.', 'error');
    }

    setIsSavingName(true);
    try {
      // Chamada da API para atualizar o username (será implementada no serviço)
      const updatedUserFromApi = await updateUsername({ username: trimmedUsername }); 
      
      updateUser(updatedUserFromApi); // Atualiza o contexto (username)
      showMessage('Nome de usuário alterado com sucesso!', 'success');
      setIsNameEditing(false); // Fecha o modal
    } catch (error) {
      // Assume que o backend retorna {detail: "Username já em uso"} ou similar
      const errorMessage = error.detail || 'Erro ao salvar o nome de usuário. Tente outro nome.';
      showMessage(errorMessage, 'error');
      console.error("Falha ao salvar username:", error);
    } finally {
      setIsSavingName(false);
    }
  };

  // --- Função para cancelar a edição ---
  const handleCancelUsernameEdit = () => {
    setNewUsername(user.username); // Restaura o valor original
    setIsNameEditing(false); // Fecha o modal
  };

  // Funções para manipular as listas
  const handleDeleteList = async (listId) => {
    if (!isAuthenticated || !user) {
      showMessage('Sessão expirada. Faça login novamente.', 'warning');
      navigate('/login');
      return;
    }

    // Usar modal customizado
    if (!window.confirm('Tem certeza que deseja excluir esta lista e todos os seus itens?')) return;

    try {
      await deleteList({
        lista_id: listId,
        // --- CORRIGIDO: usa user.id ---
        user_id: user.id,
      });
      showMessage('Lista excluída com sucesso!', 'success');
      fetchProfileData(); // Recarrega os dados para atualizar a UI
    } catch (error) {
      showMessage('Erro ao excluir lista', 'error');
    }
  };

  const handleViewList = (listId) => {
    navigate(`/lists/${listId}`);
  };

  // Normaliza os dados de mídias avaliadas para o componente MediaRatedCard
  const normalizeRatedData = (item) => {
    let id;
    if (item.type === 'movie') id = item.movie_id;
    else if (item.type === 'serie') id = item.serie_id;
    else if (item.type === 'anime') id = item.anime_id;

    return {
      id,
      type: item.type,
      title: item.title || item.name || 'Sem título',
      overview: (item.overview || item.description || '').replace(/<[^>]*>/g, '') || 'Sem descrição disponível.',
      vote_average: item.rating ?? item.score ?? null,
      poster_path: item.poster_path || item.image || null,
      backdrop_path: item.backdrop_path || null,
      comment: item.comment || null,
      release_date: item.release_date || null,
      first_air_date: item.first_air_date || null,
      startDate: item.startDate || null,
    };
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSavingAvatar) return;
    setIsModalOpen(false);
  };

  const handleSaveAvatar = async (newAvatarId) => {
    if (!user || !updateUser) {
      showMessage('Erro ao encontrar dados do usuário.', 'error');
      return;
    }

    setIsSavingAvatar(true); // Trava o modal
    try {
      const updatedUserFromApi = await updateUserAvatar({ avatar: newAvatarId });
      updateUser(updatedUserFromApi);

      showMessage('Avatar atualizado com sucesso!', 'success');
      handleCloseModal(); // Fecha o modal (agora já pode fechar)
    } catch (error) {
      showMessage('Erro ao salvar o novo avatar.', 'error');
      console.error("Falha ao salvar avatar:", error);
    } finally {
      setIsSavingAvatar(false); // Libera o modal em caso de sucesso ou erro
    }
  };

  const handleDeleteAccount = async () => {
    if (!isAuthenticated || !user) {
      showMessage('Sessão expirada. Faça login novamente.', 'warning');
      navigate('/login');
      return;
    }
    if (isDeleting) return; // Previne cliques múltiplos

    const confirmation = window.confirm(
      'ATENÇÃO!\n\nTem certeza ABSOLUTA que deseja deletar sua conta?\n\n' +
      'Esta ação é IRREVERSÍVEL e apagará permanentemente:\n' +
      '- Seu perfil\n' +
      '- Todas as suas listas e os itens nelas\n' +
      '- Todas as suas avaliações e comentários\n\n' +
      'Não será possível recuperar seus dados.'
    );

    if (!confirmation) {
      return; 
    }

    setDeleteState(true);
    try {
      await deleteAccount();
      showMessage('Sua conta foi deletada com sucesso. Adeus!', 'success');

      setTimeout(() => {
        logout();
        // --- USAR CONTEXTO: Setar o estado de volta para FALSE (após o logout) ---
        setDeleteState(false); 
        navigate('/login', { replace: true });
      }, 2500);

    } catch (error) {
      const errorMessage = error.detail || 'Ocorreu um erro ao tentar deletar sua conta. Tente novamente.';
      showMessage(errorMessage, 'error');
      // --- USAR CONTEXTO: Setar o estado de volta para FALSE no erro ---
      setDeleteState(false); 
    }
  };

  if (isDeleting) {
      return (
          <div className="min-h-screen bg-slate-800 flex flex-col items-center justify-center text-white">
              {/* Usando o componente LoadingSpinner existente */}
              <LoadingSpinner text="Deletando sua conta..." white /> {/* Assumindo que seu spinner tem prop 'white' ou adapta a cor */}
              <p className="mt-4 text-slate-300">Por favor, aguarde. Você será redirecionado em breve.</p>
          </div>
      );
  }

  if (loading || !user) {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center">
              <LoadingSpinner text="Carregando perfil..." />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Message message={message} type={type} />

      {/* Banner do perfil */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-12 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-12">
          <div className="flex flex-col items-center text-center">
            <img
              src={getAvatarPath(user?.avatar)}
              alt={user?.username || user?.name || `Usuário #${user?.id}`}
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl mb-4 bg-slate-600 cursor-pointer transition-transform hover:scale-105"
              onClick={handleOpenModal} 
              // Fallback em caso de erro usa a função também
              onError={(e) => { e.target.src = getAvatarPath(DEFAULT_AVATAR_ID); }}
              title="Clique para alterar o ícone"
            />
            {/* Usa user.username ou user.name */}
            {isNameEditing ? (
              // Modo Edição
              <div className="flex flex-col items-center w-full max-w-sm mb-2">
                <h2 className="text-xl font-medium mb-2">Trocar nome de usuário</h2>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="text-white text-center text-3xl font-bold p-2 mb-2 rounded-lg border-2 border-blue-400 focus:outline-none w-full"
                  disabled={isSavingName}
                />
                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveUsername}
                    disabled={
                      isSavingName ||
                      newUsername.trim().length < 3 ||
                      newUsername.trim() === user.username
                    }
                    className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingName ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    onClick={handleCancelUsernameEdit}
                    disabled={isSavingName}
                    className="px-4 py-2 bg-slate-400 text-white font-medium rounded-lg hover:bg-slate-500 transition-colors disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              // Modo Visualização
              <div className="relative flex justify-center mb-2 w-full">
                <h1 className="text-4xl font-bold text-center">{user?.username || user?.name || `Usuário #${user?.id}`}</h1>
                <button
                  onClick={() => setIsNameEditing(true)}
                  className="absolute left-1/2 translate-x-[6rem] top-1/2 -translate-y-1/2 hover:text-blue-400 transition-colors"
                  title="Editar nome de usuário"
                >
                  <Pencil className="w-5 h-5" />
                </button>
              </div>
            )}
            
            {user?.email && (
              <p className="text-slate-300 flex items-center justify-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 max-w-[1600px] mx-auto w-full px-4 md:px-8 lg:px-12 pt-16 pb-12">
        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <Star className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-slate-900 mb-1">
              {loading ? '...' : ratings.length}
            </h3>
            <p className="text-slate-600">Avaliações</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <List className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-slate-900 mb-1">
              {loading ? '...' : lists.length}
            </h3>
            <p className="text-slate-600">Listas</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <Calendar className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-slate-900 mb-1">
              {/* Idealmente, pegar a data de criação do usuário do backend */}
              {user?.created_at ? new Date(user.created_at).getFullYear() : new Date().getFullYear()}
            </h3>
            <p className="text-slate-600">Membro desde</p>
          </div>
        </div>

        {/* Avaliações */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
            <Star className="w-6 h-6" />
            <span>Minhas Avaliações</span>
          </h2>
          {loading ? (
            <LoadingSpinner text="Carregando avaliações..." />
          ) : ratings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {sortedRatings.map((item) => (
                <MediaRatedCard
                  key={`${item.type}-${item.id}`}
                  media={normalizeRatedData(item)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600">Você ainda não avaliou nenhuma mídia.</p>
            </div>
          )}
        </div>

        {/* Listas do Usuário */}
        <div className="bg-white rounded-xl shadow-md p-8 mt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
            <List className="w-6 h-6" />
            <span>Minhas Listas</span>
          </h2>
          {loading ? (
            <LoadingSpinner text="Carregando listas..." />
          ) : lists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {lists.map((list) => (
                <div
                  key={list.id}
                  className="bg-slate-50 border border-slate-200 rounded-xl hover:shadow-lg transition-shadow p-6 flex flex-col"
                >
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{list.nome}</h3>
                  {list.description && (
                    <p className="text-slate-600 mb-4 line-clamp-2 flex-grow">{list.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200">
                    <span className="text-sm text-slate-500">
                      {list.item_count ?? 0} {list.item_count === 1 ? 'item' : 'itens'}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewList(list.id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Ver lista"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteList(list.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Excluir lista"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600">Você ainda não criou nenhuma lista.</p>
               <button
                  onClick={() => navigate('/lists')} // Leva para a página de listas para criar uma
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
               >
                  Criar Lista
               </button>
            </div>
          )}
        </div>
        <div className="bg-red-50 border-l-4 border-red-500 rounded-r-lg p-6 mt-12 shadow">
          <h2 className="text-xl font-bold text-red-800 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Zona de Perigo
          </h2>
          <p className="text-red-700 mb-4">
            Deletar sua conta é uma ação permanente e irreversível. Todos os seus dados,
            incluindo listas e avaliações, serão perdidos para sempre.
          </p>
          <button
            onClick={handleDeleteAccount}
            disabled={isDeleting}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <LoadingSpinner small white />
                Deletando...
              </>
            ) : (
               <>
                 <Trash2 className="w-5 h-5" />
                 Deletar Minha Conta Permanentemente
               </>
            )}
          </button>
        </div>
      </div>
      {/* --- Renderizar o Modal --- */}
      <AvatarModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAvatar}
        currentAvatarId={user?.avatar || DEFAULT_AVATAR_ID}
        isSaving={isSavingAvatar} 
      />
    </div>
  );
}

export default Profile;