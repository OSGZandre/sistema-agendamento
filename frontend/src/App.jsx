import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";

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
        <Route
          path="/dono"
          element={<div>Página Dono (em desenvolvimento)</div>}
        />
        <Route
          path="/admin"
          element={<div>Página Admin (em desenvolvimento)</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}
