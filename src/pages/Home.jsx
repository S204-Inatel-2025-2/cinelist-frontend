// src/pages/Home.jsx
import { useState, useEffect, useCallback } from 'react'; // Adicionado useCallback
import { useSearchParams, useNavigate } from 'react-router-dom'; // Adicionado useSearchParams
import { useUser } from '../context/UserContext';
import { useMessage } from '../hooks/useMessage';
import Message from '../components/Message';
import SearchBar from '../components/SearchBar';
import MediaCarousel from '../components/MediaCarousel';
import MediaCard from '../components/MediaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AddToListModal from '../components/AddToListModal';
import { getPopularMedia, searchMedia } from '../services/media';
import { getUserLists, addItemToList } from '../services/lists';

// Movido para fora do componente para estabilidade no useCallback
const normalizeAnimeData = (anime) => ({
  ...anime,
  type: 'anime',
  title: anime.title?.romaji || anime.title?.english || 'Sem título',
  overview: anime.description ? anime.description.replace(/<[^>]*>/g, '') : 'Sem descrição disponível.',
  poster_path: anime.coverImage?.large || anime.coverImage?.medium || null,
  backdrop_path: anime.bannerImage || anime.coverImage?.extraLarge || null,
  vote_average: anime.averageScore ? anime.averageScore / 10 : 0,
});

function Home() {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [anime, setAnime] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const { message, type, showMessage } = useMessage();

  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();

  // Adicionado para controle da URL
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q'); // 'q' é o nosso parâmetro de busca

  const [isAddToListModalOpen, setIsAddToListModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [userLists, setUserLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);

  // Lógica de busca extraída para useCallback
  const fetchSearchResults = useCallback(async (query) => {
    if (!query) return;
    setSearching(true);
    setSearchResults([]); // Limpa resultados antigos
    try {
      const response = await searchMedia(query);
      const resultsArray = response?.results || [];
      const normalizedResults = resultsArray.map(item =>
        item.type === 'anime' ? normalizeAnimeData(item) : item
      );
      setSearchResults(normalizedResults);
      if (resultsArray.length === 0) showMessage('Nenhum resultado encontrado', 'warning');
    } catch {
      showMessage('Erro ao buscar', 'error');
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, [showMessage]); // showMessage é uma dependência estável do hook

  // Lógica de carregar populares extraída para useCallback
  const loadAllMedia = useCallback(async () => {
    setLoading(true);
    setSearchResults([]); // Garante que a busca seja limpa
    try {
      const response = await getPopularMedia();
      const allMedia = response.results || [];
      setMovies(allMedia.filter(m => m.type === 'movie').slice(0, 10));
      setSeries(allMedia.filter(m => m.type === 'serie').slice(0, 10));
      setAnime(allMedia.filter(m => m.type === 'anime').slice(0, 10));
    } catch {
      showMessage('Erro ao carregar conteúdo', 'error');
    } finally {
      setLoading(false);
    }
  }, [showMessage]); // showMessage é uma dependência estável

  // useEffect modificado para decidir o que carregar
  useEffect(() => {
    if (urlQuery) {
      // Se a URL tem uma query, busca
      setLoading(false); // Para o loading inicial
      fetchSearchResults(urlQuery);
    } else {
      // Senão, carrega os populares
      loadAllMedia();
    }
    // Roda sempre que a query da URL ou as funções memoizadas mudarem
  }, [urlQuery, fetchSearchResults, loadAllMedia]);

  // handleSearch agora APENAS atualiza a URL
  // O useEffect acima vai reagir à mudança na URL e chamar fetchSearchResults
  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchParams({}); // Limpa a URL se a busca for vazia
    } else {
      setSearchParams({ q: query }); // Define a query 'q' na URL
    }
  };

  const handleOpenAddToListModal = async (media) => {
    if (!isAuthenticated || !user) {
      showMessage('Você precisa estar logado para adicionar itens a uma lista.', 'warning');
      // Guarda a intenção de adicionar e redireciona
      // (Você pode implementar uma lógica mais avançada de 'redirect' aqui se quiser)
      navigate('/login');
      return;
    }

    setSelectedMedia(media);
    setIsAddToListModalOpen(true);
    setLoadingLists(true);
    try {
      const lists = await getUserLists({ user_id: user.id });
      setUserLists(lists || []);
    } catch {
      showMessage('Erro ao buscar suas listas', 'error');
      setUserLists([]);
    } finally {
      setLoadingLists(false);
    }
  };

  const handleCloseModal = () => {
    setIsAddToListModalOpen(false);
    setSelectedMedia(null);
    setUserLists([]);
  };

  const handleSelectList = async (listId) => {
    if (loadingLists || !selectedMedia) return;
    setLoadingLists(true);
    try {
      const payload = {
        lista_id: listId,
        media_id: selectedMedia.id,
        media_type: selectedMedia.type === 'tv' ? 'serie' : selectedMedia.type,
        title: selectedMedia.title || selectedMedia.name,
        poster_path: selectedMedia.poster_path,
        backdrop_path: selectedMedia.backdrop_path,
        overview: selectedMedia.overview,
        vote_average: selectedMedia.vote_average,
        release_date: selectedMedia.release_date || null,
        first_air_date: selectedMedia.first_air_date || null,
        startDate: selectedMedia.startDate || null,
      };
      await addItemToList(payload);
      showMessage(`"${selectedMedia.title || selectedMedia.name}" adicionado à lista!`, 'success');
      handleCloseModal();
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Erro ao adicionar item';
      showMessage(errorMessage, 'error');
      setLoadingLists(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-slate-50"><LoadingSpinner text="Carregando conteúdo..." /></div>;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Message message={message} type={type} />
      
      <header className="bg-gradient-to-r from-blue-600 to-slate-900 text-white py-16 flex flex-col items-center justify-center text-center">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <h1 className="text-4xl font-bold mb-4">Bem-vindo ao CineList</h1>
          <p className="text-lg text-slate-300 mb-8">
            Explore, avalie e organize filmes, séries e animes em um só lugar.
          </p>
          <div className="flex justify-center">
            {/* Passa a query da URL de volta para o SearchBar */}
            <SearchBar onSearch={handleSearch} initialQuery={urlQuery || ''} />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1600px] mx-auto w-full px-6 lg:px-12 py-12">
        {searching ? (
          <LoadingSpinner text="Buscando..." />
        ) : searchResults.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Resultados da Busca</h2>
              {/* Botão agora limpa a URL */}
              <button onClick={() => setSearchParams({})} className="text-blue-600 hover:text-blue-700 font-medium">
                Limpar busca
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {searchResults.map((item) => (
                <MediaCard key={`${item.type}-${item.id}`} media={item} onAddToList={handleOpenAddToListModal} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {movies.length > 0 && <MediaCarousel title="Filmes Populares" items={movies} onAddToList={handleOpenAddToListModal} />}
            {series.length > 0 && <MediaCarousel title="Séries Populares" items={series} onAddToList={handleOpenAddToListModal} />}
            {anime.length > 0 && <MediaCarousel title="Animes Populares" items={anime.map(normalizeAnimeData)} onAddToList={handleOpenAddToListModal} />}
          </>
        )}
      </main>

      <AddToListModal
        isOpen={isAddToListModalOpen}
        onClose={handleCloseModal}
        lists={userLists}
        isLoading={loadingLists}
        onSelectList={handleSelectList}
      />
    </div>
  );
}

export default Home;