import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import FormRegister from "../components/FormRegister";

export default function Register() {
  const [erro, setErro] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tipo = searchParams.get("tipo");
    if (tipo === "DONO") {
      // Define o tipo como DONO no FormRegister via prop, se vier do query
      document.getElementById("tipoSelect")?.setAttribute("value", "DONO");
    }
  }, [location.search]);

  const handleRegister = async ({ nome, email, senha, tipo }) => {
    try {
      const response = await api.post("/api/auth/register", {
        nome,
        email,
        senha,
        tipo,
      });
      console.log("Resposta do backend:", response.data);
      const { token, usuario } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));
      if (tipo === "DONO") {
        navigate(`/create-business/${email}`);
      } else {
        navigate("/login");
      }
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
