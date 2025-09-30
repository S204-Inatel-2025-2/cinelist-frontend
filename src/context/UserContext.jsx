// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : {
      name: "Eduardo",
      avatar: "https://www.w3schools.com/howto/img_avatar.png",
      lista: [],
      reviews: []
    };
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  const addToList = (media) => {
    if (!user.lista.find((m) => m.id === media.id)) {
      setUser((prev) => ({
        ...prev,
        lista: [...prev.lista, media],
      }));
    }
  };

  const removeFromList = (id) => {
    setUser({ ...user, lista: user.lista.filter((m) => m.id !== id) });
  };

  const addReview = (review) => {
    setUser({ ...user, reviews: [...user.reviews, review] });
  };

  return (
    <UserContext.Provider value={{ user, addToList, removeFromList, addReview }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);