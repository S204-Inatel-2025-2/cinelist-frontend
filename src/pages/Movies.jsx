import { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import { useMessage } from '../hooks/useMessage';
import Message from '../components/Message';
import SearchBar from '../components/SearchBar';
import MediaCard from '../components/MediaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getPopularMovies, searchMovies } from '../services/movies';

// Função auxiliar para remover duplicatas pelo ID (está correta)
const removeDuplicatesById = (mediaList) => {
  if (!Array.isArray(mediaList)) return [];
  const mediaMap = new Map();
  mediaList.forEach(media => {
    mediaMap.set(media.id, media);
  });
  return Array.from(mediaMap.values());
};

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const { message, type, showMessage } = useMessage();

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const data = await getPopularMovies();
      // CORREÇÃO: Aplicar a função diretamente em 'data', não em 'data.results'
      const uniqueMovies = removeDuplicatesById(data || []);
      setMovies(uniqueMovies.slice(0, 40));
    } catch (error) {
      showMessage('Erro ao carregar filmes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      loadMovies();
      return;
    }
    setSearching(true);
    try {
      const results = await searchMovies(query);
      // CORREÇÃO: Aplicar a função diretamente em 'results', não em 'results.results'
      const uniqueMovies = removeDuplicatesById(results || []);
      setMovies(uniqueMovies.slice(0, 40));

      if (uniqueMovies.length === 0) {
        showMessage('Nenhum filme encontrado', 'warning');
      }
    } catch (error) {
      showMessage('Erro ao buscar filmes', 'error');
    } finally {
      setSearching(false);
    }
  };

  const handleAddToList = (media) => {
    const title = media.title || media.name;
    showMessage(`"${title}" adicionado à lista!`, 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LoadingSpinner text="Carregando filmes..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Message message={message} type={type} />

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Film className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Filmes</h1>
          </div>
          <p className="text-center text-blue-100 mb-6">
            Explore os melhores filmes
          </p>
          <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} placeholder="Buscar filmes..." />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {searching ? (
          <LoadingSpinner text="Buscando filmes..." />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {movies.length} {movies.length === 1 ? 'Filme' : 'Filmes'}
              </h2>
              <button
                onClick={loadMovies}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Recarregar Populares
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {movies.map((movie) => (
                <MediaCard key={movie.id} media={{ ...movie, type: 'movie' }} onAddToList={handleAddToList} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Movies;