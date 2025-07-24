import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import calendario from '../img/calendario.jpg';
import servicos from '../img/servicos.jpg';

export default function Dono() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioData = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioData || usuarioData.tipo !== "DONO") {
      navigate("/login");
    } else {
      setUsuario(usuarioData);
    }
  }, [navigate]);

  if (!usuario) {
    return <div>Carregando...</div>;
  }

  return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        {/* Conteúdo principal */}
        <main className="max-w-5xl mx-auto p-6">
          <h2 className="text-xl font-bold mb-4">Gerencie seu Negócio</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
            <div className="bg-gray-100 p-6 rounded-xl shadow shadow border-2 border-[#3E57B3]">
              <img src={calendario} alt="Calendário" className="w-full h-40 object-cover rounded mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Calendário de Agendamentos
              </h3>
              <p className="text-gray-600 mb-4 ">
                Veja e gerencie os agendamentos dos seus clientes.
              </p>
              <button
                  onClick={() => navigate("/dono/calendario")}
                  className="w-full border-2 border-[#3E57B3] bg-transparent text-black p-2 rounded-xl hover:bg-[#A7B4E3]"
              >
                Acessar Calendário
              </button>
            </div>
            <div className="bg-gray-100 p-6 rounded-xl shadow  border-2 border-[#3E57B3]">
              <img src={servicos} alt="Serviços" className="w-full h-40 object-cover rounded mb-4" />
              <h3 className="text-lg font-semibold mb-2">Gerenciar Serviços</h3>
              <p className="text-gray-600 mb-4">
                Crie e edite os serviços disponíveis para agendamento.
              </p>
              <button
                  onClick={() => navigate("/dono/servicos")}
                  className="w-full border-2 border-[#3E57B3] bg-transparent text-black p-2 rounded-xl hover:bg-[#A7B4E3]"
              >
                Gerenciar Serviços
              </button>
            </div>
          </div>
        </main>
      </div>
  );
}