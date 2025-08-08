import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import FormLogin from "../components/FormLogin";

export default function Login() {
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async ({ email, senha }) => {
    try {
      const response = await api.post("/api/auth/login", {
        // Adicionado /api
        email,
        senha,
      });
      console.log("Resposta do backend:", response.data);
      const { token, usuario } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      console.log("Tipo do usuário:", usuario.tipo);
      if (usuario.tipo === "CLIENTE") {
        navigate("/cliente");
      } else if (usuario.tipo === "DONO") {
        navigate("/dono");
      } else if (usuario.tipo === "ADMIN") {
        navigate("/admin");
      } else {
        console.log("Tipo de usuário inválido:", usuario.tipo);
        setErro("Tipo de usuário inválido");
      }
    } catch (err) {
      console.log("Erro no login:", err.response?.data, err.message);
      setErro("Email ou senha inválidos.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div>
        <FormLogin onLogin={handleLogin} />
        {erro && <p className="text-red-500 text-center mt-2">{erro}</p>}
      </div>
    </div>
  );
}
