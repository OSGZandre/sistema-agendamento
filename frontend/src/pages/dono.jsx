import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Dono() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioData = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioData || usuarioData.tipo !== "DONO") {
      navigate("/login"); // Redireciona se não for dono
    } else {
      setUsuario(usuarioData);
    }
  }, [navigate]);

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
      {/* Navbar */}
      <header className="bg-gray-800 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-500">
            TemVaga? {usuario.nome}!
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/dono")}
              className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-600"
            >
              Home
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4">Gerencie seu Negócio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-100 p-6 rounded shadow hover:bg-gray-300">
            <h3 className="text-lg font-semibold mb-2">
              Calendário de Agendamentos
            </h3>
            <p className="text-gray-600 mb-4">
              Veja e gerencie os agendamentos dos seus clientes.
            </p>
            <button
              onClick={() => navigate("/dono/calendario")}
              className="w-full bg-purple-700 text-white p-2 rounded hover:bg-purple-600"
            >
              Acessar Calendário
            </button>
          </div>
          <div className="bg-gray-100 p-6 rounded shadow hover:bg-gray-300">
            <h3 className="text-lg font-semibold mb-2">Gerenciar Serviços</h3>
            <p className="text-gray-600 mb-4">
              Crie e edite os serviços disponíveis para agendamento.
            </p>
            <button
              onClick={() => navigate("/dono/servicos")}
              className="w-full bg-purple-700 text-white p-2 rounded hover:bg-purple-600"
            >
              Gerenciar Serviços
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
