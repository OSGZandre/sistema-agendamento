import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function FormRegister({ onRegister, initialTipo = "CLIENTE" }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [tipo, setTipo] = useState(initialTipo); // Usa o tipo inicial passado como prop
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({ nome, email, senha, tipo });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-8 border-2 border-[#3E57B3] bg-white shadow rounded-xl min-h-96"
    >
      <h2 className="text-xl font-bold mb-4 text-center text-[#32458C]">
        Registrar
      </h2>

      <label className="block text-[#32458C] mt-10">Nome</label>
      <input
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="w-full p-1 border-b-2 border-[#3E57B3] bg-white text-gray-800 placeholder-gray-600 focus:outline-none focus:border-[#8193D6]"
        required
      />

      <label className="block text-[#32458C] mt-7">Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full p-1 border-b-2 border-[#3E57B3] bg-white text-gray-800 placeholder-gray-600 focus:outline-none focus:border-[#8193D6]"
        required
      />

      <label className="block text-[#32458C] mt-7">Senha</label>
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full p-1 border-b-2 border-[#3E57B3] bg-white text-gray-800 placeholder-gray-600 focus:outline-none focus:border-[#8193D6]"
          required
        />
        <button
          type="button"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 text-[#3E57B3] hover:text-[#A7B4E3]"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>

      <select
        id="tipoSelect" // Adicionado ID pra referência no useEffect (opcional agora)
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        className="w-full p-2 mb-5 mt-6 border-2 text-[#32458C] border-[#3E57B3] rounded-xl"
        required
      >
        <option value="CLIENTE">Cliente</option>
        <option value="DONO">Dono</option>
        <option value="ADMIN">Admin</option>
      </select>

      <button
        type="submit"
        className="w-full border-2 border-[#3E57B3] bg-transparent text-[#32458C] p-2 rounded-xl hover:bg-[#A7B4E3]"
      >
        Registrar
      </button>

      <button
        type="button"
        onClick={() => navigate("/login")}
        className="mt-3 w-full border-2 border-[#3E57B3] bg-transparent text-[#32458C] p-2 rounded-xl hover:bg-[#A7B4E3]"
      >
        Voltar para Login
      </button>
    </form>
  );
}
