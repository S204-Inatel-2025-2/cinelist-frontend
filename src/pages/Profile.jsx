// src/pages/Profile.jsx
import { User, Mail, Calendar, Star, List } from 'lucide-react';
import { useUser } from '../context/UserContext';

function Profile() {
  const { user } = useUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">Usuário não encontrado</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <img
              src={user.avatar || 'https://www.w3schools.com/howto/img_avatar.png'}
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl mb-4"
            />
            <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
            {user.email && (
              <p className="text-slate-300 flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <Star className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-slate-900 mb-1">0</h3>
            <p className="text-slate-600">Avaliações</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <List className="w-12 h-12 text-blue-500 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-slate-900 mb-1">0</h3>
            <p className="text-slate-600">Listas</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <Calendar className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-3xl font-bold text-slate-900 mb-1">
              {new Date().getFullYear()}
            </h3>
            <p className="text-slate-600">Membro desde</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <User className="w-6 h-6" />
            <span>Informações do Perfil</span>
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between py-3 border-b border-slate-200">
              <span className="text-slate-600">Nome</span>
              <span className="font-medium text-slate-900">{user.name}</span>
            </div>
            {user.email && (
              <div className="flex justify-between py-3 border-b border-slate-200">
                <span className="text-slate-600">Email</span>
                <span className="font-medium text-slate-900">{user.email}</span>
              </div>
            )}
            <div className="flex justify-between py-3">
              <span className="text-slate-600">Status</span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Ativo
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <Star className="w-6 h-6" />
            <span>Atividade Recente</span>
          </h2>
          <div className="text-center py-8">
            <p className="text-slate-600">Nenhuma atividade recente</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;