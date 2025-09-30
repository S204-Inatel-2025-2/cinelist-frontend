// src/pages/Login.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMessage } from "../hooks/useMessage";
import Message from "../layouts/Message";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { message, type, showMessage } = useMessage();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username.trim() === "" || password.trim() === "") {
      return showMessage("Preencha todos os campos!", "error");
    }

    // Por enquanto login fictício
    if (username === "teste" && password === "123") {
      showMessage("Login bem-sucedido!", "success");
      setTimeout(() => navigate("/home"), 1200);
    } else {
      showMessage("Usuário ou senha incorretos!", "error");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Message message={message} type={type} />

      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-80"
      >
        {/* Nome do site */}
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
          CineList
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Bem-vindo de volta!
        </p>

        <h2 className="text-xl font-semibold mb-4 text-center">Login</h2>

        <input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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