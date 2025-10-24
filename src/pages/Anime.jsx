// src/pages/Anime.jsx
import { useState, useEffect, useCallback } from 'react'; // Adicionado useCallback
import { useSearchParams, useNavigate } from 'react-router-dom'; // Adicionado useSearchParams
import { useUser } from '../context/UserContext';
import { Monitor } from 'lucide-react';
import { useMessage } from '../hooks/useMessage';
import Message from '../components/Message';
import SearchBar from '../components/SearchBar';
import MediaCard from '../components/MediaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AddToListModal from '../components/AddToListModal';
import { getPopularAnime, searchAnime } from '../services/anime';
import { getUserLists, addItemToList } from '../services/lists';

// Movido para fora do componente para estabilidade no useCallback
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

function Anime() {
  const [anime, setAnime] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const { message, type, showMessage } = useMessage();

  // Adicionado para controle da URL
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q');
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();

  // --- States para o Modal "Adicionar à Lista" ---
  const [isAddToListModalOpen, setIsAddToListModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [userLists, setUserLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);

  // Envolvido em useCallback
  const loadAnime = useCallback(async () => {
    setLoading(true);
    setSearching(false); // Garante que o estado de busca seja resetado
    try {
      const data = await getPopularAnime();
      setAnime((data || []).slice(0, 40));
    } catch (error) {
      showMessage('Erro ao carregar animes', 'error');
    } finally {
      setLoading(false);
    }
  }, [showMessage]); // Dependência

  // Nova função de busca envolvida em useCallback
  const fetchAnimeSearch = useCallback(async (query) => {
    setSearching(true);
    setLoading(false); // Para o spinner de loading principal
    try {
      const results = await searchAnime(query);
      setAnime((results || []).slice(0, 40));
      if (!results || results.length === 0) {
        showMessage('Nenhum anime encontrado', 'warning');
      }
    } catch (error) {
      showMessage('Erro ao buscar animes', 'error');
    } finally {
      setSearching(false);
    }
  }, [showMessage]); // Dependência

  // useEffect modificado para usar a URL
  useEffect(() => {
    if (urlQuery) {
      fetchAnimeSearch(urlQuery);
    } else {
      loadAnime();
    }
  }, [urlQuery, loadAnime, fetchAnimeSearch]); // Dependências atualizadas

  // handleSearch agora APENAS atualiza a URL
  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchParams({}); // Limpa a busca
    } else {
      setSearchParams({ q: query }); // Define a busca na URL
    }
  };

  // --- Funções para controlar o modal ---
  const handleOpenAddToListModal = async (media) => {
    if (!isAuthenticated || !user) {
        showMessage('Você precisa estar logado para adicionar itens a uma lista.', 'warning');
        navigate('/login');
        return;
    }

    setSelectedMedia(media);
    setIsAddToListModalOpen(true);
    setLoadingLists(true);
    try {
      const lists = await getUserLists({ user_id: user.id });
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
    if (loadingLists || !selectedMedia) return;
    
    if (!isAuthenticated || !user) {
        showMessage('Sessão expirada. Faça login novamente.', 'warning');
        navigate('/login');
        return;
    }

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

  // A função normalizeAnimeData foi movida para fora do componente

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
            {/* Passa initialQuery para o SearchBar */}
            <SearchBar onSearch={handleSearch} placeholder="Buscar animes..." initialQuery={urlQuery || ''} />
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
                  {/* Atualiza o título baseado na busca */}
                  {urlQuery ? `${anime.length} resultados para "${urlQuery}"` : `${anime.length} Animes Populares`}
                </h2>
                {/* Botão agora limpa a URL para recarregar populares */}
                <button
                  onClick={() => setSearchParams({})}
                  className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  {urlQuery ? "Limpar Busca" : "Recarregar Populares"}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {anime.map((item) => (
                  <MediaCard
                    key={item.id}
                    media={normalizeAnimeData(item)} // Normalização ainda necessária aqui
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