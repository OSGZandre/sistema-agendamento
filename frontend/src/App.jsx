import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dono from "./pages/dono";
import Servicos from "./pages/servicos";
import Calendario from "./pages/calendario";
import Agendar from "./pages/agendar";
import Conta from "./pages/conta";
import Home from "./pages/Home";
import CreateBusiness from "./pages/CreateBusiness"; // Corrigido para maiúscula
import Payment from "./pages/Payment";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/cliente"
          element={<div>Página Cliente (em desenvolvimento)</div>}
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
        <Route path="/create-business/:email" element={<CreateBusiness />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </BrowserRouter>
  );
}
