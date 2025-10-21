// src/components/Footer.jsx
import { Film } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-6 mt-auto">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Film className="w-6 h-6 text-blue-400" />
            <span className="text-xl font-bold">CineList</span>
          </div>
          <p className="text-gray-400 text-sm text-center md:text-left">
            {new Date().getFullYear()} CineList. Sua plataforma de filmes, séries e animes.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;