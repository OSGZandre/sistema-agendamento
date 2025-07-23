import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function Agendar() {
  const { donoId } = useParams();
  const [servicos, setServicos] = useState([]);
  const [data, setData] = useState(new Date().toISOString().slice(0, 16));
  const [nomeCliente, setNomeCliente] = useState("");
  const [servicoId, setServicoId] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    const fetchServicos = async () => {
      try {
        const response = await api.get(`/servicos/publicos/${donoId}`);
        setServicos(response.data);
      } catch (err) {
        console.log("Erro ao carregar serviços:", err.response?.data);
        setErro("Erro ao carregar serviços deste dono");
      }
    };
    fetchServicos();
  }, [donoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/agendamentos", {
        data,
        nomeCliente,
        servicoId: parseInt(servicoId),
        donoId: parseInt(donoId),
      });
      setSucesso("Agendamento realizado com sucesso!");
      setErro("");
      setData(new Date().toISOString().slice(0, 16));
      setNomeCliente("");
      setServicoId("");
    } catch (err) {
      console.log("Erro ao criar agendamento:", err.response?.data);
      setErro(err.response?.data.mensagem || "Erro ao agendar");
      setSucesso("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Agendar Serviço</h1>
      {erro && <p className="text-red-500 mb-4">{erro}</p>}
      {sucesso && <p className="text-green-500 mb-4">{sucesso}</p>}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-md mx-auto"
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
          Agendar
        </button>
      </form>
    </div>
  );
}
