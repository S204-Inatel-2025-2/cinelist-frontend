import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { List, ArrowLeft } from 'lucide-react';

// 1. Importe o serviço de remoção de item e o componente MediaCard
import { getList, deleteListItem } from '../services/lists';
import { useMessage } from '../hooks/useMessage';
import Message from '../components/Message';
import LoadingSpinner from '../components/LoadingSpinner';
import MediaCard from '../components/MediaCard';

function ListDetails() {
  const [listData, setListData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { message, type, showMessage } = useMessage();
  const FIXED_USER_ID = 10; // Use o ID do usuário logado na aplicação real

  // Função para buscar os detalhes da lista
  const fetchListDetails = async () => {
    try {
      const data = await getList({ lista_id: parseInt(id) });
      setListData(data);
    } catch (error) {
      showMessage('Erro ao carregar detalhes da lista.', 'error');
      setListData(null);
    } finally {
      setLoading(false);
    }
  };

  // Efeito para buscar os dados quando o ID da URL mudar
  useEffect(() => {
    setLoading(true);
    fetchListDetails();
  }, [id]);

  // 2. Função para lidar com a remoção de um item da lista
  const handleRemoveItem = async (media) => {
    // Pede confirmação ao usuário antes de remover
    if (!confirm(`Tem certeza que deseja remover "${media.title || media.name}" da lista?`)) {
      return;
    }

    try {
      const payload = {
        user_id: FIXED_USER_ID,
        lista_id: parseInt(id),
        media_id: media.id,
        media_type: media.media_type,
      };
      await deleteListItem(payload);
      showMessage('Item removido com sucesso!', 'success');
      
      // Recarrega os detalhes da lista para refletir a mudança
      fetchListDetails();
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Erro ao remover item da lista.';
      showMessage(errorMessage, 'error');
    }
  };

  // Renderização do estado de carregamento
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <LoadingSpinner text="Carregando lista..." />
      </div>
    );
  }

  // Renderização se a lista não for encontrada
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

  // Renderização principal do componente
  return (
    <div className="min-h-screen bg-slate-50">
      <Message message={message} type={type} />

      {/* Cabeçalho da página com informações da lista */}
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

      {/* Conteúdo principal com a grade de itens */}
      <div className="max-w-[1600px] mx-auto px-8 lg:px-12 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          {listData.item_count} {listData.item_count === 1 ? 'Item na Lista' : 'Itens na Lista'}
        </h2>
        
        {listData.itens.length > 0 ? (
          // 3. Layout em grade para exibir os MediaCards
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {listData.itens.map((item) => (
              <MediaCard 
                key={`${item.media_type}-${item.id}`} // Chave mais robusta
                media={item} 
                onRemoveFromList={handleRemoveItem} // Passa a função de remoção para o card
              />
            ))}
          </div>
        ) : (
          <p className="text-slate-600">Não há itens nesta lista ainda.</p>
        )}
      </div>
    </div>
  );
}

export default ListDetails;