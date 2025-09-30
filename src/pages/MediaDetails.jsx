// src/pages/MediaDetails.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { mockMovies, mockAnimes, mockSeries, mockComments } from "../data/mockData";

function MediaDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addReview } = useUser();

  const allMedia = [
    ...mockMovies.map((m) => ({ ...m, type: "filme" })),
    ...mockAnimes.map((a) => ({ ...a, type: "anime" })),
    ...mockSeries.map((s) => ({ ...s, type: "serie" })),
  ];

  const media = allMedia.find((m) => m.id === parseInt(id));
  const [comments, setComments] = useState(mockComments[id] || []);

  const [username, setUsername] = useState("");
  const [newComment, setNewComment] = useState("");
  const [userRating, setUserRating] = useState("");

  if (!media) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold">Mídia não encontrada.</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Voltar
        </button>
      </div>
    );
  }

  const handleAddEvaluation = () => {
    if (username.trim() === "" || userRating === "")
      return alert("Informe seu nome e uma nota");
    if (userRating < 0 || userRating > 10)
      return alert("Coloque uma nota de 0-10");

    const newEntry = {
      user: username.trim(),
      text: newComment.trim() || null,
      rating: parseFloat(userRating),
      mediaTitle: media.title,
    };

    setComments([...comments, newEntry]);
    addReview(newEntry);

    setNewComment("");
    setUsername("");
    setUserRating("");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-gray-300 rounded-lg"
      >
        ← Voltar
      </button>

      <h1 className="text-3xl font-bold mb-4">{media.title}</h1>

      {media.type === "filme" && (
        <>
          <p className="text-gray-700">{media.overview}</p>
          <p>🎬 Diretor: {media.director}</p>
          <p>⭐ Nota: {media.rating}</p>
        </>
      )}

      {media.type === "anime" && (
        <>
          <p className="text-gray-700">{media.description}</p>
          <p>📅 Lançamento: {media.release_date}</p>
          <p>📺 Episódios: {media.episodes}</p>
          <p>⭐ Nota: {media.score}</p>
        </>
      )}

      {media.type === "serie" && (
        <>
          <p className="text-gray-700">{media.overview}</p>
          <p>🎬 Criador: {media.creator}</p>
          <p>📺 Episódios: {media.episodes}</p>
          <p>⭐ Nota: {media.rating}</p>
        </>
      )}

      {/* Avaliação */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Faça sua avaliação</h2>
        <input
          type="text"
          placeholder="Seu nome"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded-lg mb-2"
        />
        <textarea
          placeholder="Escreva um comentário (opcional)"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="w-full p-2 border rounded-lg mb-2"
        />
        <input
          type="number"
          placeholder="Nota (0 a 10)"
          value={userRating}
          onChange={(e) => setUserRating(e.target.value)}
          className="w-full p-2 border rounded-lg mb-2"
          min="0"
          max="10"
        />
        <button
          onClick={handleAddEvaluation}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
        >
          Salvar avaliação
        </button>
      </div>

      {/* Comentários */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Comentários</h2>
        {comments.length === 0 ? (
          <p className="text-gray-500">Ainda não há comentários.</p>
        ) : (
          <ul className="space-y-2">
            {comments.map((c, i) => (
              <li key={i} className="p-2 bg-gray-100 rounded">
                <p className="font-bold text-blue-600">{c.user}</p>
                {c.text && <p>{c.text}</p>}
                <p className="text-sm text-yellow-600">⭐ Nota: {c.rating}/10</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MediaDetails;