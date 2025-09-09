// src/pages/Register.jsx
function Register() {
  return (
    
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Cadastro</h2>
        <form className="space-y-4">
          <input type="name" placeholder="Nome" className="w-full p-2 border rounded" />
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

export default Register;