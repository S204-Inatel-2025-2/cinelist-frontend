// src/components/MediaCard.jsx
import { useNavigate } from 'react-router-dom';
import { Star, Plus } from 'lucide-react';

function MediaCard({ media, onAddToList }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/media/${media.id}`, { state: { media } });
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <div
        className="relative h-64 bg-gradient-to-br from-slate-700 to-slate-900 cursor-pointer"
        onClick={handleClick}
      >
        {media.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
            alt={media.title || media.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-1 text-slate-900">
          {media.title || media.name}
        </h3>

        {media.type && (
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mb-2">
            {media.type === 'movie' ? 'Filme' : media.type === 'tv' ? 'Série' : 'Anime'}
          </span>
        )}

        {(media.vote_average || media.rating || media.score) && (
          <div className="flex items-center space-x-1 mb-3">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-slate-700">
              {(media.vote_average || media.rating || media.score).toFixed(1)}
            </span>
          </div>
        )}

        <p className="text-sm text-slate-600 line-clamp-2 mb-4">
          {media.overview || media.description || 'Sem descrição disponível'}
        </p>

        <div className="flex space-x-2">
          <button
            onClick={handleClick}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver Detalhes
          </button>
          {onAddToList && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToList(media);
              }}
              className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MediaCard;