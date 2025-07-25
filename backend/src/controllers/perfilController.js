import { PrismaClient } from "@prisma/client";
import { verificarDono } from "../services/authService.js";
import bcrypt from "bcrypt";
import express from "express"; // Importe express pra usar o middleware

const prisma = new PrismaClient();
const app = express(); // Instância pra usar middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw({ type: "image/*", limit: "10mb" })); // Suporte a imagens

export async function getPerfilDono(req, res) {
  const { donoId } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  console.log(
    `Requisição GET /api/perfil/dono/${donoId} recebida. Token: ${
      token || "não fornecido"
    }`
  );

  try {
    if (!token) {
      console.log("Erro: Token de autenticação não fornecido");
      return res
        .status(401)
        .json({ mensagem: "Token de autenticação não fornecido" });
    }
    const donoIdNum = await verificarDono(token);
    console.log(`Dono autenticado: ${donoIdNum}`);
    if (parseInt(donoId) !== donoIdNum) {
      console.log("Erro: Acesso não autorizado para donoId", donoId);
      return res.status(403).json({ mensagem: "Acesso não autorizado" });
    }
    const perfil = await prisma.usuario.findUnique({
      where: { id: parseInt(donoId) },
      select: {
        id: true,
        email: true,
        nome: true,
        telefone: true,
        endereco: true,
        descricaoNegocio: true,
        fotoPerfil: true,
        tipo: true,
      },
    });
    if (!perfil || perfil.tipo !== "DONO") {
      console.log("Erro: Dono não encontrado ou tipo inválido para id", donoId);
      return res.status(404).json({ mensagem: "Dono não encontrado" });
    }
    console.log("Perfil encontrado:", perfil);
    res.json(perfil);
  } catch (erro) {
    console.error("Erro ao buscar perfil:", erro.message);
    res.status(400).json({ mensagem: erro.message });
  }
}

export async function updatePerfilDono(req, res) {
  const { donoId } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  console.log(
    `Requisição PUT /api/perfil/dono/${donoId} recebida. Dados brutos:`,
    req.body,
    "Arquivo:",
    req.file
  );

  try {
    if (!token) {
      console.log("Erro: Token de autenticação não fornecido");
      return res
        .status(401)
        .json({ mensagem: "Token de autenticação não fornecido" });
    }
    const donoIdNum = await verificarDono(token);
    console.log(`Dono autenticado: ${donoIdNum}`);
    if (parseInt(donoId) !== donoIdNum) {
      console.log("Erro: Acesso não autorizado para donoId", donoId);
      return res.status(403).json({ mensagem: "Acesso não autorizado" });
    }

    const { email, senha, nome, telefone, endereco, descricaoNegocio } =
      req.body;
    let fotoPerfil = req.file
      ? req.file.buffer.toString("base64")
      : req.body.fotoPerfil;

    const dadosAtualizados = {
      email,
      nome,
      telefone,
      endereco,
      descricaoNegocio,
    };
    if (senha) {
      dadosAtualizados.senha = await bcrypt.hash(senha, 10);
    }
    if (fotoPerfil) {
      dadosAtualizados.fotoPerfil = fotoPerfil;
    }

    const perfilAtualizado = await prisma.usuario.update({
      where: { id: parseInt(donoId) },
      data: dadosAtualizados,
      select: {
        id: true,
        email: true,
        nome: true,
        telefone: true,
        endereco: true,
        descricaoNegocio: true,
        fotoPerfil: true,
      },
    });
    console.log("Perfil atualizado:", perfilAtualizado);
    res.json(perfilAtualizado);
  } catch (erro) {
    console.error("Erro ao atualizar perfil:", erro.message);
    res.status(400).json({ mensagem: erro.message });
  }
}
