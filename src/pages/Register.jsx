// src/pages/Register.jsx
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // TODO: implementar lógica de cadastro real
    console.log("Usuário cadastrado!");
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        {/* Nome do site */}
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-2">
          CineList
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Crie sua conta para começar!
        </p>

        <h2 className="text-xl font-semibold mb-4 text-center">Cadastro</h2>

        <form className="space-y-4" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nome"
            className="w-full p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Senha"
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
          onClick={() => navigate("/")}
        >
          Já tem conta? Faça login
        </p>
      </div>
    </div>
  );
}

export default Register;