// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useMessage } from "../hooks/useMessage";
import Message from "../layouts/Message";
import api from "../services/api";

function Register() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const { message, type, showMessage } = useMessage();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
      return showMessage("Preencha todos os campos!", "error");
    }

    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
      });

      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);

      showMessage("Cadastro realizado com sucesso!", "success");
      setTimeout(() => navigate("/home"), 1200);
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Erro ao cadastrar usuário!",
        "error"
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Message message={message} type={type} />

      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
          🎬 CineList
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Crie sua conta para começar!
        </p>

        <h2 className="text-xl font-semibold mb-4 text-center">Cadastro</h2>

        <form className="space-y-4" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
          >
            Cadastrar
          </button>
        </form>

        <p
          className="mt-4 text-sm text-center text-blue-600 cursor-pointer hover:underline"
          onClick={() => navigate("/login")}
        >
          Já tem conta? Faça login
        </p>
      </div>
    </div>
  );
}

export default Register;