// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { useMessage } from '../hooks/useMessage';
import Message from '../components/Message';
import SearchBar from '../components/SearchBar';
import MediaCarousel from '../components/MediaCarousel';
import MediaCard from '../components/MediaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getPopularMovies } from '../services/movies';
import { getPopularSeries } from '../services/series';
import { getPopularAnime } from '../services/anime';
import { searchMedia } from '../services/media';

function Home() {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [anime, setAnime] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const { message, type, showMessage } = useMessage();

  useEffect(() => {
    loadAllMedia();
  }, []);

  const loadAllMedia = async () => {
    setLoading(true);
    try {
      const [moviesData, seriesData, animeData] = await Promise.all([
        getPopularMovies().catch(() => []),
        getPopularSeries().catch(() => []),
        getPopularAnime().catch(() => []),
      ]);

      setMovies(moviesData.slice(0, 10) || []);
      setSeries(seriesData.slice(0, 10) || []);
      setAnime(animeData.slice(0, 10) || []);
    } catch (error) {
      showMessage('Erro ao carregar conteúdo', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) return;

    setSearching(true);
    try {
      const response = await searchMedia(query);
      
      const resultsArray = response?.results || [];

      const normalizedResults = resultsArray.map(item => 
        item.type === 'anime' ? normalizeAnimeData(item) : item
      );
      
      setSearchResults(normalizedResults);

      if (resultsArray.length === 0) {
        showMessage('Nenhum resultado encontrado', 'warning');
      }
    } catch (error) {
      showMessage('Erro ao buscar', 'error');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleAddToList = (media) => {
    showMessage(`"${media.title || media.name}" adicionado à lista!`, 'success');
  };

  // Função para padronizar os dados de animes
  const normalizeAnimeData = (anime) => ({
    ...anime,
    type: 'anime',
    title: anime.title?.romaji || anime.title?.english || 'Sem título',
    overview: anime.description ? anime.description.replace(/<[^>]*>/g, '') : 'Sem descrição disponível.',
    // Formata a data para YYYY-MM-DD, com fallback para mês/dia 1
    release_date: anime.startDate?.year
      ? `${anime.startDate.year}-${String(anime.startDate.month || 1).padStart(2, '0')}-${String(anime.startDate.day || 1).padStart(2, '0')}`
      : null,
    poster_path: anime.coverImage?.large || anime.coverImage?.medium || null,
    backdrop_path: anime.bannerImage || anime.coverImage?.extraLarge || null,
    // Normaliza a nota para uma escala de 0 a 10
    vote_average: anime.averageScore ? anime.averageScore / 10 : 0,
    genres: anime.genres ? anime.genres.map((g) => ({ id: g, name: g })) : [],
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LoadingSpinner text="Carregando conteúdo..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Message message={message} type={type} />

      <div className="bg-gradient-to-r from-blue-600 to-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
            Bem-vindo ao CineList
          </h1>
          <p className="text-xl text-center mb-8 text-blue-100">
            Descubra filmes, séries e animes incríveis
          </p>
          <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} placeholder="Buscar em todas as mídias..." />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {searching ? (
          <LoadingSpinner text="Buscando..." />
        ) : searchResults.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Resultados da Busca</h2>
              <button
                onClick={() => setSearchResults([])}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Limpar busca
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
              {searchResults.map((item) => (
                <MediaCard key={item.id} media={item} onAddToList={handleAddToList} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {movies.length > 0 && (
              <MediaCarousel title="Filmes Populares" items={movies} onAddToList={handleAddToList} />
            )}
            {series.length > 0 && (
              <MediaCarousel title="Séries Populares" items={series} onAddToList={handleAddToList} />
            )}
            {anime.length > 0 && (
              <MediaCarousel
                title="Animes Populares"
                items={anime.map(normalizeAnimeData)}
                onAddToList={handleAddToList}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;