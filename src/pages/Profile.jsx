// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { User, Mail, Calendar, Star, List } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { getUserRatings } from '../services/media';
import MediaRatedCard from '../components/MediaRatedCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useMessage } from '../hooks/useMessage';
import Message from '../components/Message';

function Profile() {
  const { user } = useUser();
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { message, type, showMessage } = useMessage();

  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      try {
        const userId = 10;
        console.log('Buscando avaliações para o usuário fixo:', userId);
        const response = await getUserRatings(userId);
        console.log('Resposta recebida:', response);
        setRatings(response.results || []);
      } catch (error) {
        showMessage('Erro ao carregar avaliações.', 'error');
        console.error('Falha ao buscar avaliações do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  const normalizeRatedData = (item) => {
    let id;
    let title;
    let overview;
    let rating;
    let poster_path;
    let comment;

    if (item.type === 'movie') {
      id = item.movie_id;
    } else if (item.type === 'serie') {
      id = item.serie_id;
    } else if (item.type === 'anime') {
      id = item.anime_id;
    }

    title = item.title || item.name || 'Sem título';
    overview = item.overview || item.description || 'Sem descrição disponível.';
    rating = item.rating ?? item.score ?? 0;
    poster_path = item.poster_path || item.image || null;
    comment = item.comment || null;

    return {
      id,
      type: item.type,
      title,
      overview,
      vote_average: rating,
      poster_path,
      comment,
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Message message={message} type={type} />

      {/* Banner do perfil */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-12 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-12">
          <div className="flex flex-col items-center text-center">
            <img
              src={user?.avatar || 'https://www.w3schools.com/howto/img_avatar.png'}
              alt={user?.name || 'Usuário #10'}
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl mb-4"
            />
            <h1 className="text-4xl font-bold mb-2">{user?.name || 'Usuário #10'}</h1>
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
      <div className="flex-1 max-w-[1600px] mx-auto px-8 lg:px-12 pt-16 pb-12">
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
            <h3 className="text-3xl font-bold text-slate-900 mb-1">0</h3>
            <p className="text-slate-600">Listas</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <Calendar className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-slate-900 mb-1">
              {new Date().getFullYear()}
            </h3>
            <p className="text-slate-600">Membro desde</p>
          </div>
        </div>

        {/* Informações do perfil */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center space-x-2">
            <User className="w-6 h-6" />
            <span>Informações do Perfil</span>
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-3 border-b border-slate-200">
              <span className="text-slate-600">Nome</span>
              <span className="font-medium text-slate-900">
                {user?.name || 'Usuário #10'}
              </span>
            </div>
            {user?.email && (
              <div className="flex justify-between py-3 border-b border-slate-200">
                <span className="text-slate-600">Email</span>
                <span className="font-medium text-slate-900">{user.email}</span>
              </div>
            )}
            <div className="flex justify-between py-3">
              <span className="text-slate-600">Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Ativo
              </span>
            </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {ratings.map((item) => (
                <MediaRatedCard
                  key={`${item.type}-${item.id}`}
                  media={normalizeRatedData(item)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-600">
                Você ainda não avaliou nenhuma mídia.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;