import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import FormRegister from "../components/FormRegister";

export default function Register() {
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleRegister = async ({ nome, email, senha, tipo }) => {
    try {
      const response = await api.post("/register", {
        nome,
        email,
        senha,
        tipo,
      });
      console.log("Resposta do backend:", response.data); // Log pra debugar
      const { token, usuario } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));
      navigate("/login"); // Redireciona pro login após cadastro
    } catch (err) {
      console.log("Erro no registro:", err.response?.data, err.message);
      setErro(err.response?.data.mensagem || "Erro ao registrar");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div>
        <FormRegister onRegister={handleRegister} />
        {erro && <p className="text-red-500 text-center mt-2">{erro}</p>}
      </div>
    </div>
  );
}
