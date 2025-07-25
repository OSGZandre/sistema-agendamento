import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Conta() {
  const { donoId } = useParams();
  const navigate = useNavigate();
  const [perfil, setPerfil] = useState({
    email: "",
    senha: "",
    fotoPerfil: null, // Pode ser string Base64 ou File
    descricaoNegocio: "",
    nome: "",
    telefone: "",
    endereco: "",
  });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        const config = token
          ? { headers: { Authorization: `Bearer ${token}` } }
          : {};
        const response = await api.get(`/perfil/dono/${donoId}`, config);
        setPerfil({
          ...perfil,
          ...response.data,
          senha: "",
          fotoPerfil: response.data.fotoPerfil || null, // String Base64 ou null
        });
      } catch (err) {
        setErro("Erro ao carregar perfil");
      }
    };
    fetchPerfil();
  }, [donoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPerfil((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPerfil((prev) => ({ ...prev, fotoPerfil: reader.result })); // Define como Base64
      };
      reader.readAsDataURL(file); // Converte pra Base64
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", perfil.email);
    formData.append("senha", perfil.senha);
    formData.append("nome", perfil.nome);
    formData.append("telefone", perfil.telefone);
    formData.append("endereco", perfil.endereco);
    formData.append("descricaoNegocio", perfil.descricaoNegocio);
    if (
      perfil.fotoPerfil &&
      typeof perfil.fotoPerfil === "object" &&
      perfil.fotoPerfil instanceof File
    ) {
      formData.append("fotoPerfil", perfil.fotoPerfil); // Envia o File
    } else if (perfil.fotoPerfil && typeof perfil.fotoPerfil === "string") {
      formData.append("fotoPerfil", perfil.fotoPerfil); // Envia Base64 (se já salvo)
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
      await api.put(`/perfil/dono/${donoId}`, formData, config);
      setSucesso("Perfil atualizado com sucesso!");
      setErro("");
    } catch (err) {
      setErro("Erro ao atualizar perfil");
      setSucesso("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6">Minha Conta</h1>
      {erro && <p className="text-red-500 mb-4">{erro}</p>}
      {sucesso && <p className="text-green-500 mb-4">{sucesso}</p>}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-md mx-auto"
      >
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Nome</label>
          <input
            type="text"
            name="nome"
            value={perfil.nome || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={perfil.email || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Senha</label>
          <input
            type="password"
            name="senha"
            value={perfil.senha || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Deixe em branco para não alterar"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Foto de Perfil</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
          {perfil.fotoPerfil && typeof perfil.fotoPerfil === "string" && (
            <img
              src={perfil.fotoPerfil}
              alt="Pré-visualização"
              className="mt-2 w-32 h-32 object-cover rounded-full"
            />
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Descrição do Negócio
          </label>
          <textarea
            name="descricaoNegocio"
            value={perfil.descricaoNegocio || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            placeholder="Descreva seu negócio..."
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Telefone</label>
          <input
            type="tel"
            name="telefone"
            value={perfil.telefone || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Ex.: (11) 98765-4321"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Endereço</label>
          <input
            type="text"
            name="endereco"
            value={perfil.endereco || ""}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="Ex.: Rua Exemplo, 123"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Salvar Alterações
        </button>
      </form>
    </div>
  );
}
