import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function CreateBusiness() {
  const { email } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email,
    nome: "",
    telefone: "",
    endereco: "",
    descricaoNegocio: "",
    fotoPerfil: null,
  });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, fotoPerfil: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("email", formData.email);
    formDataToSend.append("nome", formData.nome);
    formDataToSend.append("telefone", formData.telefone);
    formDataToSend.append("endereco", formData.endereco);
    formDataToSend.append("descricaoNegocio", formData.descricaoNegocio);
    if (formData.fotoPerfil && typeof formData.fotoPerfil === "string") {
      formDataToSend.append("fotoPerfil", formData.fotoPerfil);
    }

    try {
      const token = localStorage.getItem("token");
      const config = token
        ? {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        : {};
      const response = await api.post(
        "/api/perfil/business/create",
        formDataToSend,
        config
      ); // Ajustado pra /api/perfil
      console.log("Resposta da API:", response.data);
      setSucesso(
        "Negócio criado com sucesso! Redirecionando para pagamento..."
      );
      setTimeout(() => navigate("/payment"), 2000);
    } catch (err) {
      console.error("Erro na requisição:", err.response?.data, err.message);
      setErro("Erro ao criar negócio. Tente novamente.");
      setSucesso("");
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Criar Seu Negócio
        </h2>
        {erro && <p className="text-red-500 mb-4">{erro}</p>}
        {sucesso && <p className="text-green-500 mb-4">{sucesso}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Nome do Negócio</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Telefone</label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Endereço</label>
            <input
              type="text"
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Descrição</label>
            <textarea
              name="descricaoNegocio"
              value={formData.descricaoNegocio}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="4"
            />
          </div>
          <div>
            <label className="block text-gray-700">Foto de Perfil</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Criar Negócio
          </button>
        </form>
      </div>
    </div>
  );
}
