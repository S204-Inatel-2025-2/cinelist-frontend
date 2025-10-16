// src/pages/MediaRatedDetails.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ArrowLeft, Star, Calendar, Clock, Trash2, Edit } from 'lucide-react';
import { useMessage } from '../hooks/useMessage';
import Message from '../components/Message';
// Supondo que você criará essas funções no seu arquivo de serviço
import { updateRating, deleteRating } from '../services/media'; 

function MediaRatedDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type: mediaType, id: mediaId } = useParams();
  const media = location.state?.media;
  const { message, type, showMessage } = useMessage();

  // Pré-popula o estado com a avaliação existente
  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (media) {
      setRating(media.vote_average || '');
      setReview(media.comment || '');
    }
  }, [media]);


  // Funções de utilidade (iguais às do MediaDetails)
  const getMediaTitle = (media) => {
    if (!media) return 'Título indisponível';
    return media.title || media.name || 'Título desconhecido';
  };

  const getImageUrl = (path, quality = 'w500') => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `https://image.tmdb.org/t/p/${quality}${path}`;
  };

  // Handler para ATUALIZAR a avaliação
  const handleUpdateRating = async (e) => {
    e.preventDefault();
    if (!rating || rating < 0 || rating > 10) {
      return showMessage('Por favor, insira uma nota entre 0 e 10.', 'error');
    }

    setSubmitting(true);
    try {
      const payload = {
        media_type: mediaType,
        media_id: parseInt(mediaId, 10),
        rating: parseFloat(rating),
        comment: review.trim(),
        user_id: 10, // User ID fixo
      };

      // Chama o serviço de atualização
      await updateRating(payload); 
      showMessage('Avaliação atualizada com sucesso!', 'success');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Erro ao atualizar avaliação.';
      showMessage(errorMessage, 'error');
      console.error("Erro ao atualizar:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handler para DELETAR a avaliação
  const handleDeleteRating = async () => {
    // Confirmação antes de deletar
    if (!window.confirm('Tem certeza que deseja deletar esta avaliação?')) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        media_type: mediaType,
        media_id: parseInt(mediaId, 10),
        user_id: 10, // User ID fixo
      };
      
      // Chama o serviço de exclusão
      await deleteRating(payload);
      showMessage('Avaliação deletada com sucesso!', 'success');
      
      // Redireciona de volta para o perfil após um pequeno delay
      setTimeout(() => navigate('/profile'), 1500);

    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Erro ao deletar avaliação.';
      showMessage(errorMessage, 'error');
      console.error("Erro ao deletar:", error);
      setSubmitting(false);
    }
  };


  if (!media) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Mídia avaliada não encontrada</h2>
          <button
            onClick={() => navigate('/profile')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Voltar para o Perfil
          </button>
        </div>
      </div>
    );
  }

  const backdropUrl = getImageUrl(media.backdrop_path, 'original');
  const posterUrl = getImageUrl(media.poster_path, 'w500');

  return (
    // A estrutura visual é praticamente a mesma do MediaDetails
    <div className="min-h-screen bg-slate-50">
      <Message message={message} type={type} />

      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 left-4 z-10 p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <ArrowLeft className="w-6 h-6 text-slate-700" />
      </button>

      {/* Backdrop e Header */}
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
              <h1 className="text-4xl font-bold text-slate-900 mb-4">{getMediaTitle(media)}</h1>
              {/* ... outras informações da mídia (gêneros, data, etc.) ... */}
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Sinopse</h2>
              <p className="text-slate-700 leading-relaxed mb-8">
                {media.overview || 'Sem descrição disponível.'}
              </p>

              {/* Formulário Modificado */}
              <div className="bg-slate-50 p-6 rounded-xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Editar sua avaliação</h2>
                <form onSubmit={handleUpdateRating} className="space-y-4">
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

                  {/* Botões de Ação */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full flex justify-center items-center gap-2 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Edit className="w-5 h-5" />
                      {submitting ? 'Atualizando...' : 'Atualizar Avaliação'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteRating}
                      disabled={submitting}
                      className="w-full flex justify-center items-center gap-2 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-5 h-5" />
                      Deletar Avaliação
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MediaRatedDetails;