import { autenticar, registrar } from "../services/authService.js";

export async function login(req, res) {
  const { email, senha } = req.body;

  try {
    const resultado = await autenticar(email, senha);
    res.json(resultado);
  } catch (erro) {
    res.status(401).json({ mensagem: erro.message });
  }
}

export async function register(req, res) {
  const { nome, email, senha, tipo } = req.body;
  try {
    const resultado = await registrar({ nome, email, senha, tipo });
    res.status(201).json(resultado);
  } catch (erro) {
    res.status(400).json({ mensagem: erro.message });
  }
}
