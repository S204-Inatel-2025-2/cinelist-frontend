// src/components/NavBar.jsx
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-500 text-white p-4 flex justify-between">
      <p className="font-bold text-xl">CineList</p>
      <div className="space-x-4">
        <Link to="/home">Mídia</Link>
        <Link to="/profile">Perfil</Link>
      </div>
    </nav>
  );
}

export default Navbar;