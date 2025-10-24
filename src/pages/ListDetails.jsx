// src/pages/ListDetails.jsx
import { useState, useEffect, useCallback,useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Adicionado useSearchParams
import { useUser } from '../context/UserContext';
import { List, ArrowLeft } from 'lucide-react';
import { getList, deleteListItem } from '../services/lists';
import { useMessage } from '../hooks/useMessage';
import Message from '../components/Message';
import LoadingSpinner from '../components/LoadingSpinner';
import MediaCard from '../components/MediaCard';

function ListDetails() {
  const [listData, setListData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { id } = useParams();
  const { message, type, showMessage } = useMessage();
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();

  // Função para padronizar os dados dos itens da lista
  const normalizeItemData = (item) => {
    // Primeiro, padroniza a propriedade 'type'
    const baseData = {
      ...item,
      type: item.media_type,
    };

    // Se for um anime, aplica a normalização específica
    if (baseData.type === 'anime') {
      return {
        ...baseData, // Mantém o vote_average que já veio do backend
        title: item.title?.romaji || item.title?.english || 'Sem título',
        overview: item.description ? item.description.replace(/<[^>]*>/g, '') : 'Sem descrição.',
        // As linhas de poster_path e backdrop_path também já foram removidas na etapa anterior
        // A linha de vote_average foi REMOVIDA AGORA
      };
    }
      // Para filmes e séries, apenas retorna com o 'type' ajustado
    return baseData;
  };

  // Função para buscar os detalhes da lista
  const fetchListDetails = useCallback(async () => {
    // Adicionado check inicial - se não estiver logado, não busca
    if (!isAuthenticated) {
      showMessage('Você precisa estar logado para ver os detalhes da lista.', 'warning');
      navigate('/login');
      return;
    }
    setLoading(true); // Garante que o loading comece aqui
    try {
      const data = await getList({ lista_id: parseInt(id) });
      // TODO: Idealmente, o backend deveria validar se a lista pertence ao usuário logado
      setListData(data);
    } catch (error) {
      if (error.response?.status === 404) {
         showMessage('Lista não encontrada ou você não tem permissão para vê-la.', 'error');
      } else {
        showMessage('Erro ao carregar detalhes da lista.', 'error');
      }
      setListData(null); // Define como null em caso de erro
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated, showMessage, navigate]);

  // Efeito para buscar os dados quando o ID da URL mudar
  useEffect(() => {
    fetchListDetails();
  }, [fetchListDetails]);

  // Função para lidar com a remoção de um item da lista
  const handleRemoveItem = async (media) => {
    if (!isAuthenticated || !user) {
      showMessage('Você precisa estar logado para remover itens.', 'warning');
      navigate('/login');
      return;
    }
    if (isSubmitting) return;

    // Usar modal customizado em vez de confirm
    if (!window.confirm(`Tem certeza que deseja remover "${media.title || media.name}" da lista?`)) {
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        user_id: user.id,
        lista_id: parseInt(id),
        media_id: media.id,
        media_type: media.type,
      };
      await deleteListItem(payload);
      showMessage('Item removido com sucesso!', 'success');
      await fetchListDetails(); // Recarrega os dados

    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Erro ao remover item.';
      showMessage(errorMessage, 'error');

    } finally {
      setIsSubmitting(false);
    }
  };

  const sortedAndNormalizedItems = useMemo(() => {
    // Se não houver dados, retorna um array vazio
    if (!listData || !listData.itens) {
      return [];
    }

    // 1. Normaliza os dados de todos os itens
    const normalized = listData.itens.map(normalizeItemData);

    // 2. Ordena o array normalizado alfabeticamente pelo título
    return normalized.sort((a, b) => {
      const titleA = a.title || ''; // Garante que não é null/undefined
      const titleB = b.title || ''; // Garante que não é null/undefined
      return titleA.localeCompare(titleB); // Compara os títulos
    });

  }, [listData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LoadingSpinner text="Carregando lista..." />
      </div>
    );
  }

  if (!listData) {
    return (
      <div className="min-h-screen bg-slate-50 text-center py-20">
        <Message message={message} type={type} />
        <h2 className="text-2xl font-bold text-slate-800">Lista não encontrada</h2>
        <Link to="/lists" className="mt-4 inline-flex items-center text-blue-600 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Minhas Listas
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Message message={message} type={type} />

      <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-12 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-12">
          <Link to="/lists" className="mb-4 inline-flex items-center text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Minhas Listas
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
          {listData.item_count} {listData.item_count === 1 ? 'Item na Lista' : 'Itens na Lista'}
        </h2>

        {listData.itens.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {sortedAndNormalizedItems.map((item) => ( 
              <MediaCard
                key={`${item.type}-${item.id}`} // 'item.type' já está normalizado
                media={item} // Passa o item já normalizado
                onRemoveFromList={handleRemoveItem}
                listId={id}
                isSubmitting={isSubmitting} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <List className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Lista Vazia
            </h3>
            <p className="text-slate-600">
              Adicione filmes, séries ou animes para vê-los aqui.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListDetails;
 