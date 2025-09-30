// src/pages/Profile.jsx
import { useUser } from "../context/UserContext";
import { useMessage } from "../hooks/useMessage";
import Message from "../layouts/Message";

function Profile() {
  const { user, removeFromList } = useUser();
  const { message, type, showMessage } = useMessage();

  const handleRemoveClick = (media) => {
    removeFromList(media.id);
    showMessage(`"${media.title}" foi excluído da sua lista!`, "success");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Message message={message} type={type} />

      {/* Cabeçalho */}
      <div className="flex items-center gap-4 mb-6">
        <img
          src={user.avatar}
          alt="Foto do usuário"
          className="w-20 h-20 rounded-full border"
        />
        <h1 className="text-2xl font-bold">{user.name}</h1>
      </div>

      {/* Lista de mídias */}
      <h2 className="text-xl font-semibold mb-2">Sua Lista</h2>
      {user.lista.length === 0 ? (
        <p className="text-gray-500">Nenhuma mídia adicionada ainda.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4">
          {user.lista.map((media) => (
            <li key={media.id} className="p-4 bg-gray-100 rounded shadow">
              <h3 className="font-bold">{media.title}</h3>
              <button
                onClick={() => handleRemoveClick(media)}
                className="mt-2 px-2 py-1 bg-red-500 text-white rounded"
              >
                Excluir
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Avaliações */}
      <h2 className="text-xl font-semibold mt-8 mb-2">⭐ Suas Avaliações</h2>
      {user.reviews.length === 0 ? (
        <p className="text-gray-500">Você ainda não fez nenhuma avaliação.</p>
      ) : (
        <ul className="space-y-3">
          {user.reviews.map((r, i) => (
            <li key={i} className="p-3 bg-white rounded shadow">
              <p className="font-bold">{r.mediaTitle}</p>
              <p>⭐ {r.rating}/10</p>
              {r.text && <p className="italic">"{r.text}"</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Profile;