import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

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
      <header className="relative flex flex-wrap sm:justify-start sm:flex-nowrap w-full bg-white text-sm py-3 dark:bg-neutral-800">
        <nav className="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center justify-between">
            <a
              className="flex-none text-xl font-semibold dark:text-white focus:outline-none focus:opacity-80"
              href="./dono"
              aria-label="Brand"
            >
              <span className="inline-flex items-center gap-x-2 text-xl font-semibold dark:text-white">
                <img
                  className="w-10 h-auto"
                  src="../assets/img/logo/logo-short.png"
                  alt="Logo"
                />
                TemVaga
              </span>
            </a>
            <div className="sm:hidden">
              <button
                type="button"
                className="hs-collapse-toggle relative size-7 flex justify-center items-center gap-x-2 rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-transparent dark:border-neutral-700 dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
                id="hs-navbar-example-collapse"
                aria-expanded="false"
                aria-controls="hs-navbar-example"
                aria-label="Toggle navigation"
                data-hs-collapse="#hs-navbar-example"
              >
                <svg
                  className="hs-collapse-open:hidden shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1={3} x2={21} y1={6} y2={6} />
                  <line x1={3} x2={21} y1={12} y2={12} />
                  <line x1={3} x2={21} y1={18} y2={18} />
                </svg>
                <svg
                  className="hs-collapse-open:block hidden shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
                <span className="sr-only">Toggle navigation</span>
              </button>
            </div>
          </div>
          <div
            id="hs-navbar-example"
            className="hidden hs-collapse overflow-hidden transition-all duration-300 basis-full grow sm:block"
            aria-labelledby="hs-navbar-example-collapse"
          >
            <div className="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:ps-5">
              <a
                onClick={() => navigate("/dono/servicos")}
                className="font-medium text-blue-500 focus:outline-none"
                aria-current="page"
              >
                Serviços
              </a>
              <a
                onClick={() => navigate("/dono/calendario")}
                className="font-medium text-blue-500 hover:text-gray-400 focus:outline-none focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
              >
                Calendário
              </a>
              <a
                onClick={() => navigate("/conta")}
                className="font-medium text-blue-500 hover:text-gray-400 focus:outline-none focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
              >
                Conta
              </a>
              <a
                onClick={handleLogout}
                className="font-medium text-red-600 hover:text-red-500 focus:outline-none focus:text-gray-400 dark:text-neutral-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500"
              >
                Sair
              </a>
            </div>
          </div>
        </nav>
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
