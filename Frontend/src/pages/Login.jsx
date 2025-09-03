import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate()

   const mockUser = {
    email: "teste@email.com",
    password: "123456",
  };

  const [email,setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    if(email === mockUser.email && password === mockUser.password){
      alert("Login realizado com sucesso!")
      navigate("/home")
    } else{
      alert("E-mail ou senha incorretos.")
    }
  }

  const handleRegisterRedirect = () =>{
    navigate("/register")
  }
  
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-5xl text-center pb-25 text-gray-900">Cinelist</h1>
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Digite sua senha"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
  
        <button 
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Entrar
        </button>
        <p className="mt-4 text-center text-gray-600">
            Não tem conta?{" "}
            <Link to='/register' className="text-gray-600 hover:underline">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
