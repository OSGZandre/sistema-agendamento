import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/react.svg";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const usuarioData = JSON.parse(localStorage.getItem("usuario"));
    setUsuario(usuarioData);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleContaClick = () => {
    if (usuario && usuario.id) {
      navigate(`/conta/${usuario.id}`);
    } else {
      navigate("/login");
    }
  };

  return (
    <header className="relative flex flex-col items-center w-full bg-white text-sm py-3">
      <div className="max-w-[85rem] w-full mx-auto px-4 flex flex-row sm:justify-center items-center mb-4">
        <a
          className="flex-none text-xl font-semibold dark:text-white focus:outline-none focus:opacity-80 sm:flex sm:justify-center"
          href="/dono"
          aria-label="Brand"
        >
          <span className="inline-flex items-center gap-x-2 text-xl font-semibold text-black">
            <img className="w-10 h-auto" src={logo} alt="Logo" />
            TemVaga
          </span>
        </a>
        <div className="sm:hidden ml-auto">
          <button
            onClick={toggleMenu}
            className="text-black focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <nav
        className={`max-w-[85rem] w-full mx-auto px-4 ${
          isOpen ? "block" : "hidden"
        } sm:block`}
      >
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-center sm:justify-center sm:gap-5">
          <a
            onClick={() => navigate("/dono/servicos")}
            className="font-medium text-black hover:text-gray-400 focus:outline-none w-full text-center sm:w-auto"
            aria-current="page"
          >
            Serviços
          </a>
          <span className="text-gray-400 dark:text-neutral-500 sm:inline hidden">
            *
          </span>
          <a
            onClick={() => navigate("/dono/calendario")}
            className="font-medium text-black hover:text-gray-400 focus:outline-none focus:text-gray-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500 w-full text-center sm:w-auto"
          >
            Calendário
          </a>
          <span className="text-gray-400 dark:text-neutral-500 sm:inline hidden">
            *
          </span>
          <a
            onClick={handleContaClick}
            className="font-medium text-black hover:text-gray-400 focus:outline-none focus:text-gray-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500 w-full text-center sm:w-auto"
          >
            Conta
          </a>
          <span className="text-gray-400 dark:text-neutral-500 sm:inline hidden">
            *
          </span>
          <a
            onClick={handleLogout}
            className="font-medium text-black hover:text-gray-400 focus:outline-none focus:text-gray-400 dark:hover:text-neutral-500 dark:focus:text-neutral-500 w-full text-center sm:w-auto"
          >
            Sair
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
