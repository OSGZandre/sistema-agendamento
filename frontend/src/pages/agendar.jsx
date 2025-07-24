import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

export default function Agendar() {
  const { donoId } = useParams();
  const [servicos, setServicos] = useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [dataSelecionada, setDataSelecionada] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [horarioSelecionado, setHorarioSelecionado] = useState("");
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

  useEffect(() => {
    if (servicoId && dataSelecionada) {
      const fetchHorariosDisponiveis = async () => {
        try {
          const response = await api.get(`/agendamentos/disponiveis`, {
            params: { donoId, data: dataSelecionada, servicoId },
          });
          setHorariosDisponiveis(response.data);
          setHorarioSelecionado(""); // Resetar horário ao mudar serviço ou data
        } catch (err) {
          console.log("Erro ao carregar horários:", err.response?.data);
          setErro(
            err.response?.data?.mensagem ||
              "Erro ao carregar horários disponíveis"
          );
        }
      };
      fetchHorariosDisponiveis();
    } else {
      setHorariosDisponiveis([]);
      setHorarioSelecionado("");
    }
  }, [donoId, dataSelecionada, servicoId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!horarioSelecionado) {
      setErro("Selecione um horário disponível");
      return;
    }
    try {
      const token = localStorage.getItem("token"); // Obter token do localStorage
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await api.post(
        "/agendamentos",
        {
          data: horarioSelecionado,
          nomeCliente,
          servicoId: parseInt(servicoId),
          donoId: parseInt(donoId),
        },
        config
      );
      setSucesso("Agendamento realizado com sucesso!");
      setErro("");
      setDataSelecionada(new Date().toISOString().slice(0, 10));
      setHorarioSelecionado("");
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
          <label className="block text-gray-700 mb-2">Data</label>
          <input
            type="date"
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            className="w-full p-2 border rounded"
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
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Horário Disponível</label>
          <select
            value={horarioSelecionado}
            onChange={(e) => setHorarioSelecionado(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={!servicoId}
            required
          >
            <option value="">Selecione um horário</option>
            {horariosDisponiveis.length === 0 && servicoId ? (
              <option value="" disabled>
                Nenhum horário disponível
              </option>
            ) : (
              horariosDisponiveis.map((horario) => (
                <option key={horario.hora} value={horario.hora}>
                  {new Date(horario.hora).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  - {horario.servicoNome}
                </option>
              ))
            )}
          </select>
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
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          disabled={!horarioSelecionado}
        >
          Agendar
        </button>
      </form>
    </div>
  );
}
