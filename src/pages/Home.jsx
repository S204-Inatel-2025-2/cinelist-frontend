// src/pages/Home.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useMessage } from "../hooks/useMessage";
import Message from "../layouts/Message";

import { mockMovies, mockAnimes, mockSeries } from "../data/mockData";

function Home() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { addToList } = useUser();
  const { message, type, showMessage } = useMessage();

  const handleAddClick = (media) => {
    addToList(media);
    showMessage(`"${media.title}" foi adicionado à sua lista!`, "success");
  };

  const allMedia = [
    ...mockMovies.map((m) => ({ ...m, type: "filme" })),
    ...mockAnimes.map((a) => ({ ...a, type: "anime" })),
    ...mockSeries.map((s) => ({ ...s, type: "serie" })),
  ];

  const filteredData = allMedia
    .filter((m) => filter === "all" || m.type === filter)
    .filter((m) => m.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6">
      <div className="mb-6">
        <Message message={message} type={type} />
        <input
          type="text"
          placeholder="🔎 Pesquisar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Botões de filtro */}
      <div className="flex space-x-4 mb-6">
        {["all", "filme", "anime", "serie"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg ${
              filter === f ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {f === "all"
              ? "Todos"
              : f === "filme"
              ? "Filmes"
              : f === "anime"
              ? "Animes"
              : "Séries"}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredData.map((media) => (
          <div
            key={media.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform"
          >
            <div className="p-4">
              <h3 className="font-bold text-lg">{media.title}</h3>

              {media.type === "filme" && (
                <>
                  <p className="text-sm text-gray-600">{media.overview}</p>
                  <p className="text-sm">🎬 Diretor: {media.director}</p>
                  <p className="text-sm">⭐ Nota: {media.rating}</p>
                </>
              )}

              {media.type === "anime" && (
                <>
                  <p className="text-sm text-gray-600">{media.description}</p>
                  <p className="text-sm">📅 Lançamento: {media.release_date}</p>
                  <p className="text-sm">📺 Episódios: {media.episodes}</p>
                  <p className="text-sm">⭐ Nota: {media.score}</p>
                </>
              )}

              {media.type === "serie" && (
                <>
                  <p className="text-sm text-gray-600">{media.overview}</p>
                  <p className="text-sm">🎬 Criador: {media.creator}</p>
                  <p className="text-sm">📺 Episódios: {media.episodes}</p>
                  <p className="text-sm">⭐ Nota: {media.rating}</p>
                </>
              )}

              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => navigate(`/media/${media.id}`)}
                  className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:scale-105"
                >
                  Avaliar
                </button>
                <button
                  onClick={() => handleAddClick(media)}
                  className="px-3 py-1 bg-indigo-500 text-white text-sm rounded-lg hover:scale-105"
                >
                  Adicionar à Lista
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;