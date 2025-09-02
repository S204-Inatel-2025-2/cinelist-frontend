import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import { useUser } from "../context/UserContext"
import { useContext } from "react";
import { UserContext } from "../context/UserContext";

const mockMovies = [
  {
    id: 1,
    title: "O Senhor dos Anéis",
    overview: "Um hobbit parte em uma jornada para destruir um anel maligno.",
    release_date: "2001-12-19",
    director: "Peter Jackson",
    cast: ["Elijah Wood", "Ian McKellen", "Viggo Mortensen"],
    rating: 9.0,
  },
]

const mockAnimes = [
  {
    id: 2,
    title: "Attack on Titan",
    description: "Humanidade luta contra titãs gigantes.",
    score: 9.5,
    release_date: "2013-04-06",
    episodes: 87,
    status: "Finalizado",
  },
]

const mockSeries = [
  {
    id: 3,
    title: "Breaking Bad",
    overview: "Professor de química vira produtor de metanfetamina.",
    release_date: "2008-01-20",
    creator: "Vince Gilligan",
    cast: ["Bryan Cranston", "Aaron Paul"],
    rating: 9.7,
    episodes: 62,
    status: "Finalizada",
    last_episode: "2013-09-29",
  },
]


// --- Comentários iniciais com nome de usuário ---
const mockComments = {
  1: [
    { user: "João", text: "Filme incrível!", rating: 9.7},
    { user: "Maria", text: "Melhor trilogia já feita.", rating:8.9 },
  ],
  2: [
    { user: "Carlos", text: "Obra-prima dos animes.", rating: 10 },
    { user: "Ana", text: "Ansioso pelo final 🔥", rating: 9.8 },
  ],
  3: [
    { user: "Lucas", text: "Breaking Bad é perfeito!", rating: 10 },
    { user: "Fernanda", text: "Say my name.", rating: 9.8 },
  ],
}

function MediaDetails(){
    const {id} = useParams()
    const navigate = useNavigate()
    const { addReview } = useUser()


    const allMedia = [
    ...mockMovies.map((m) => ({ ...m, type: "filme" })), // marca filmes com type = "filme"
    ...mockAnimes.map((a) => ({ ...a, type: "anime" })), // marca animes com type = "anime"
    ...mockSeries.map((s) => ({ ...s, type: "serie" })), // marca séries com type = "serie"
    ]

    const media = allMedia.find((m) => m.id === parseInt(id))
    const [comments, setComments] = useState(mockComments[id] || [])
    
    // inputs do formulário
    const [username, setUsername] = useState("")
    const [newComment, setNewComment] = useState("")
    const [userRating, setUserRating] = useState("")

    if(!media){
        return(
            <div  className="p-6">
                <h2 className="text-xl font-bold">
                    Mídia não encontrada.
                </h2>
                <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg">
                    Voltar
                </button>
            </div>
        )
    }

    const handleAddEvaluation = () => {
        if(username.trim() === "" || userRating === "")
            return alert("Informe seu nome e uma nota")
        if(userRating < 0 || userRating > 10)
            return alert("Coloque uma nota de 0-10")

        // novo objeto de avaliação
        const newEntry = {
            user: username.trim(),
            text: newComment.trim() || null, // comentário é opcional
            rating: parseFloat(userRating),
            mediaTitle: media.title,
        }

        setComments([...comments, newEntry])
        addReview(newEntry);

        // limpa os inputs
        setNewComment("")
        setUsername("")
        setUserRating("")
    }

    return(
        <div className="p-6 max-w-3xl mx-auto">
            <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-300 rounded-lg">
                ← Voltar
            </button>

            <h1 className="text-3xl font-bold mb-4">{media.title}</h1>

            {media.type == "filme" && (
                <>
                    <p className="text-gray-700">{media.overview}</p>
                    <p>🎬 Diretor: {media.director}</p>
                     <p>⭐ Nota: {media.rating}</p>
                </>
            )}

            {media.type == "anime" && (
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

            {/* --- seção de avaliação --- */}
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
                    placeholder = "Escreva um comentário (opcional)"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-2 border rounded-lg mb-2"
                />
                <input 
                    type="number"
                    placeholder="Nota (0 a 10)"
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

            

            {/* --- seção de comentários --- */}
            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-2">Comentários</h2>
                {/* se não houver comentários, mostra mensagem */}

                {comments.length === 0 ? (
                    <p className="text-gray-500">Ainda não há comentários.</p>
                    
                    ) : (
                        /* lista de comentários existentes */
                        <ul className="space-y-2">
                            {comments.map((c,i) => (
                                <li key={i} className="p-2 bg-gray-100 rounded">
                                    {/* sempre mostra o nome do usuário */}
                                    <p className="font-bold text-blue-600">{c.user}</p>
                                    {/* comentário só aparece se existir */}
                                    {c.text && <p>{c.text}</p>}
                                    <p className="text-sm text-yellow-600">⭐ Nota: {c.rating}/10</p>
                                </li>
                            ))}
                        </ul>
                )}
            </div>
        </div>
    )
}

export default MediaDetails