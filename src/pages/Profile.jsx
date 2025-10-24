// src/pages/Profile.jsx
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Star, List, Eye, Trash2 } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getUserRatings } from '../services/media';
import { getUserLists, deleteList } from '../services/lists';
import MediaRatedCard from '../components/MediaRatedCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useMessage } from '../hooks/useMessage';
import Message from '../components/Message';
import AvatarModal from '../components/AvatarModal';
import { getAvatarPath, DEFAULT_AVATAR_ID } from '../config/avatars';
import { updateUserAvatar } from '../services/auth';

function Profile() {
  const { user, isAuthenticated, updateUser } = useUser();
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { message, type, showMessage } = useMessage();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Busca todos os dados do perfil (avaliações e listas) de uma só vez
  const fetchProfileData = useCallback(async () => {
    // Check inicial: se não estiver logado, não busca e redireciona
    if (!isAuthenticated || !user) {
      showMessage('Você precisa estar logado para ver seu perfil.', 'warning');
      navigate('/login');
      return;
    }
    console.log("Iniciando fetch com user.id:", user.id);
    setLoading(true);
    try {
      const [ratingsResponse, listsResponse] = await Promise.all([
        getUserRatings(user.id), // Passa o ID do usuário real
        getUserLists({ user_id: user.id }) // Passa o ID do usuário real
      ]);

      setRatings(ratingsResponse.results || []);
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
  }, [fetchProfileData]);

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
      vote_average: item.rating ?? item.score ?? 0,
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
    setIsModalOpen(false);
  };

  const handleSaveAvatar = async (newAvatarId) => {
    if (!user || !updateUser) {
      showMessage('Erro ao encontrar dados do usuário.', 'error');
      return;
    }

    try {
      const updatedUserFromApi = await updateUserAvatar({ avatar: newAvatarId });
      updateUser(updatedUserFromApi);

      showMessage('Avatar atualizado com sucesso!', 'success');
      handleCloseModal(); // Fecha o modal
    } catch (error) {
      showMessage('Erro ao salvar o novo avatar.', 'error');
      console.error("Falha ao salvar avatar:", error);
    }
  };

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
            <h1 className="text-4xl font-bold mb-2">{user?.username || user?.name || `Usuário #${user?.id}`}</h1>
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
              {ratings.map((item) => (
                <MediaRatedCard
                  // A chave precisa ser única, usa o ID interno do rating se disponível, senão combina tipo e media_id
                  key={item.id || `${item.type}-${item.movie_id || item.serie_id || item.anime_id}`}
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
      </div>
      {/* --- Renderizar o Modal --- */}
      <AvatarModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAvatar}
        currentAvatarId={user?.avatar || DEFAULT_AVATAR_ID}
      />
    </div>
  );
}

export default Profile;