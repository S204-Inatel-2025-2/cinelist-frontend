// src/pages/ListDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { List, Film, Tv, Clapperboard, ArrowLeft } from 'lucide-react';

import { getList } from '../services/lists'; // Importa a função que criamos
import { useMessage } from '../hooks/useMessage';
import Message from '../components/Message';
import LoadingSpinner from '../components/LoadingSpinner';

function ListDetails() {
  const [listData, setListData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Pega o ID da lista da URL (ex: /listas/10)
  const { message, type, showMessage } = useMessage();

  useEffect(() => {
    const fetchListDetails = async () => {
      setLoading(true);
      try {
        const data = await getList({ lista_id: parseInt(id) });
        setListData(data);
      } catch (error) {
        showMessage('Erro ao carregar detalhes da lista', 'error');
        setListData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchListDetails();
  }, [id]); // Roda sempre que o ID na URL mudar

  const mediaIcons = {
    movie: <Film className="w-5 h-5 text-slate-500" />,
    serie: <Tv className="w-5 h-5 text-slate-500" />,
    anime: <Clapperboard className="w-5 h-5 text-slate-500" />,
  };

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
        <Link to="/listas" className="mt-4 inline-flex items-center text-blue-600 hover:underline">
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
          <Link to="/listas" className="mb-4 inline-flex items-center text-slate-300 hover:text-white transition-colors">
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
          <div className="space-y-4">
            {listData.itens.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm flex items-center space-x-4">
                <div className="flex-shrink-0">{mediaIcons[item.media_type] || <Film />}</div>
                <div className="flex-grow">
                  <p className="font-bold text-slate-800">{item.media_title}</p>
                  <p className="text-sm text-slate-500 capitalize">{item.media_type}</p>
                </div>
              </div>
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