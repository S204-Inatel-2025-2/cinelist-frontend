import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react"

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

// --- Comentários mockados iniciais ---
const mockComments = {
  1: ["Filme incrível!", "Melhor trilogia já feita."],
  2: ["Obra-prima dos animes.", "Ansioso pelo final 🔥"],
  3: ["Breaking Bad é perfeito!", "Walter White é lendário."],
}


function MediaDetails(){
    const {id} = useParams()
    const navigate = useNavigate()

    const allMedia = [
    ...mockMovies.map((m) => ({ ...m, type: "filme" })), // marca filmes com type = "filme"
    ...mockAnimes.map((a) => ({ ...a, type: "anime" })), // marca animes com type = "anime"
    ...mockSeries.map((s) => ({ ...s, type: "serie" })), // marca séries com type = "serie"
    ]

    const media = allMedia.find((m) => m.id === parseInt(id))
    const [comments, setComments] = useState(mockComments[id] || [])
    // estado local para o texto do novo comentário que o usuário digita
    const [newComment, setNewComment] = useState("")
    const [rating, setRating] = useState(null) // nota que o usuário deu
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

    const handleAddComment = () => {
        //não adiciona comentarios vazios, coloca espaço no lugar
        if (newComment.trim() === "") return
        // atualiza o estado de comments adicionando o novo comentário ao final do array (apenas no front)
        setComments([...comments, newComment.trim()])

        // limpa o campo de texto depois de adicionar
        setNewComment("")
    }

     const handleSaveRating = () => {
        if (userRating < 0 || userRating > 10) return alert("A nota deve ser entre 0 e 10")
        setRating(userRating)
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
                {rating != null && (
                    <p className="mb-2 text-green-600 font-medium">
                        Você avaliou com a nota: {rating}/10 
                    </p>
                )}

                <div className="flex items-center space-x-2">
                    <input
                        type="number"
                        min="0"
                        max="10"
                        value={userRating}
                        onChange={(e) => setUserRating(e.target.value)}
                        placeholder="0-10"
                        className="p-2 border rounded w-20"
                    />
                    <button 
                        onClick={handleSaveRating}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                    >
                        Salvar Nota
                    </button>
                </div>
            </div>

            {/* campo para adicionar novo comentário */}
            <div className="mt-4">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Escreva seu comentário..."
                    className="w-full p-2 border rounded-lg"
                />
                {/* botão que chama handleAddComment */}
                <button
                    onClick={handleAddComment}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                    Adicionar comentário
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
                                {c}
                            </li>
                            ))}
                        </ul>
                )}
            </div>
        </div>
    )
}

export default MediaDetails