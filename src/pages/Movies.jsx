// src/pages/Movies.jsx
import { useState, useEffect, useCallback } from 'react'; // Adicionado useCallback
import { useSearchParams, useNavigate } from 'react-router-dom'; // Adicionado useSearchParams
import { Film } from 'lucide-react';    
import { useUser } from '../context/UserContext';
import { useMessage } from '../hooks/useMessage';
import Message from '../components/Message';
import SearchBar from '../components/SearchBar';
import MediaCard from '../components/MediaCard';
import LoadingSpinner from '../components/LoadingSpinner';
import AddToListModal from '../components/AddToListModal';
import { getPopularMovies, searchMovies } from '../services/movies';
import { getUserLists, addItemToList } from '../services/lists';

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
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();

  // Adicionado para controle da URL
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get('q');

  // --- States para o Modal "Adicionar à Lista" ---
  const [isAddToListModalOpen, setIsAddToListModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [userLists, setUserLists] = useState([]);
  const [loadingLists, setLoadingLists] = useState(false);

  // Envolvido em useCallback
  const loadMovies = useCallback(async () => {
    setLoading(true);
    setSearching(false); // Garante que o estado de busca seja resetado
    try {
      const data = await getPopularMovies();
      const uniqueMovies = removeDuplicatesById(data || []);
      setMovies(uniqueMovies.slice(0, 40));
    } catch (error) {
      showMessage('Erro ao carregar filmes', 'error');
    } finally {
      setLoading(false);
    }
  }, [showMessage]); // Dependência

  // Nova função de busca envolvida em useCallback
  const fetchMovieSearch = useCallback(async (query) => {
    setSearching(true);
    setLoading(false); // Para o spinner de loading principal
    try {
      const results = await searchMovies(query);
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
  }, [showMessage]); // Dependência

  // useEffect modificado para usar a URL
  useEffect(() => {
    if (urlQuery) {
      fetchMovieSearch(urlQuery);
    } else {
      loadMovies();
    }
  }, [urlQuery, loadMovies, fetchMovieSearch]); // Dependências atualizadas

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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LoadingSpinner text="Carregando filmes..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Message message={message} type={type} />

      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 lg:py-18 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Film className="w-10 h-10" />
            <h1 className="text-4xl font-bold">Filmes</h1>
          </div>
          <p className="text-lg text-blue-100 mb-8">
            Explore os melhores filmes
          </p>
          <div className="flex justify-center mt-8">
            {/* Passa initialQuery para o SearchBar */}
            <SearchBar onSearch={handleSearch} placeholder="Buscar filmes..." initialQuery={urlQuery || ''} />
          </div>
        </div>
      </header>

      <main className="flex flex-col min-h-screen flex-1">
        <div className="max-w-[1600px] mx-auto w-full px-6 lg:px-12 mt-12 mb-12">
          {searching ? (
            <LoadingSpinner text="Buscando filmes..." />
          ) : (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-900">
                  {/* Atualiza o título baseado na busca */}
                  {urlQuery ? `${movies.length} resultados para "${urlQuery}"` : `${movies.length} Filmes Populares`}
                </h2>
                {/* Botão agora limpa a URL para recarregar populares */}
                <button
                  onClick={() => setSearchParams({})}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  {urlQuery ? "Limpar Busca" : "Recarregar Populares"}
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {movies.map((movie) => (
                  <MediaCard key={movie.id} media={{ ...movie, type: 'movie' }} onAddToList={handleOpenAddToListModal} />
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

export default Movies;