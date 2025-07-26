import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dono from "./pages/dono";
import Servicos from "./pages/servicos";
import Calendario from "./pages/calendario";
import Agendar from "./pages/agendar";
import Conta from "./pages/conta";
import Home from "./pages/Home"; // Importe a nova página Home

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Página inicial */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/cliente"
          element={<div>Página Cliente (em desenvolvimento)</div>}
        />
        <Route
          path="/sobre"
          element={<div>Página sobre (em desenvolvimento)</div>}
        />
        <Route path="/dono" element={<Dono />} />
        <Route path="/dono/calendario" element={<Calendario />} />
        <Route path="/dono/servicos" element={<Servicos />} />
        <Route path="/agendar/:donoId" element={<Agendar />} />
        <Route path="/conta/:donoId" element={<Conta />} />
        <Route
          path="/admin"
          element={<div>Página Admin (em desenvolvimento)</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}
