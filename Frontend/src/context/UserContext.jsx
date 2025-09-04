// src/context/UserContext.jsx
import { createContext, useContext, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  
    const [user, setUser] = useState({
        name: "Eduardo",
        avatar: "https://www.w3schools.com/howto/img_avatar.png", 
        lista: [], // mídias adicionadas
        reviews: [] // avaliações feitas
    });

    //adicionar mídia
    const addToList = (media) => {
        if (!user.lista.find((m) => m.id === media.id)) {
        setUser((prev) => ({
            ...prev,
            lista: [...prev.lista, media],
            }));

        }
    }

    //remover mídia
    const removeFromList = (id) => {
        setUser({ ...user, lista: user.lista.filter((m) => m.id !== id) })
    }

    //salvar avaliação
    const addReview = (review) => {
        setUser({...user,reviews: [...user.reviews,review]})
    }

    return (
        <UserContext.Provider value={{ user, addToList, removeFromList, addReview }}>
        {children}
        </UserContext.Provider>
    );
}

// Hook para usar facilmente o contexto
export const useUser = () => useContext(UserContext);
