// src/components/MediaCard.jsx
import { useNavigate } from 'react-router-dom';
import { Star, Plus, Trash2, Loader2 } from 'lucide-react';

// ... (função getImageUrl - sem alterações)
const getImageUrl = (path) => {
  if (!path) {
    return null;
  }
  if (path.startsWith('http')) {
    return path;
  }
  return `https://image.tmdb.org/t/p/w500${path}`;
};

function MediaCard({ media, onAddToList, onRemoveFromList, listId, isSubmitting }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // ✨ 1. TRAVA ADICIONADA AQUI
    // Impede a navegação (clique na imagem ou no botão) se estiver enviando
    if (isSubmitting) return;

    if (listId) {
      navigate(`/lists/${listId}/item/${media.id}`, { state: { media } });
    } else {
      navigate(`/media/${media.id}`, { state: { media } });
    }
  };
  
  const title = typeof media.title === 'object' 
    ? media.title.romaji || media.title.english || 'Sem título' 
    : media.title || media.name;

  const imageUrl = getImageUrl(media.poster_path);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group h-full flex flex-col">
      {/* --- ÁREA DA IMAGEM CLICÁVEL --- */}
      <div
        // ✨ 2. CLASSE DE CURSOR ADICIONADA ✨
        className={`relative h-64 bg-slate-800 ${isSubmitting ? 'cursor-wait' : 'cursor-pointer'}`}
        onClick={handleClick}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            Sem Imagem
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* --- ÁREA DE CONTEÚDO --- */}
      <div className="p-4 flex flex-col flex-grow">
        {/* ... (título, tag, nota, descrição - sem alterações) ... */}
        <h3 className="font-bold text-lg mb-2 line-clamp-1 text-slate-900">
          {title}
        </h3>
        <span className="inline-block self-start px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-2">
          {media.type === 'movie' ? 'Filme' : media.type === 'serie' || media.type === 'tv' ? 'Série' : 'Anime'}
        </span>
        {(media.vote_average != null) && (
          <div className="flex items-center space-x-1 mb-3">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-slate-700">
              {(media.vote_average).toFixed(1)}
            </span>
          </div>
        )}
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-grow">
          {media.overview || media.description || 'Sem descrição disponível'}
        </p>

        {/* --- BOTÕES DE AÇÃO --- */}
        <div className="flex space-x-2 mt-auto">
          <button
            onClick={handleClick}
            disabled={isSubmitting} // ✨ 3. DISABLED ADICIONADO ✨
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600" // Estilos de disabled
          >
            Ver Detalhes
          </button>

          {/* Botão de Adicionar (sem alterações) */}
          {onAddToList && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToList(media);
              }}
              className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              title="Adicionar à lista"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}

          {/* Botão de Remover (Seu código aqui já estava correto) */}
          {onRemoveFromList && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemoveFromList(media);
              }}
              disabled={isSubmitting}
              className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-100"
              title="Remover da lista"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Trash2 className="w-5 h-5" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MediaCard;