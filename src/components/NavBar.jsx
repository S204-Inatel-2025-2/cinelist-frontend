// src/components/NavBar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { Film, Tv, Monitor, User, List, LogOut, Users } from 'lucide-react';
import { useUser } from '../context/UserContext';

function Navbar() {
  const { user, logout, isDeleting } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ to, label, Icon }) => {
    // Se isDeleting for true, retorna um span com estilos de desabilitado e cursor de espera
    if (isDeleting) {
      return (
        <span
          className="text-slate-500 cursor-wait flex items-center space-x-1 transition-colors opacity-70"
          title="Aguarde a exclusão da conta"
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </span>
      );
    }
    // Caso contrário, retorna o Link normal
    return (
      <Link to={to} className="hover:text-blue-400 transition-colors flex items-center space-x-1">
        <Icon className="w-5 h-5" />
        <span>{label}</span>
      </Link>
    );
  };

  const TitleLink = ({ to, label }) => {
    // Estilos base para o ícone e texto
    const iconBaseClasses = "w-8 h-8 text-blue-400";
    const textBaseClasses = "text-2xl font-bold";
    const linkClasses = "flex items-center space-x-2 transition-opacity";
    
    if (isDeleting) {
      return (
        <span
          className={`${linkClasses} text-slate-500 cursor-wait opacity-70`}
          title="Aguarde a exclusão da conta"
        >
          <Film className={`${iconBaseClasses} text-slate-500`} /> {/* Ícone fica cinza */}
          <span className={textBaseClasses}>{label}</span>
        </span>
      );
    }
    
    return (
      <Link to={to} className={`${linkClasses} hover:opacity-80`}>
        <Film className={iconBaseClasses} />
        <span className={textBaseClasses}>{label}</span>
      </Link>
    );
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-16">
          
          {/* --- APLICAÇÃO DO NOVO COMPONENTE --- */}
          <TitleLink to="/home" label="CineList" />
          
          <div className="hidden md:flex items-center space-x-6">
            {/* Links de Navegação */}
            <NavItem to="/home" label="Início" Icon={Monitor} />
            <NavItem to="/movies" label="Filmes" Icon={Film} />
            <NavItem to="/series" label="Séries" Icon={Tv} />
            <NavItem to="/anime" label="Animes" Icon={Monitor} />
            <NavItem to="/lists" label="Minhas Listas" Icon={List} />
            <NavItem to="/users" label="Usuários" Icon={Users} />
          </div>

          <div className="flex items-center space-x-4">
            
            {/* Perfil */}
            <NavItem to="/profile" label={user?.username || 'Perfil'} Icon={User} />
            
            {/* Botão Sair */}
            <button
              onClick={handleLogout}
              disabled={isDeleting}
              className="flex items-center space-x-1 hover:text-red-400 transition-colors disabled:text-slate-500 disabled:cursor-wait"
              title={isDeleting ? "Aguarde a exclusão da conta" : "Sair"}
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;