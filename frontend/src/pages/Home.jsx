import { useNavigate } from "react-router-dom";
import HomePage from "../components/HomePage";

export default function Home() {
  const navigate = useNavigate();

  const handleRegisterAsDono = () => {
    navigate("/register?tipo=DONO");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 flex flex-col items-center justify-between">
      <HomePage />
      <main className="flex-1 flex items-center justify-center w-full h-full relative">
        <div className="absolute inset-0 bg-[url('/src/img/the-jopwell-collection-7A_cWDVGdbI-unsplash.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-[url('/src/img/fundo-de-papel-de-parede-colorido-desfocado-vivido.jpg')] bg-cover bg-center opacity-70"></div>
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="relative z-10 text-center space-y-6 px-4 py-12 max-w-5xl mx-auto">
          <h2 className="text-5xl font-extrabold text-white">Tem Vaga?</h2>
          <p className="text-xl text-white max-w-prose mx-auto font-bold">
            Gerencie seus serviços, agendamentos, caixa e perfil de forma fácil
            e prática. Cadastre-se como dono e comece agora!
          </p>
          <button
            onClick={handleRegisterAsDono}
            className="bg-cyan-600 text-black font-bold px-8 py-3 rounded-lg hover:bg-cyan-500 transition duration-300 transform hover:scale-105"
          >
            Começar Agora
          </button>
        </div>
      </main>
      <footer className="w-full bg-gray-800 text-white p-4 text-center">
        <p>© 2025 TemVaga. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
