// src/pages/Profile.jsx
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useUser } from "../context/UserContext"
import { useState } from "react";

import Message from "../layout/Message";

function Profile(){
    
    const { user, removeFromList } = useUser()
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState("");

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);

        setTimeout(() => {
        setMessage(null);
        setMessageType('');
        }, 1000);
    }

    const handleRemoveClick = (media) => {
        removeFromList(media.id)
        showMessage(`"${media.title}" foi excluído da sua lista!`, "success")
    }
    return(
        <div className="p-6 max-w-3xl mx-auto">
            <Message message={message} type={messageType} />
            <div className="flex items-center gap-4 mb-6">
                <img
                    src={user.avatar}
                    alt="Foto do usuário"
                    className="w-20 h-20 rounded-full border"
                />
                <h1 className="text-2xl font-bold">{user.name}</h1>
            </div>
            <h2 className="text-xl font-semibold mb-2">Sua Lista</h2>
            {user.lista.length === 0 ? (
                <p className="text-gray-500">Nenhuma mídia adicionada ainda.</p>
            ) : (
                <ul className="grid grid-cols-2 gap-4">
                    {user.lista.map((media) =>(
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

            <h2 className="text-xl font-semibold mt-8 mb-2">⭐ Suas Avaliações</h2>
            {user.reviews.map((r,i) => (
                <li key={i} className="p-3 bg-white rounded shadow">
                    <p className="font-bold">{r.mediaTitle}</p>
                    <p>⭐ {r.rating}/10</p>
                    {r.text && <p className="italic">"{r.text}"</p>}
                </li>
            ))}
        </div>
    )
}

export default Profile;