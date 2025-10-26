// src/pages/ListDetailsItem.jsx
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Calendar } from 'lucide-react';
import Message from '../components/Message';
import { useMessage } from '../hooks/useMessage';

function ListDetailsItem() {
  const navigate = useNavigate();
  const location = useLocation();
  const { listId } = useParams(); 
  const media = location.state?.media;
  const { message, type } = useMessage();

  const getMediaTitle = (media) => {
    if (!media) return 'Título indisponível';
    if (typeof media.title === 'object' && media.title !== null) {
      return media.title.romaji || media.title.english || 'Título desconhecido';
    }
    return media.title || media.name || 'Título desconhecido';
  };

  const getImageUrl = (path, quality = 'original') => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `https://image.tmdb.org/t/p/${quality}${path}`;
  };

  if (!media) {
    // ... (bloco 'if (!media)' sem alterações)
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Dados da mídia não encontrados</h2>
          <p className="text-slate-600 mb-6">Esta página deve ser acessada a partir de uma lista.</p>
          <button
            onClick={() => navigate('/lists')} // Leva de volta para a página principal de listas
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Voltar para Listas
          </button>
        </div>
      </div>
    );
  }

  const handleGoBack = () => {
    // Tenta voltar no histórico. Se não houver histórico (ex: abriu direto),
    // vai para a lista sem filtro.
    if (window.history.length > 1) {
       navigate(-1);
    } else {
       navigate(`/lists/${listId}`); // Fallback
    }
  };

  const backdropPath = media.backdrop_path || media.bannerImage; 
  const backdropUrl = getImageUrl(backdropPath, 'original');
  const posterUrl = getImageUrl(media.poster_path, 'w500');
  let year = null;
  const dateString = media.release_date || media.first_air_date;
  if (dateString && dateString.length >= 4) {
    year = dateString.substring(0, 4);
  } else if (media.startDate?.year) {
    year = media.startDate.year;
  }


  return (
    <div className="min-h-screen bg-slate-50">
      <Message message={message} type={type} />
      
      <button
        onClick={handleGoBack}
        className="fixed top-20 left-6 lg:left-12 z-10 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow" // Mudado de z-20 para z-50
        title="Voltar"
      >
        <ArrowLeft className="w-6 h-6 text-slate-700" />
      </button>

      <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-slate-900 to-slate-700">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt={getMediaTitle(media)}
            className="w-full h-full object-cover opacity-30"
          />
        ) : (
          // Adicionado um fallback visual para quando não há imagem
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-slate-400">Imagem de fundo indisponível</p>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10 pb-16">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              {posterUrl && (
                <img
                  src={posterUrl}
                  alt={getMediaTitle(media)}
                  className="w-64 h-auto object-cover rounded-xl shadow-lg"
                />
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {getMediaTitle(media)}
              </h1>
              
              <div className="flex items-center justify-center md:justify-start space-x-6 mb-6 text-slate-600">
                {media.vote_average > 0 && (
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="font-bold text-lg">{(media.vote_average).toFixed(1)}</span>
                  </div>
                )}
                
                {/* --- EXIBIÇÃO DO ANO CORRIGIDA --- */}
                {/* Agora usa a variável 'year' */}
                {year && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <span className="font-medium">{year}</span>
                  </div>
                )}
                {/* --- FIM DA CORREÇÃO --- */}
              </div>

              <p className="text-slate-700 leading-relaxed">
                {media.overview || media.description || 'Sem descrição disponível.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListDetailsItem;