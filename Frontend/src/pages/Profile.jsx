import { useUser } from "../context/UserContext";

function Profile(){
    const { userList } = useUser();

    return(
        <div>
            <h1 className="text-2xl font-bold mb-4">Perfil do Usuário</h1>
            <h2 className="text-xl mb-2">Sua lista</h2>

            {userList.length === 0 ? (
                 <p className="text-gray-500">Você ainda não adicionou nenhuma mídia.</p>                 
            ): (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {userList.map((media) => (
                        <div key={media.id} className="bg-white shadow rounded-lg p-4">
                            <h2 className="font-bold">{media.title}</h2>
                            <p className="text-gray-600">Categoria: {media.type}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Profile