// src/pages/MediaDetails.jsx
import { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Clock } from 'lucide-react';
import { useMessage } from '../hooks/useMessage';
import Message from '../components/Message';
import { rateMedia } from '../services/media';

function MediaDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const media = location.state?.media;
  const { message, type, showMessage } = useMessage();

  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const getMediaTitle = (media) => {
    if (!media) return 'Título indisponível';
    if (typeof media.title === 'object') {
      return media.title.romaji || media.title.english || 'Título desconhecido';
    }
    return media.title || media.name || 'Título desconhecido';
  };

  // Função para tratar URLs de imagem de diferentes fontes e qualidades
  const getImageUrl = (path, quality = 'w500') => {
    if (!path) {
      return null;
    }
    if (path.startsWith('http')) {
      return path;
    }
    return `https://image.tmdb.org/t/p/${quality}${path}`;
  };

  if (!media) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Mídia não encontrada</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const handleSubmitRating = async (e) => {
    e.preventDefault();

    if (!rating || rating < 0 || rating > 10) {
      return showMessage('Por favor, insira uma nota entre 0 e 10', 'error');
    }

    setSubmitting(true);
    try {
      await rateMedia({
        media_id: media.id,
        rating: parseFloat(rating),
        review: review.trim() || null,
      });
      showMessage('Avaliação enviada com sucesso!', 'success');
      setRating('');
      setReview('');
    } catch (error) {
      showMessage('Erro ao enviar avaliação. Tente novamente.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const backdropUrl = getImageUrl(media.backdrop_path, 'original');
  const posterUrl = getImageUrl(media.poster_path, 'w500');

  return (
    <div className="min-h-screen bg-slate-50">
      <Message message={message} type={type} />

      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 left-4 z-10 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <ArrowLeft className="w-6 h-6 text-slate-700" />
      </button>

      <div className="relative h-96 bg-gradient-to-br from-slate-900 to-slate-700">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={getMediaTitle(media)}
            className="w-full h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {posterUrl && (
              <img
                src={posterUrl}
                alt={getMediaTitle(media)}
                className="w-64 rounded-xl shadow-lg mx-auto md:mx-0"
              />
            )}

            <div className="flex-1">
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                {getMediaTitle(media)}
              </h1>

              {media.tagline && (
                <p className="text-xl text-slate-600 italic mb-4">{media.tagline}</p>
              )}

              <div className="flex flex-wrap gap-4 mb-6">
                {(media.vote_average || media.rating || media.score) && (
                  <div className="flex items-center space-x-2 bg-yellow-100 px-4 py-2 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-600 fill-yellow-600" />
                    <span className="font-bold text-yellow-900">
                      {(media.vote_average || media.rating || media.score).toFixed(1)}
                    </span>
                  </div>
                )}

                {(media.release_date || media.first_air_date) && (
                  <div className="flex items-center space-x-2 bg-blue-100 px-4 py-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-900">
                      {new Date(media.release_date || media.first_air_date).getFullYear()}
                    </span>
                  </div>
                )}

                {media.runtime && (
                  <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-lg">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="text-green-900">{media.runtime} min</span>
                  </div>
                )}
              </div>

              {media.genres && media.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {media.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-slate-200 text-slate-700 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              <h2 className="text-2xl font-bold text-slate-900 mb-3">Sinopse</h2>
              <p className="text-slate-700 leading-relaxed mb-8">
                {media.overview || media.description || 'Sem descrição disponível.'}
              </p>

              <div className="bg-slate-50 p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Faça sua avaliação</h2>
                <form onSubmit={handleSubmitRating} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nota (0 a 10)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={rating}
                      onChange={(e) => setRating(e.target.value)}
                      placeholder="8.5"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Comentário (opcional)
                    </label>
                    <textarea
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      placeholder="Compartilhe sua opinião..."
                      rows="4"
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Enviando...' : 'Enviar Avaliação'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaDetails;