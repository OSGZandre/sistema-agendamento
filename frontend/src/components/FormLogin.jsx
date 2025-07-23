import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, senha });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-6 bg-white shadow rounded"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Entrar
      </button>

      <button
        type="button"
        onClick={() => navigate("/register")}
        className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-700 mt-2"
      >
        Não tem conta? Registre-se
      </button>
    </form>
  );
}
