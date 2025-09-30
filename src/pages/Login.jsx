// src/pages/Login.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useMessage } from "../hooks/useMessage";
import Message from "../layouts/Message";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();
  const { message, type, showMessage } = useMessage();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (email.trim() === "" || password.trim() === "") {
      return showMessage("Preencha todos os campos!", "error");
    }

    try {
      const response = await api.post("/login", { email, password });

      setUser(response.data.user);
      localStorage.setItem("token", response.data.token);

      showMessage("Login bem-sucedido!", "success");
      setTimeout(() => navigate("/home"), 1200);
    } catch (error) {
      showMessage(
        error.response?.data?.message || "Usuário ou senha incorretos!",
        "error"
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Message message={message} type={type} />

      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
          🎬 CineList
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Bem-vindo de volta!
        </p>

        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded mb-3"
        />

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Entrar
        </button>

        <p
          className="mt-4 text-sm text-center text-blue-600 cursor-pointer hover:underline"
          onClick={() => navigate("/register")}
        >
          Não tem conta? Cadastre-se
        </p>
      </form>
    </div>
  );
}

export default Login;