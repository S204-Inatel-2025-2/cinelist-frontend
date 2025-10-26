// src/pages/AnotherUserListDetailsItem.jsx
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Calendar } from 'lucide-react';
// Removed Message and useMessage imports as this page is view-only

function AnotherUserListDetailsItem() {
  const navigate = useNavigate();
  const location = useLocation();
  // Get listId and mediaId from URL params (although mediaId isn't strictly needed if data comes via state)
  const { listId, id: mediaId } = useParams();
  // Get media data passed via navigation state
  const media = location.state?.media;

  // Helper function to get the title consistently
  const getMediaTitle = (media) => {
    if (!media) return 'Título indisponível';
    // Handle potential object title structure (e.g., from AniList)
    if (typeof media.title === 'object' && media.title !== null) {
      return media.title.romaji || media.title.english || media.name || 'Título desconhecido';
    }
    // Handle string title or name
    return media.title || media.name || 'Título desconhecido';
  };

  // Helper function to build image URLs
  const getImageUrl = (path, quality = 'original') => {
    if (!path) return null;
    if (path.startsWith('http')) return path; // Already a full URL
    return `https://image.tmdb.org/t/p/${quality}${path}`;
  };

  // Fallback rendering if media data wasn't passed correctly
  if (!media) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Dados da mídia não encontrados</h2>
          <p className="text-slate-600 mb-6">Esta página deve ser acessada a partir de uma lista de usuário.</p>
          <button
            // Provide a sensible fallback navigation target
            onClick={() => navigate(listId ? `/user-lists/${listId}` : '/users')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {listId ? 'Voltar para a Lista' : 'Voltar para Usuários'}
          </button>
        </div>
      </div>
    );
  }

  // Back navigation function - always goes back to the specific user's list page
  const handleGoBack = () => {
    // Tenta voltar no histórico do navegador
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Se não houver histórico, vai para a página da lista (sem passar state)
      navigate(`/user-lists/${listId}`); // Fallback
    }
  };

  // Prepare image URLs and year extraction (same logic as ListDetailsItem)
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

  // --- JSX Return ---
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Back Button */}
      <button
        onClick={handleGoBack} // Use the specific back navigation
        className="fixed top-20 left-6 lg:left-12 z-10 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
        title="Voltar para a Lista" // Updated title
      >
        <ArrowLeft className="w-6 h-6 text-slate-700" />
      </button>

      {/* Backdrop Section */}
      <div className="relative h-96 md:h-[500px] bg-gradient-to-br from-slate-900 to-slate-700">
        {backdropUrl ? (
          <img
            src={backdropUrl}
            alt={`Fundo de ${getMediaTitle(media)}`}
            className="w-full h-full object-cover opacity-30"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-slate-400">Imagem de fundo indisponível</p>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent" />
      </div>

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10 pb-16">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster Image */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              {posterUrl ? (
                <img
                  src={posterUrl}
                  alt={getMediaTitle(media)}
                  className="w-64 h-auto object-cover rounded-xl shadow-lg"
                />
              ) : (
                 <div className="w-64 h-96 bg-slate-200 rounded-xl shadow-lg flex items-center justify-center text-slate-500">
                    Sem Poster
                 </div>
              )}
            </div>

            {/* Media Details */}
            <div className="flex-1 text-center md:text-left">
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {getMediaTitle(media)}
              </h1>

              {/* Rating and Year */}
              <div className="flex items-center justify-center md:justify-start space-x-6 mb-6 text-slate-600">
                {/* Display Rating if available and greater than 0 */}
                {media.vote_average != null && media.vote_average > 0 && (
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-lg">{(media.vote_average).toFixed(1)}</span>
                  </div>
                )}
                {/* Display Year */}
                {year && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <span className="font-medium">{year}</span>
                  </div>
                )}
              </div>

              {/* Overview/Description */}
              <p className="text-slate-700 leading-relaxed">
                {media.overview || media.description || 'Sem descrição disponível.'}
              </p>

              {/* Add/Remove/Edit buttons are NOT included here */}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnotherUserListDetailsItem;