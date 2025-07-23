import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dono from "./pages/dono";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/cliente"
          element={<div>Página Cliente (em desenvolvimento)</div>}
        />
        <Route path="/dono" element={<Dono />} />
        <Route
          path="/dono/calendario"
          element={<div>Página Calendário (em desenvolvimento)</div>}
        />
        <Route
          path="/dono/servicos"
          element={<div>Página Serviços (em desenvolvimento)</div>}
        />
        <Route
          path="/admin"
          element={<div>Página Admin (em desenvolvimento)</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}
