// src/context/UserContext.jsx
import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  // Lista pessoal de mídias
  const [userList, setUserList] = useState([]);

  // Função para adicionar mídia na lista
  const addToUserList = (media) => {
    console.log('ID do item a ser adicionado:', media.id, typeof media.id);
    // evita duplicados
    if (!userList.find((item) => item.id === media.id)) {
      setUserList([...userList, media]);
    }
  };

  return (
    <UserContext.Provider value={{ userList, addToUserList }}>
      {children}
    </UserContext.Provider>
  );
}

// Hook para usar facilmente o contexto
export const useUser = () => useContext(UserContext);
