// src/pages/UsersProfile.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useMessage } from '../hooks/useMessage';
import { getAllUsers } from '../services/users';
import LoadingSpinner from '../components/LoadingSpinner';
import Message from '../components/Message';
import { getAvatarPath, DEFAULT_AVATAR_ID } from '../config/avatars';

function UsersProfile() {
  const [otherUsers, setOtherUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user, isAuthenticated } = useUser();
  const { message, type, showMessage } = useMessage();

  useEffect(() => {
    const fetchUsers = async () => {
 
      if (isAuthenticated === null) {
        setLoading(true); 
        return;
      }

      if (isAuthenticated === false) {
        setLoading(false); 
        showMessage('Você precisa estar logado para ver os usuários.', 'warning');
        return;
      }

      if (isAuthenticated === true) { 
        setLoading(true); 
        try {
          const data = await getAllUsers(); 
          setOtherUsers(data);
        } catch (error) {
          showMessage(error.detail || 'Erro ao carregar a lista de usuários.', 'error');
        } finally {
          setLoading(false); 
        }
      } 
    };

    fetchUsers();
  }, [isAuthenticated, showMessage]);

  // Renderização do conteúdo principal
  const renderContent = () => {

    // 3. CORREÇÃO: Lógica de loading ajustada
    
    // Mostra spinner se a autenticação estiver carregando (estado inicial)
    if (isAuthenticated === null) {
      return (
        <div className="pt-16">
          <LoadingSpinner text="Carregando..." />
        </div>
      );
    }
    
    // Mostra spinner se a API estiver carregando (APÓS autenticação)
    if (isAuthenticated === true && loading) {
      return (
        <div className="pt-16">
          <LoadingSpinner text="Carregando usuários..." />
        </div>
      );
    }

    if (otherUsers.length === 0) {
      return (
        <div className="text-center py-16">
          <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Nenhum outro usuário encontrado
          </h3>
        </div>
      );
    }

    // Grid para listar os usuários
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {otherUsers.map((user) => (
          <Link
            to={`/users/${user.id}`} 
            key={user.id}
            className="bg-white p-4 rounded-xl shadow-md border border-slate-200 hover:shadow-lg hover:border-blue-400 transition-all flex flex-col items-center gap-3"
          >
            <img
              src={getAvatarPath(user.avatar || DEFAULT_AVATAR_ID)}
              alt={`Avatar de ${user.username}`}
              className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 bg-slate-200" 
              onError={(e) => { e.target.src = getAvatarPath(DEFAULT_AVATAR_ID); }}
            />
            <span className="text-lg font-semibold text-slate-800 text-center truncate w-full">
              {user.username}
            </span>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Message message={message} type={type} />
      
      {/* --- Banner do Topo (Sem alterações) --- */}
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-12 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-12">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Usuários</h1>
          </div>
          <p className="text-slate-300 max-w-2xl">
            Veja as avaliações e listas dos demais usuários
          </p>
        </div>
      </div>

      {/* --- Conteúdo Principal (Sem alterações) --- */}
      <div className="max-w-[1600px] mx-auto px-8 lg:px-12 py-12">
        {renderContent()}
      </div>
    </div>
  );
}

export default UsersProfile;