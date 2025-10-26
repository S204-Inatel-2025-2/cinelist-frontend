// src/components/AnotherRatedCard.jsx
import { useNavigate } from 'react-router-dom';
import { Star, Calendar } from 'lucide-react';

// Função para tratar URLs de imagem (pode ser movida para um utils se usada em mais lugares)
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `https://image.tmdb.org/t/p/w500${path}`;
};

function AnotherUserRatedCard({ media }) { // Renomeado
  const navigate = useNavigate();

  // NAVEGA PARA A NOVA ROTA '/user-rated/...'
  const handleClick = () => {
    navigate(`/user-rated/${media.type}/${media.id}`, { state: { media } });
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
      {/* Imagem (igual ao MediaRatedCard) */}
      <div className="relative h-64 bg-slate-800 cursor-pointer" onClick={handleClick}>
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

      {/* Conteúdo do Card */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-2 line-clamp-1 text-slate-900">
          {title}
        </h3>

        {/* Tipo e Ano (igual ao MediaRatedCard) */}
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

        {/* Mostra a nota */}
        {(media.vote_average != null) && (
          <div className="flex items-center space-x-1 mb-3">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-slate-700">
              {/* TEXTO ALTERADO */}
              Nota do usuário: {media.vote_average.toFixed(1)}
            </span>
          </div>
        )}

        {/* Mostra o Comentário (igual ao MediaRatedCard) */}
        {media.comment ? (
          <blockquote className="mb-4 flex-grow border-l-4 border-slate-300 py-1 pl-3 text-sm italic text-slate-700 line-clamp-3">
            "{media.comment}"
          </blockquote>
        ) : (
           // Mostra "nenhum comentário" apenas se houver uma nota
           media.vote_average != null && (
            <p className="mb-4 flex-grow text-sm italic text-slate-500">
                Nenhum comentário adicionado.
            </p>
           )
        )}
         {/* Mostra se não houver avaliação */}
         {media.vote_average == null && (
            <p className="mb-4 flex-grow text-sm italic text-slate-500">
                Sem avaliação.
            </p>
         )}


        {/* Botão Ver Detalhes (igual ao MediaRatedCard, mas chama o handleClick modificado) */}
        <div className="mt-auto">
          <button
            onClick={handleClick}
            className="w-full px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver Detalhes
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnotherUserRatedCard;