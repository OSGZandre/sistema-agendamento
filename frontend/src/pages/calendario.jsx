import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Calendario() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [data, setData] = useState(new Date().toISOString().slice(0, 16));
  const [nomeCliente, setNomeCliente] = useState("");
  const [servicoId, setServicoId] = useState("");
  const [editando, setEditando] = useState(null);
  const [erro, setErro] = useState("");

  useEffect(() => {
    const usuarioData = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioData || usuarioData.tipo !== "DONO") {
      navigate("/login");
    } else {
      setUsuario(usuarioData);
      fetchAgendamentos();
      fetchServicos();
    }
  }, [navigate]);

  const fetchAgendamentos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/agendamentos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgendamentos(response.data);
    } catch (err) {
      console.log("Erro ao listar agendamentos:", err.response?.data);
      setErro("Erro ao carregar agendamentos");
    }
  };

  const fetchServicos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/servicos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServicos(response.data);
    } catch (err) {
      console.log("Erro ao listar serviços:", err.response?.data);
      setErro("Erro ao carregar serviços");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (editando) {
        const response = await api.put(
          `/agendamentos/${editando.id}`,
          {
            data,
            nomeCliente,
            servicoId: parseInt(servicoId),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAgendamentos(
          agendamentos.map((a) => (a.id === editando.id ? response.data : a))
        );
        resetForm();
      } else {
        const response = await api.post(
          "/agendamentos",
          {
            data,
            nomeCliente,
            servicoId: parseInt(servicoId),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAgendamentos([...agendamentos, response.data]);
        resetForm();
      }
      setErro("");
    } catch (err) {
      console.log("Erro ao salvar agendamento:", err.response?.data);
      setErro(err.response?.data.mensagem || "Erro ao salvar agendamento");
    }
  };

  const handleEdit = (agendamento) => {
    setEditando(agendamento);
    setData(new Date(agendamento.data).toISOString().slice(0, 16));
    setNomeCliente(agendamento.nomeCliente);
    setServicoId(agendamento.servicoId.toString());
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/agendamentos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgendamentos(agendamentos.filter((a) => a.id !== id));
      setErro("");
    } catch (err) {
      console.log("Erro ao excluir agendamento:", err.response?.data);
      setErro("Erro ao excluir agendamento");
    }
  };

  const resetForm = () => {
    setEditando(null);
    setData(new Date().toISOString().slice(0, 16));
    setNomeCliente("");
    setServicoId("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    navigate("/login");
  };

  if (!usuario) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Calendário de Agendamentos - {usuario.nome}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">
          {editando ? "Editar Agendamento" : "Criar Novo Agendamento"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow mb-6"
        >
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Data e Hora</label>
            <input
              type="datetime-local"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Nome do Cliente</label>
            <input
              type="text"
              value={nomeCliente}
              onChange={(e) => setNomeCliente(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Ex.: João Silva"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Serviço</label>
            <select
              value={servicoId}
              onChange={(e) => setServicoId(e.target.value)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecione um serviço</option>
              {servicos.map((servico) => (
                <option key={servico.id} value={servico.id}>
                  {servico.nome} (R${servico.preco.toFixed(2)})
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            {editando ? "Salvar Edição" : "Cadastrar Agendamento"}
          </button>
          {editando && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-700 mt-2"
            >
              Cancelar Edição
            </button>
          )}
        </form>

        {erro && <p className="text-red-500 mb-4">{erro}</p>}

        <h2 className="text-xl font-bold mb-4">Agendamentos</h2>
        {agendamentos.length === 0 ? (
          <p className="text-gray-600">Nenhum agendamento cadastrado.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agendamentos.map((agendamento) => (
              <div
                key={agendamento.id}
                className="bg-white p-4 rounded shadow flex justify-between items-center"
              >
                <div>
                  <p>
                    Data:{" "}
                    {new Date(agendamento.data).toLocaleDateString("pt-BR")}
                  </p>
                  <p>
                    Hora:{" "}
                    {new Date(agendamento.data).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>Cliente: {agendamento.nomeCliente}</p>
                  <p>Serviço: {agendamento.servico?.nome || "Sem serviço"}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleEdit(agendamento)}
                    className="bg-yellow-600 text-white px-2 py-1 rounded hover:bg-yellow-700 mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(agendamento.id)}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
