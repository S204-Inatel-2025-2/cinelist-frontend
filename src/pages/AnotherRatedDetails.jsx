import { useEffect } from 'react'; // Removed useState
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Clock } from 'lucide-react';

function AnotherRatedDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type: mediaType, id: mediaId } = useParams();
  const media = location.state?.media;

  useEffect(() => {
    // Basic check if media data was passed
    if (!media) {
      // Maybe show a generic error message via context/toast if you have one
      console.error('Media data missing for AnotherRatedDetails');
      navigate(-1); // Go back if no media data
    }
  }, [media, navigate]);


  // Helper functions (copied, no changes needed)
  const getMediaTitle = (media) => {
    if (!media) return 'Título indisponível';
    return media.title || media.name || 'Título desconhecido';
  };

  const getImageUrl = (path, quality = 'w500') => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `https://image.tmdb.org/t/p/${quality}${path}`;
  };

  // Removed handleUpdateRating and handleDeleteRating functions

  // Fallback if media data is missing (slightly simplified)
  if (!media) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Carregando...</h2>
           {/* You might show a spinner here instead */}
        </div>
      </div>
    );
  }

  // --- Rendering part (Similar structure, but without form/buttons) ---
  const backdropUrl = getImageUrl(media.backdrop_path, 'original');
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
      {/* Removed <Message /> component as there are no actions */}

      {/* Botão Voltar (same as before) */}
      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 left-6 lg:left-12 z-10 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
        title="Voltar"
      >
        <ArrowLeft className="w-6 h-6 text-slate-700" />
      </button>

      {/* Seção de Fundo (Backdrop) (same as before) */}
      <div className="relative h-96 bg-gradient-to-br from-slate-900 to-slate-700">
        {/* ... backdrop img ... */}
         {backdropUrl && (
          <img
            src={backdropUrl}
            alt={getMediaTitle(media)}
            className="w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/70 to-transparent" />
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 -mt-32 relative z-10 pb-16">
        <main className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <div className="flex flex-col md:flex-row gap-12 lg:gap-20">
            {/* Poster (same as before) */}
            {posterUrl && (
              <img
                src={posterUrl}
                alt={getMediaTitle(media)}
                className="w-full md:w-96 h-auto object-contain rounded-xl shadow-lg mx-auto md:mx-0 flex-shrink-0"
              />
            )}
            {/* Detalhes */}
            <div className="flex-1 pt-4 md:pt-0">

              {/* Metadados (same as before) */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-600 text-sm mb-4">
                 {year && (
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{year}</span>
                  </span>
                )}
                {media.runtime && media.type === 'movie' && (
                  <span className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{media.runtime} min</span>
                  </span>
                )}
              </div>

              {/* Título (same as before) */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{getMediaTitle(media)}</h1>

              {/* Sinopse (same as before) */}
              <h2 className="text-2xl font-bold text-slate-900 mb-3 mt-6">Sinopse</h2>
              <p className="text-lg text-slate-700 leading-relaxed mb-8">
                {media.overview || media.description || 'Sem descrição disponível.'}
              </p>

              {/* --- Seção de Avaliação (View Only) --- */}
              <div className="mb-8 border-t border-b border-slate-200 py-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Avaliação do Usuário {/* Title is fixed */}
                </h2>
                {/* Mostra a Nota */}
                {(media.vote_average != null) && (
                  <div className="flex items-center space-x-2 mb-3 text-lg">
                    <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                    <span className="font-bold text-slate-800">
                      Nota: {media.vote_average.toFixed(1)} / 10 {/* Label is fixed */}
                    </span>
                  </div>
                )}
                {/* Mostra o Comentário */}
                {media.comment ? (
                  <blockquote className="border-l-4 border-slate-300 py-1 pl-4 text-slate-700 italic">
                    "{media.comment}"
                  </blockquote>
                ) : (
                  media.vote_average != null && (
                    <p className="text-slate-500 italic">Nenhum comentário adicionado.</p>
                  )
                )}
                {media.vote_average == null && (
                   <p className="text-slate-500">Nenhuma avaliação encontrada para esta mídia.</p>
                )}
              </div>
              {/* --- Fim da Seção de Avaliação --- */}

              {/* Editing Form and Buttons are REMOVED */}

            </div> {/* Fim da div flex-1 */}
          </div> {/* Fim da div flex */}
        </main> {/* Fim da tag main */}
      </div> {/* Fim da div max-w */}
    </div> // Fim da div min-h-screen
  );
}

export default AnotherRatedDetails;