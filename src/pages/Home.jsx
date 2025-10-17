import { useState, useEffect } from 'react';
import { useMessage } from '../hooks/useMessage';
import Message from '../components/Message';
import SearchBar from '../components/SearchBar';
import MediaCarousel from '../components/MediaCarousel';
import MediaCard from '../components/MediaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AddToListModal from '../components/AddToListModal'; // 1. Import the new modal component
import { getPopularMedia, searchMedia } from '../services/media';
import { getUserLists, addItemToList } from '../services/lists'; // 2. Import list services

function Home() {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [anime, setAnime] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const { message, type, showMessage } = useMessage();

  // --- States for "Add to List" Modal ---
  const [isAddToListModalOpen, setIsAddToListModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [userLists, setUserLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const FIXED_USER_ID = 10;

  useEffect(() => {
    loadAllMedia();
  }, []);

  const loadAllMedia = async () => {
    setLoading(true);
    try {
      const response = await getPopularMedia();
      const allMedia = response.results || [];

      setMovies(allMedia.filter(m => m.type === 'movie').slice(0, 10));
      setSeries(allMedia.filter(m => m.type === 'serie').slice(0, 10));
      setAnime(allMedia.filter(m => m.type === 'anime').slice(0, 10));
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

  // --- Functions to control the "Add to List" modal ---
  
  // 3. Opens the modal and fetches user's lists
  const handleOpenAddToListModal = async (media) => {
    setSelectedMedia(media);
    setIsAddToListModalOpen(true);
    setLoadingLists(true);
    try {
      const lists = await getUserLists({ user_id: FIXED_USER_ID });
      setUserLists(lists || []);
    } catch (error) {
      showMessage('Erro ao buscar suas listas', 'error');
      setUserLists([]); // Ensure lists are cleared on error
    } finally {
      setLoadingLists(false);
    }
  };

  // 4. Closes the modal and resets states
  const handleCloseModal = () => {
    setIsAddToListModalOpen(false);
    setSelectedMedia(null);
    setUserLists([]);
  };

  // 5. Called when a list is selected inside the modal
  const handleSelectList = async (listId) => {
    if (!selectedMedia) return;
    try {
      const payload = {
        lista_id: listId,
        media_id: selectedMedia.id,
        media_type: selectedMedia.type,
      };
      await addItemToList(payload);
      showMessage(`"${selectedMedia.title || selectedMedia.name}" adicionado à lista!`, 'success');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Erro ao adicionar item';
      showMessage(errorMessage, 'error');
    } finally {
      handleCloseModal();
    }
  };

  const normalizeAnimeData = (anime) => ({
    // ...your existing normalize function...
    ...anime,
    type: 'anime',
    title: anime.title?.romaji || anime.title?.english || 'Sem título',
    overview: anime.description ? anime.description.replace(/<[^>]*>/g, '') : 'Sem descrição disponível.',
    release_date: anime.startDate?.year ? `${anime.startDate.year}-${String(anime.startDate.month || 1).padStart(2, '0')}-${String(anime.startDate.day || 1).padStart(2, '0')}`: null,
    poster_path: anime.coverImage?.large || anime.coverImage?.medium || null,
    backdrop_path: anime.bannerImage || anime.coverImage?.extraLarge || null,
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
      
      {/* --- Header Section (No changes) --- */}
      <div className="bg-gradient-to-r from-blue-600 to-slate-900 text-white py-16">
        {/* ... */}
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {searching ? (
          <LoadingSpinner text="Buscando..." />
        ) : searchResults.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Resultados da Busca</h2>
              <button onClick={() => setSearchResults([])} className="text-blue-600 hover:text-blue-700 font-medium">
                Limpar busca
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
              {searchResults.map((item) => (
                // 6. Pass the new function to MediaCard
                <MediaCard key={`${item.type}-${item.id}`} media={item} onAddToList={() => handleOpenAddToListModal(item)} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {movies.length > 0 && (
              <MediaCarousel
                title="Filmes Populares"
                items={movies}
                // 6. Pass the new function to MediaCarousel
                onAddToList={handleOpenAddToListModal}
              />
            )}
            {series.length > 0 && (
              <MediaCarousel
                title="Séries Populares"
                items={series}
                onAddToList={handleOpenAddToListModal}
              />
            )}
            {anime.length > 0 && (
              <MediaCarousel
                title="Animes Populares"
                items={anime.map(normalizeAnimeData)}
                onAddToList={handleOpenAddToListModal}
              />
            )}
          </>
        )}
      </div>

      {/* 7. Render the modal at the end of the page */}
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