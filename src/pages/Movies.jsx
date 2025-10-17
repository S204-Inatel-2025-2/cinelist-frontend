// src/pages/Movies.js
import { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import { useMessage } from '../hooks/useMessage';
import Message from '../components/Message';
import SearchBar from '../components/SearchBar';
import MediaCard from '../components/MediaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getPopularMovies, searchMovies } from '../services/movies';

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
      setMovies(data || []);
    } catch (error) {
      showMessage('Erro ao carregar filmes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearching(true);
    try {
      const results = await searchMovies(query);
      setMovies(results || []);
      if (!results || results.length === 0) {
        showMessage('Nenhum filme encontrado', 'warning');
      }
    } catch (error) {
      showMessage('Erro ao buscar filmes', 'error');
    } finally {
      setSearching(false);
    }
  };

  const handleAddToList = (media) => {
    showMessage(`"${media.title}" adicionado à lista!`, 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LoadingSpinner text="Carregando filmes..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Message message={message} type={type} />

      {/* Banner superior */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Film className="w-10 h-10" />
              <h1 className="text-4xl font-bold">Filmes</h1>
            </div>
            <p className="text-blue-100 text-lg mb-8">
              Explore os melhores filmes da atualidade
            </p>
            <div className="flex justify-center w-full max-w-md">
              <SearchBar onSearch={handleSearch} placeholder="Buscar filmes..." />
            </div>
          </div>
        </div>
      </div>

      {/* Listagem */}
      <div className="flex-1 max-w-[1600px] mx-auto px-8 lg:px-12 pt-16 pb-12">
        {searching ? (
          <LoadingSpinner text="Buscando filmes..." />
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                {movies.length} {movies.length === 1 ? 'Filme' : 'Filmes'}
              </h2>
              <button
                onClick={loadMovies}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                Recarregar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {movies.map((movie) => (
                <MediaCard
                  key={movie.id}
                  media={{ ...movie, type: 'movie' }}
                  onAddToList={handleAddToList}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Movies;