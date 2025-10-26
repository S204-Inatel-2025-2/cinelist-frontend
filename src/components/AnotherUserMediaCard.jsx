// src/components/AnotherUserMediaCard.jsx
import { useNavigate } from 'react-router-dom';
import { Star, Calendar } from 'lucide-react';

const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `https://image.tmdb.org/t/p/w500${path}`;
};

function AnotherUserMediaCard({ media, listId }) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Navega para a rota do item, passando APENAS 'media' no state
    navigate(`/user-lists/${listId}/item/${media.id}`, {
      state: { media } // Removido: currentFilter: activeFilter
    });
  };

  const title = typeof media.title === 'object'
    ? media.title.romaji || media.title.english || 'Sem título'
    : media.title || media.name;

  const imageUrl = getImageUrl(media.poster_path);

  let year = null;
  const dateString = media.release_date || media.first_air_date;
  if (dateString && dateString.length >= 4) {
    year = dateString.substring(0, 4);
  } else if (media.startDate?.year) {
    year = media.startDate.year;
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group h-full flex flex-col">
      {/* Imagem clicável (sem checagem de isSubmitting) */}
      <div
        className="relative h-64 bg-slate-800 cursor-pointer"
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

      {/* Área de conteúdo */}
      <div className="p-4 flex flex-col flex-grow">

        {/* Título */}
        <h3 className="font-bold text-lg mb-2 line-clamp-1 text-slate-900">
          {title}
        </h3>

        {/* Tipo e Ano */}
        <div className="flex items-center justify-between text-xs font-medium mb-2">
          <span className="inline-block self-start px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
            {media.type === 'movie' ? 'Filme' : media.type === 'serie' || media.type === 'tv' ? 'Série' : 'Anime'}
          </span>
          {year && (
            <div className="flex items-center space-x-1 text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>{year}</span>
            </div>
          )}
        </div>

        {/* Nota */}
        {(media.vote_average != null && media.vote_average > 0) && ( // Adicionado > 0 para não mostrar nota 0.0
          <div className="flex items-center space-x-1 mb-3">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-slate-700">
              {(media.vote_average).toFixed(1)}
            </span>
          </div>
        )}

        {/* Descrição */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-grow">
          {media.overview || media.description || 'Sem descrição disponível'}
        </p>

        {/* Botão de Ação (Apenas Ver Detalhes) */}
        <div className="mt-auto"> {/* Removido flex space-x-2 */}
          <button
            onClick={handleClick}
            className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver Detalhes
          </button>
          {/* Botões de Adicionar e Remover foram RETIRADOS */}
        </div>
      </div>
    </div>
  );
}

export default AnotherUserMediaCard;