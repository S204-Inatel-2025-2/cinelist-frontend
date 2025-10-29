// src/pages/AnotherUser.jsx
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Mail, Calendar, Star, List, Eye } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getUserRatings } from '../services/media';
import { getUserLists } from '../services/lists';
import { getUserById } from '../services/users'; // Importa a nova função
import AnotherUserRatedCard from '../components/AnotherUserRatedCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useMessage } from '../hooks/useMessage';
import Message from '../components/Message';
import { getAvatarPath, DEFAULT_AVATAR_ID } from '../config/avatars';

// --- Copiado do Profile.jsx (Lógica correta) ---
const removeDuplicatesById = (mediaList) => {
  if (!Array.isArray(mediaList)) return [];
  const mediaMap = new Map();
  mediaList.forEach(media => {
    mediaMap.set(`${media.type}-${media.id}`, media);
  });
  return Array.from(mediaMap.values());
};

// --- Copiado do Profile.jsx (Lógica correta) ---
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


function AnotherUser() {
  const { id: userId } = useParams(); // Pega o ID da URL
  const { user: loggedInUser } = useUser(); // Pega o usuário logado
  const navigate = useNavigate();
  
  const [profileUser, setProfileUser] = useState(null); // O usuário que estamos vendo
  const [ratings, setRatings] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { message, type, showMessage } = useMessage();

  // Busca os dados do usuário (perfil, avaliações, listas)
  const fetchProfileData = useCallback(async () => {
    if (!userId) {
      navigate('/users'); // Se não tiver ID, volta para a lista
      return;
    }
    
    // Redireciona se o usuário estiver tentando ver o próprio perfil por esta página
    if (loggedInUser.id === parseInt(userId, 10)) {
        navigate('/profile');
        return;
    }

    setLoading(true);
    try {
      // Faz as 3 chamadas em paralelo
      const [userData, ratingsResponse, listsResponse] = await Promise.all([
        getUserById(userId),
        getUserRatings(userId),
        getUserLists({ user_id: userId })
      ]);

      setProfileUser(userData);

      const rawRatings = ratingsResponse.results || [];
      const uniqueRatings = removeDuplicatesById(rawRatings);
      setRatings(uniqueRatings);

      setLists(listsResponse || []);

    } catch (error) {
      showMessage(error.detail || 'Erro ao carregar dados do usuário.', 'error');
      console.error('Falha ao buscar dados do perfil:', error);
      if (error.status === 404) {
        navigate('/users'); // Volta se o usuário não for encontrado
      }
    } finally {
      setLoading(false);
    }
  }, [userId, loggedInUser, showMessage, navigate]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

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

  // Navega para ver os detalhes da lista (igual ao Profile)
  const handleViewList = (listId) => {
    navigate(`/user-lists/${listId}`, { state: { profileUser } });
  };

  if (loading || !profileUser) {
      return (
          <div className="min-h-screen bg-slate-50 flex items-center justify-center">
              <LoadingSpinner text="Carregando perfil..." />
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Message message={message} type={type} />

      {/* Banner do perfil (sem 'onClick' no avatar) */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-12 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-12">
          <div className="flex flex-col items-center text-center">
            <img
              src={getAvatarPath(profileUser?.avatar)}
              alt={profileUser?.username}
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl mb-4 bg-slate-600"
              onError={(e) => { e.target.src = getAvatarPath(DEFAULT_AVATAR_ID); }}
            />
            <h1 className="text-4xl font-bold mb-2">{profileUser?.username}</h1>
            {/* Opcional: mostrar email (se a API retornar) */}
            {profileUser?.email && (
              <p className="text-slate-300 flex items-center justify-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{profileUser.email}</span>
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
              {profileUser?.created_at ? new Date(profileUser.created_at).getFullYear() : new Date().getFullYear()}
            </h3>
            <p className="text-slate-600">Membro desde</p>
          </div>
        </div>

        {/* Avaliações */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
            <Star className="w-6 h-6" />
            <span>Avaliações de {profileUser.username}</span>
          </h2>
          {loading ? (
            <LoadingSpinner text="Carregando avaliações..." />
          ) : ratings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {sortedRatings.map((item) => (
                <AnotherUserRatedCard
                    key={`${item.type}-${item.id}`}
                    media={normalizeRatedData(item)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600">Este usuário ainda não avaliou nenhuma mídia.</p>
            </div>
          )}
        </div>

        {/* Listas do Usuário */}
        <div className="bg-white rounded-xl shadow-md p-8 mt-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
            <List className="w-6 h-6" />
            <span>Listas de {profileUser.username}</span>
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
                      {/* Botão de Ver, mas sem o de Excluir */}
                      <button
                        // handleViewList agora navega para a rota correta
                        onClick={() => handleViewList(list.id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Ver lista"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600">Este usuário ainda não criou nenhuma lista.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AnotherUser;