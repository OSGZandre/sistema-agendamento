import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";

export default function FormLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, senha });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto p-10 border-2 border-[#3E57B3] bg-white shadow rounded-xl min-h-96"
    >
      <h2 className="text-xl text-[#32458C] font-bold mb-4 text-center">Login</h2>

      <label className="block text-[#32458C] mt-10" >Email</label>
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

      <button
        type="submit"
        className="mt-10 w-full border-2 border-[#3E57B3] bg-transparent text-[#32458C] p-2 rounded-xl hover:bg-[#A7B4E3]"
      >
        Entrar
      </button>

      <button
        type="button"
        onClick={() => navigate("/register")}
        className="mt-4 w-full border-2 border-[#3E57B3] bg-transparent text-[#32458C] p-2 rounded-xl hover:bg-[#A7B4E3] mt-2"
      >
        Não tem conta? Registre-se
      </button>
    </form>
  );
}
