import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link, useSearchParams, useLocation } from 'react-router-dom';
import { List, ArrowLeft, Film, Tv, Monitor } from 'lucide-react';
import { getList } from '../services/lists';
import LoadingSpinner from '../components/LoadingSpinner';
import AnotherUserMediaCard from '../components/AnotherUserMediaCard';

const filterOptions = {
  'all': { label: 'Todos', icon: List },
  'movie': { label: 'Filmes', icon: Film },
  'serie': { label: 'Séries', icon: Tv },
  'anime': { label: 'Animes', icon: Monitor },
};

const filterOrder = ['all', 'movie', 'serie', 'anime'];

const isValidFilter = (filter) => filter && filterOptions[filter];

function AnotherUserListDetails() {
  const [listData, setListData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id: listId } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const profileUser = location.state?.profileUser;

  const initialFilter = searchParams.get('filter') || 'all';
  const [activeFilter, setActiveFilter] = useState(
    isValidFilter(initialFilter) ? initialFilter : 'all'
  );

  useEffect(() => {
      const currentUrlFilter = searchParams.get('filter') || 'all';
      if (isValidFilter(currentUrlFilter) && currentUrlFilter !== activeFilter) {
          setActiveFilter(currentUrlFilter);
      }
      else if ((!searchParams.has('filter') || !isValidFilter(currentUrlFilter)) && activeFilter !== 'all') {
           setActiveFilter('all');
      }
  }, [searchParams, activeFilter]);


  const handleFilterChange = (newFilter) => {
    if (isValidFilter(newFilter)) {
      setActiveFilter(newFilter);
      setSearchParams({ filter: newFilter });
    }
  };

  const normalizeItemData = (item) => {
    return {
      ...item,
      type: item.type || item.media_type,
      title: typeof item.title === 'object' && item.title !== null
        ? item.title.romaji || item.title.english || item.name || 'Sem título'
        : item.title || item.name || 'Sem título',
       id: item.movie_id || item.serie_id || item.anime_id || item.id,
    };
  };

  const fetchListDetails = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getList({ lista_id: parseInt(listId) });

      if (profileUser && data.user_id !== profileUser.id) {
        console.warn(`List ${listId} does not belong to user ${profileUser.id}`);
        throw new Error("Permission denied or list mismatch");
      }
      setListData(data);
    } catch (error) {
      console.error("Error loading list details:", error);
      setListData(null);
    } finally {
      setLoading(false);
    }
  }, [listId, profileUser]);

  useEffect(() => {
    fetchListDetails();
  }, [fetchListDetails]);

  useEffect(() => {
    if (location.state?.previousFilter && isValidFilter(location.state.previousFilter)) {
       handleFilterChange(location.state.previousFilter);
       navigate(location.pathname, { replace: true, state: {} });
     }
   }, [location.state, navigate]);

  const sortedAndNormalizedItems = useMemo(() => {
    if (!listData || !listData.itens) {
      return [];
    }
    const normalized = listData.itens.map(normalizeItemData);
    return normalized.sort((a, b) => {
      const titleA = a.title || '';
      const titleB = b.title || '';
      return titleA.localeCompare(titleB);
    });
  }, [listData]);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'all') {
      return sortedAndNormalizedItems;
    }
    return sortedAndNormalizedItems.filter(item => item.type === activeFilter);
  }, [sortedAndNormalizedItems, activeFilter]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <LoadingSpinner text="Carregando lista..." />
      </div>
    );
  }

   if (!listData || (profileUser && listData.user_id !== profileUser.id)) {
    return (
      <div className="min-h-screen bg-slate-50 text-center py-20 px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">
            {profileUser && listData && listData.user_id !== profileUser.id
             ? "Acesso Negado"
             : "Lista não encontrada"}
        </h2>
         <p className="text-slate-600 mb-6">
            {profileUser && listData && listData.user_id !== profileUser.id
             ? "Você não tem permissão para ver esta lista."
             : "A lista que você está procurando não existe ou pode ter sido removida."}
        </p>
        <Link
          to={profileUser ? `/users/${profileUser.id}` : '/users'}
          className="mt-4 inline-flex items-center text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {profileUser ? `Voltar para o perfil do Usuário` : 'Voltar'}
        </Link>
      </div>
    );
  }

  const renderFilterButtons = () => (
    <div className="flex flex-wrap gap-3 mb-8">
      {filterOrder.map((key) => {
        const { label, icon: Icon } = filterOptions[key];
        const isActive = activeFilter === key;
        const baseClasses = "flex items-center justify-center space-x-2 px-4 py-2 rounded-xl font-semibold transition-all duration-200 border-2";
        const activeClasses = "bg-slate-800 text-white border-slate-800 shadow-md";
        const inactiveClasses = "bg-white text-slate-700 border-slate-300 hover:bg-slate-100 hover:border-slate-400";
        return (
          <button
            key={key}
            className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
            onClick={() => handleFilterChange(key)}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Banner */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-12 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-12">
          <Link
            to={`/users/${listData.user_id}`}
            className="mb-4 inline-flex items-center text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
           Voltar para o perfil do Usuário
          </Link>
          <div className="flex items-center space-x-3 mb-2">
            <List className="w-8 h-8" />
            <h1 className="text-4xl font-bold">{listData.nome}</h1>
          </div>
          {listData.description && (
            <p className="text-slate-300 max-w-2xl">{listData.description}</p>
          )}
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 lg:px-12 py-12">

        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {filteredItems.length}
          {' '}
          {
            activeFilter === 'movie' ? (filteredItems.length === 1 ? 'Filme na Lista' : 'Filmes na Lista') :
            activeFilter === 'serie' ? (filteredItems.length === 1 ? 'Série na Lista' : 'Séries na Lista') :
            activeFilter === 'anime' ? (filteredItems.length === 1 ? 'Anime na Lista' : 'Animes na Lista') :
            (filteredItems.length === 1 ? 'Item na Lista' : 'Itens na Lista')
          }
        </h2>

        {listData.itens && listData.itens.length > 0 ? (
          <>
            {renderFilterButtons()}

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                {filteredItems.map((item) => (
                  // Use the view-only card
                  <AnotherUserMediaCard
                    key={`${item.type}-${item.id}`} 
                    media={item}
                    listId={listId}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                   <h3 className="text-xl font-bold text-slate-900 mb-2">
                     Nenhum item encontrado
                   </h3>
                   <p className="text-slate-600">
                     Não há mídias do tipo "{filterOptions[activeFilter].label}" nesta lista.
                   </p>
                </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <List className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Lista Vazia
            </h3>
            <p className="text-slate-600">
              Este usuário ainda não adicionou itens a esta lista.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AnotherUserListDetails;