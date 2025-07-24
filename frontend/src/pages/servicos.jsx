import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Servicos() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [servicos, setServicos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [nome, setNome] = useState("");
  const [preco, setPreco] = useState("");
  const [duracao, setDuracao] = useState("");
  const [metodosPagamento, setMetodosPagamento] = useState([]);
  const [diasDisponiveis, setDiasDisponiveis] = useState([]);
  const [horaInicio, setHoraInicio] = useState("08:00");
  const [horaFim, setHoraFim] = useState("20:00");
  const [erro, setErro] = useState("");

  useEffect(() => {
    const usuarioData = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioData || usuarioData.tipo !== "DONO") {
      navigate("/login");
    } else {
      setUsuario(usuarioData);
      fetchServicos();
    }
  }, [navigate]);

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
    const data = {
      nome,
      preco: parseFloat(preco),
      duracao: parseInt(duracao),
      metodosPagamento,
      diasDisponiveis,
      horaInicio,
      horaFim,
    };
    try {
      const token = localStorage.getItem("token");
      if (editando) {
        const response = await api.put(`/servicos/${editando.id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServicos(
            servicos.map((s) => (s.id === editando.id ? response.data : s))
        );
        setEditando(null);
      } else {
        const response = await api.post("/servicos", data, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServicos([...servicos, response.data]);
      }
      resetForm();
      setErro("");
    } catch (err) {
      console.log("Erro ao salvar serviço:", err.response?.data);
      setErro(err.response?.data.mensagem || "Erro ao salvar serviço");
    }
  };

  const handleEdit = (servico) => {
    setEditando(servico);
    setNome(servico.nome);
    setPreco(servico.preco.toString());
    setDuracao(servico.duracao.toString());
    setMetodosPagamento(servico.metodosPagamento);
    setDiasDisponiveis(servico.diasDisponiveis);
    setHoraInicio(servico.horaInicio);
    setHoraFim(servico.horaFim);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/servicos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServicos(servicos.filter((s) => s.id !== id));
      setErro("");
    } catch (err) {
      console.log("Erro ao excluir serviço:", err.response?.data);
      setErro("Erro ao excluir serviço");
    }
  };

  const resetForm = () => {
    setEditando(null);
    setNome("");
    setPreco("");
    setDuracao("");
    setMetodosPagamento([]);
    setDiasDisponiveis([]);
    setHoraInicio("08:00");
    setHoraFim("20:00");
  };

  const handleVoltar = () => {
    navigate('/dono');
  };

  if (!usuario) {
    return <div>Carregando...</div>;
  }

  return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="bg-transparent text-black border-b-2 border-[#3E57B3] p-4">
          <div className="max-w-5xl mx-auto flex flex-row items-center justify-between gap-4">
            <h1 className="text-2xl font-bold flex-1 min-w-0 break-words">
              Gerenciar Serviços - {usuario.nome}
            </h1>
            <div className="flex-shrink-0">
              <button
                  onClick={handleVoltar}
                  className="bg-transparent text-black px-4 py-2 rounded-xl border-2 border-[#3E57B3] hover:bg-[#A7B4E3]"
              >
                Voltar
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-8xl mx-auto p-6 flex flex-col md:flex-row gap-6 flex-1 h-full">
          <div className="w-full md:w-1/2 bg-white p-6 rounded-xl shadow border-[#3E57B3] border-2 h-full">
            <h2 className="text-xl font-bold mb-4">
              {editando ? "Editar Serviço" : "Cadastrar Novo Serviço"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Nome do Serviço</label>
                <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full p-2 border rounded-xl border-[#3E57B3] border-2"
                    required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Preço (R$)</label>
                <input
                    type="number"
                    step="0.01"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    className="w-full p-2 rounded-xl border-[#3E57B3] border-2"
                    required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Duração (minutos)</label>
                <input
                    type="number"
                    value={duracao}
                    onChange={(e) => setDuracao(e.target.value)}
                    className="w-full p-2 rounded-xl border-[#3E57B3] border-2"
                    required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Métodos de Pagamento</label>
                <div className="flex flex-wrap gap-2">
                  {["PIX", "CARTAO_DEBITO", "CARTAO_CREDITO", "DINHEIRO"].map(
                      (metodo) => (
                          <label key={metodo} className="flex items-center">
                            <input
                                type="checkbox"
                                value={metodo}
                                checked={metodosPagamento.includes(metodo)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setMetodosPagamento([...metodosPagamento, metodo]);
                                  } else {
                                    setMetodosPagamento(
                                        metodosPagamento.filter((m) => m !== metodo)
                                    );
                                  }
                                }}
                                className="w-5 h-5 rounded-full appearance-none border-2 border-[#3E57B3] checked:bg-[#3E57B3] checked:border-transparent mr-2"
                            />
                            {metodo.replace("_", " ")}
                          </label>
                      )
                  )}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Dias Disponíveis</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "SEGUNDA",
                    "TERCA",
                    "QUARTA",
                    "QUINTA",
                    "SEXTA",
                    "SABADO",
                    "DOMINGO",
                  ].map((dia) => (
                      <label key={dia} className="flex items-center">
                        <input
                            type="checkbox"
                            value={dia}
                            checked={diasDisponiveis.includes(dia)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setDiasDisponiveis([...diasDisponiveis, dia]);
                              } else {
                                setDiasDisponiveis(
                                    diasDisponiveis.filter((d) => d !== dia)
                                );
                              }
                            }}
                            className="w-5 h-5 rounded-full appearance-none border-2 border-[#3E57B3] checked:bg-[#3E57B3] checked:border-transparent mr-2"
                        />
                        {dia}
                      </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Horário de Início</label>
                <input
                    type="time"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    className="w-full p-2 rounded-xl border-[#3E57B3] border-2"
                    required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Horário de Fim</label>
                <input
                    type="time"
                    value={horaFim}
                    onChange={(e) => setHoraFim(e.target.value)}
                    className="w-full p-2 rounded-xl border-[#3E57B3] border-2"
                    required
                />
              </div>
              <button
                  type="submit"
                  className="w-full text-black p-2 rounded-xl border-2 border-[#3E57B3] bg-transparent hover:bg-[#A7B4E3]"
              >
                {editando ? "Salvar Edição" : "Cadastrar Serviço"}
              </button>
              {editando && (
                  <button
                      type="button"
                      onClick={resetForm}
                      className="w-full bg-gray-600 text-white p-2 rounded-xl hover:bg-gray-700 mt-2"
                  >
                    Cancelar Edição
                  </button>
              )}
            </form>
            {erro && <p className="text-red-500 mt-4">{erro}</p>}
          </div>

          <div className="w-full md:w-1/2 flex flex-col bg-white rounded-xl border-[#3E57B3] border-2 h-full">
            <h2 className="text-xl font-bold mb-4 mt-4 ml-3">Serviços Cadastrados</h2>
            {servicos.length === 0 ? (
                <p className="text-gray-600 ml-3">Nenhum serviço cadastrado.</p>
            ) : (
                <div className="flex-1 max-h-[600px] overflow-y-auto pr-2">
                  <div className="space-y-4">
                    {servicos.map((servico) => (
                        <div
                            key={servico.id}
                            className="bg-white p-4 ml-3 rounded-xl shadow flex justify-between items-center border-2 border-[#3E57B3]"
                        >
                          <div>
                            <h3 className="text-lg font-semibold">{servico.nome}</h3>
                            <p>Preço: R${servico.preco.toFixed(2)}</p>
                            <p>Duração: {servico.duracao} minutos</p>
                            <p>Métodos: {servico.metodosPagamento.join(", ")}</p>
                            <p>Dias: {servico.diasDisponiveis.join(", ")}</p>
                            <p>
                              Horário: {servico.horaInicio} às {servico.horaFim}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                                onClick={() => handleEdit(servico)}
                                className="rounded-xl border-2 border-[#3E57B3] bg-transparent hover:bg-[#A7B4E3] text-black px-2 py-1"
                            >
                              Editar
                            </button>
                            <button
                                onClick={() => handleDelete(servico.id)}
                                className="bg-transparent text-black border-2 border-red-700 px-2 py-1 rounded-xl hover:bg-red-700 hover:text-white"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                    ))}
                  </div>
                </div>
            )}
          </div>
        </main>
      </div>
  );
}