import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FormRegister({ onRegister }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState("CLIENTE");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({ nome, email, senha, tipo });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-6 bg-white shadow rounded"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Registrar</h2>

      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      />

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

      <select
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
        required
      >
        <option value="CLIENTE">Cliente</option>
        <option value="DONO">Dono</option>
        <option value="ADMIN">Admin</option>
      </select>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Registrar
      </button>

      <button
        type="button"
        onClick={() => navigate("/login")}
        className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-700 mt-2"
      >
        Voltar para Login
      </button>
    </form>
  );
}
