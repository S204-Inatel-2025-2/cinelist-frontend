// src/pages/Anime.jsx
import { useState, useEffect } from 'react';
import { Monitor } from 'lucide-react';
import { useMessage } from '../hooks/useMessage';
import Message from '../components/Message';
import SearchBar from '../components/SearchBar';
import MediaCard from '../components/MediaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getPopularAnime, searchAnime } from '../services/anime';

function Anime() {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const { message, type, showMessage } = useMessage();

  useEffect(() => {
    loadAnime();
  }, []);

  const loadAnime = async () => {
    setLoading(true);
    try {
      const data = await getPopularAnime();
      setAnime(data || []);
    } catch (error) {
      showMessage('Erro ao carregar animes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearching(true);
    try {
      const results = await searchAnime(query);
      setAnime(results || []);
      if (!results || results.length === 0) {
        showMessage('Nenhum anime encontrado', 'warning');
      }
    } catch (error) {
      showMessage('Erro ao buscar animes', 'error');
    } finally {
      setSearching(false);
    }
  };

  const handleAddToList = (media) => {
    showMessage(`"${media.title || media.name}" adicionado à lista!`, 'success');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LoadingSpinner text="Carregando animes..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Message message={message} type={type} />

      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Monitor className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Animes</h1>
          </div>
          <p className="text-center text-orange-100 mb-6">
            Explore os melhores animes
          </p>
          <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} placeholder="Buscar animes..." />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {searching ? (
          <LoadingSpinner text="Buscando animes..." />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {anime.length} {anime.length === 1 ? 'Anime' : 'Animes'}
              </h2>
              <button
                onClick={loadAnime}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Recarregar
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {anime.map((item) => (
                <MediaCard key={item.id} media={{ ...item, type: 'anime' }} onAddToList={handleAddToList} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Anime;