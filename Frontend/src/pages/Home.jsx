import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useUser } from "../context/UserContext";

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
function Home(){

    // Estado para filtrar entre filmes, animes e séries
    const [filter, setFilter] = useState("all")
    const [search, setSearch] = useState("")
    const navigate = useNavigate()

    const { addToUserList } = useUser();
    // Junta todos os dados em um único array, com um campo "type" para diferenciar
    const allMedia = [
        ...mockMovies.map((m) => ({ ...m, type: "filme" })),
        ...mockAnimes.map((a) => ({ ...a, type: "anime" })),    
        ...mockSeries.map((s) => ({ ...s, type: "serie" })),
    ]

    // Combina filtro de categoria e pesquisa
    const filteredData = allMedia
        .filter((m) => filter === "all" || m.type === filter)
        .filter((m) => m.title.toLowerCase().includes(search.toLowerCase()));

    

    return(
        <div className="p-6">
            {/* --- CAMPO DE PESQUISA --- */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="🔎 Pesquisar por título..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                     className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />   
            </div>
            {/* --- BOTÕES DE FILTRO --- */}
            <div className="flex space-x-4 mb-6">
                <button 
                    onClick={() => setFilter("all")}
                    className={`px-4 py-2 rounded-lg ${
                        filter == "all" ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
                >
                    Todos
                </button>

                <button 
                    onClick={() => setFilter("filme")}
                    className={`px-4 py-2 rounded-lg ${
                        filter == "filme" ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
                >
                    Filmes
                </button>

                <button 
                    onClick={() => setFilter("anime")}
                    className={`px-4 py-2 rounded-lg ${
                        filter == "anime" ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
                >
                    Anime
                </button>

                <button 
                    onClick={() => setFilter("serie")}
                    className={`px-4 py-2 rounded-lg ${
                        filter == "serie" ? "bg-blue-600 text-white" : "bg-gray-200"
                    }`}
                >
                    Séries
                </button>
            </div>

            {/* --- LISTA DE CARDS --- */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredData.map((media) =>(
                    <div 
                        key={media.id}  
                        className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform"
                    >
                        <div className="p-4">
                            {/* Título */}
                            <h3 className="font-bold text-lg">{media.title}</h3>

                            {/* Infos diferentes para cada tipo */}
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
                                    <p className="text-sm text-gray-600">📅 Lançamento: {media.release_date}</p>
                                    <p className="text-sm text-gray-600">📺 Episódios: {media.episodes}</p>
                                    <p className="text-sm">⭐ Nota: {media.score}</p>
                                </>
                            )}

                            {media.type === "serie" && (
                                <>
                                    <p className="text-sm text-gray-600">{media.overview}</p>
                                    <p className="text-sm ">🎬 Criador: {media.creator}</p>
                                    <p className="text-sm ">📺 Episódios: {media.episodes}</p>
                                     <p className="text-sm">⭐ Nota: {media.rating}</p>
                                </>
                            )}

                            {/* Botões de ação */}
                            <div  className="mt-3 flex space-x-2">
                                <button  
                                    onClick={() => navigate(`/media/${media.id}`)}
                                    className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:scale-105">
                                    Avaliar 
                                </button>
                                <button 
                                    onClick={() => addToUserList(media)}
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
    )
}

export default Home