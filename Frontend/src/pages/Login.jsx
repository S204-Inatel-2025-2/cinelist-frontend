import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  return (
    

    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-5xl text-center pb-25 text-gray-900">Cinelist</h1>
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form className="space-y-4 pb-20 ">
          <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
          <input type="password" placeholder="Senha" className="w-full p-2 border rounded" />
          <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
