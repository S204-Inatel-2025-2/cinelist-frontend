// src/pages/Anime.jsx
import { useState, useEffect } from 'react';
import { Monitor } from 'lucide-react';
import { useMessage } from '../hooks/useMessage';
import Message from '../components/Message';
import SearchBar from '../components/SearchBar';
import MediaCard from '../components/MediaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AddToListModal from '../components/AddToListModal';
import { getPopularAnime, searchAnime } from '../services/anime';
import { getUserLists, addItemToList } from '../services/lists';

function Anime() {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const { message, type, showMessage } = useMessage();

  // --- States para o Modal "Adicionar à Lista" ---
  const [isAddToListModalOpen, setIsAddToListModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [userLists, setUserLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);
  const FIXED_USER_ID = 10;

  useEffect(() => {
    loadAnime();
  }, []);

  const loadAnime = async () => {
    setLoading(true);
    try {
      const data = await getPopularAnime();
      setAnime((data || []).slice(0, 40));
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
      setAnime((results || []).slice(0, 40)); // CORREÇÃO: Usar 'results' em vez de 'data'
      if (!results || results.length === 0) {
        showMessage('Nenhum anime encontrado', 'warning');
      }
    } catch (error) {
      showMessage('Erro ao buscar animes', 'error');
    } finally {
      setSearching(false);
    }
  };

  // --- Funções para controlar o modal ---
  const handleOpenAddToListModal = async (media) => {
    setSelectedMedia(media);
    setIsAddToListModalOpen(true);
    setLoadingLists(true);
    try {
      const lists = await getUserLists({ user_id: FIXED_USER_ID });
      setUserLists(lists || []);
    } catch (error) {
      showMessage('Erro ao buscar suas listas', 'error');
    } finally {
      setLoadingLists(false);
    }
  };

  const handleCloseModal = () => {
    setIsAddToListModalOpen(false);
    setSelectedMedia(null);
  };

  const handleSelectList = async (listId) => {
    if (loadingLists) return;
    if (!selectedMedia) return;

    setLoadingLists(true);
    
    try {
      const payload = {
        lista_id: listId,
        media_id: selectedMedia.id,
        media_type: selectedMedia.type,
        title: selectedMedia.title || selectedMedia.name,
        poster_path: selectedMedia.poster_path,
        backdrop_path: selectedMedia.backdrop_path,
        overview: selectedMedia.overview,
        vote_average: selectedMedia.vote_average,
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

  const normalizeAnimeData = (anime) => ({
    ...anime,
    type: 'anime',
    title: anime.title?.romaji || anime.title?.english || 'Sem título',
    overview: anime.description ? anime.description.replace(/<[^>]*>/g, '') : 'Sem descrição disponível.',
    release_date: anime.startDate?.year
      ? `${anime.startDate.year}-${String(anime.startDate.month || 1).padStart(2, '0')}-${String(anime.startDate.day || 1).padStart(2, '0')}`
      : null,
    poster_path: anime.coverImage?.large || anime.coverImage?.medium || null,
    backdrop_path: anime.bannerImage || anime.coverImage?.extraLarge || null,
    vote_average: anime.averageScore ? anime.averageScore / 10 : 0,
    genres: anime.genres ? anime.genres.map((g) => ({ id: g, name: g })) : [],
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LoadingSpinner text="Carregando animes..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Message message={message} type={type} />

      <header className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-16 lg:py-18 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Monitor className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Animes</h1>
          </div>
          <p className="text-lg text-orange-100 mb-8"> Explore os melhores animes </p>
          <div className="flex justify-center mt-8">
            <SearchBar onSearch={handleSearch} placeholder="Buscar animes..." />
          </div>
        </div>
      </header>

      <main className="flex flex-col min-h-screen flex-1">
        <div className="max-w-[1600px] mx-auto w-full px-6 lg:px-12 mt-12 mb-12">
          {searching ? (
            <LoadingSpinner text="Buscando animes..." />
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  {anime.length} {anime.length === 1 ? 'Anime' : 'Animes'}
                </h2>
                <button
                  onClick={loadAnime}
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  Recarregar
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {anime.map((item) => (
                  <MediaCard
                    key={item.id}
                    media={normalizeAnimeData(item)}
                    onAddToList={handleOpenAddToListModal}
                  />
                ))}
              </div>
            </>
          )}
        </div>
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

export default Anime;