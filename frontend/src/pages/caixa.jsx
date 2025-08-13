import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Caixa() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [caixa, setCaixa] = useState(null);
  const [suprimento, setSuprimento] = useState("");
  const [agendamentos, setAgendamentos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [vendaExtra, setVendaExtra] = useState({
    valor: "",
    metodo: "",
    produtoId: "",
  });
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  useEffect(() => {
    const usuarioData = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioData || usuarioData.tipo !== "DONO") {
      navigate("/login");
    } else {
      setUsuario(usuarioData);
      fetchCaixaDoDia();
      fetchAgendamentosDoDia();
      fetchProdutos();
    }
  }, [navigate]);

  const fetchCaixaDoDia = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/caixa/dia", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCaixa(response.data);
    } catch (err) {
      console.log("Erro ao listar caixa:", err.response?.data);
      setErro("Erro ao carregar caixa");
    }
  };

  const fetchAgendamentosDoDia = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/agendamentos/dia", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAgendamentos(response.data);
    } catch (err) {
      console.log("Erro ao listar agendamentos do dia:", err.response?.data);
      setErro("Erro ao carregar agendamentos");
    }
  };

  const fetchProdutos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/api/produtos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProdutos(response.data);
    } catch (err) {
      console.log("Erro ao listar produtos:", err.response?.data);
      setErro("Erro ao carregar produtos");
    }
  };

  const handleAbrirCaixa = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/api/caixa/abrir",
        { suprimento },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCaixa(response.data.caixa);
      setSucesso("Caixa aberto com sucesso!");
      setErro("");
    } catch (err) {
      console.log("Erro ao abrir caixa:", err.response?.data);
      setErro("Erro ao abrir caixa");
    }
  };

  const handleFecharCaixa = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/api/caixa/fechar",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCaixa(response.data.caixa);
      setSucesso("Caixa fechado com sucesso!");
      setErro("");
    } catch (err) {
      console.log("Erro ao fechar caixa:", err.response?.data);
      setErro("Erro ao fechar caixa");
    }
  };

  const handleFinalizarAgendamento = async (agendamentoId, metodo, valor) => {
    try {
      const token = localStorage.getItem("token");
      const response = await api.post(
        "/api/caixa/finalizar-agendamento",
        { agendamentoId, metodo, valor },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSucesso("Agendamento finalizado com sucesso!");
      fetchAgendamentosDoDia();
      fetchCaixaDoDia();
      setErro("");
    } catch (err) {
      console.log("Erro ao finalizar agendamento:", err.response?.data);
      setErro("Erro ao finalizar agendamento");
    }
  };

  const handleAdicionarVendaExtra = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await api.post("/api/caixa/venda-extra", vendaExtra, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSucesso("Venda extra adicionada com sucesso!");
      fetchCaixaDoDia();
      setVendaExtra({ valor: "", metodo: "", produtoId: "" });
      setErro("");
    } catch (err) {
      console.log("Erro ao adicionar venda extra:", err.response?.data);
      setErro("Erro ao adicionar venda extra");
    }
  };

  if (!usuario) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-transparent text-black border-b-2 border-[#3E57B3] p-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            Controle de Caixa - {usuario.nome}
          </h1>
          <button
            onClick={() => navigate("/dono")}
            className="bg-transparent text-black px-4 py-2 rounded-xl border-2 border-[#3E57B3] hover:bg-[#A7B4E3]"
          >
            Voltar
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Caixa do Dia</h2>
        {erro && <p className="text-red-500 mb-4">{erro}</p>}
        {sucesso && <p className="text-green-500 mb-4">{sucesso}</p>}
        {caixa ? (
          <div className="bg-white p-6 rounded shadow mb-6">
            <p>Suprimento Inicial: R${caixa.suprimento.toFixed(2)}</p>
            <p>Total Vendas: R${caixa.totalVendas.toFixed(2)}</p>
            <p>Status: {caixa.aberto ? "Aberto" : "Fechado"}</p>
            <button
              onClick={handleFecharCaixa}
              className="mt-4 bg-red-600 text-white p-2 rounded hover:bg-red-700"
              disabled={!caixa.aberto}
            >
              Fechar Caixa
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleAbrirCaixa}
            className="bg-white p-6 rounded shadow mb-6"
          >
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Suprimento Inicial (R$)
              </label>
              <input
                type="number"
                value={suprimento}
                onChange={(e) => setSuprimento(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
            >
              Abrir Caixa
            </button>
          </form>
        )}

        <h2 className="text-xl font-bold mb-4">Agendamentos do Dia</h2>
        {agendamentos.length === 0 ? (
          <p className="text-gray-600">Nenhum agendamento para hoje.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {agendamentos.map((agendamento) => (
              <div key={agendamento.id} className="bg-white p-4 rounded shadow">
                <p>Cliente: {agendamento.nomeCliente}</p>
                <p>Serviço: {agendamento.servico.nome}</p>
                <p>Valor: R${agendamento.servico.preco.toFixed(2)}</p>
                <button
                  onClick={() =>
                    handleFinalizarAgendamento(
                      agendamento.id,
                      "PIX",
                      agendamento.servico.preco
                    )
                  }
                  className="bg-green-600 text-white p-2 rounded hover:bg-green-700 mt-2"
                >
                  Finalizar com PIX
                </button>
              </div>
            ))}
          </div>
        )}

        <h2 className="text-xl font-bold mb-4 mt-6">Adicionar Venda Extra</h2>
        <form
          onSubmit={handleAdicionarVendaExtra}
          className="bg-white p-6 rounded shadow"
        >
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Produto</label>
            <select
              value={vendaExtra.produtoId}
              onChange={(e) =>
                setVendaExtra({ ...vendaExtra, produtoId: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecione um produto</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome} (R${produto.preco.toFixed(2)})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Valor (R$)</label>
            <input
              type="number"
              value={vendaExtra.valor}
              onChange={(e) =>
                setVendaExtra({ ...vendaExtra, valor: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              Método de Pagamento
            </label>
            <select
              value={vendaExtra.metodo}
              onChange={(e) =>
                setVendaExtra({ ...vendaExtra, metodo: e.target.value })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Selecione</option>
              <option value="PIX">PIX</option>
              <option value="CARTAO_DEBITO">Cartão Débito</option>
              <option value="CARTAO_CREDITO">Cartão Crédito</option>
              <option value="DINHEIRO">Dinheiro</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Adicionar Venda
          </button>
        </form>
      </main>
    </div>
  );
}
