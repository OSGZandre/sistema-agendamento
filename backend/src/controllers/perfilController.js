import { PrismaClient } from "@prisma/client";
import { verificarDono } from "../services/authService.js";
import bcrypt from "bcrypt";
import express from "express";
import multer from "multer";

const prisma = new PrismaClient();
const app = express();
const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.raw({ type: "image/*", limit: "10mb" }));
app.use(upload.single("fotoPerfil"));

export async function getPerfilDono(req, res) {
  const donoId = parseInt(req.params.donoId);
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id: donoId },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        endereco: true,
        descricaoNegocio: true,
        fotoPerfil: true,
      },
    });
    if (!usuario) {
      return res.status(404).json({ mensagem: "Dono não encontrado" });
    }
    res.json(usuario);
  } catch (erro) {
    console.error("Erro ao buscar perfil:", erro.message);
    res.status(500).json({ mensagem: "Erro interno do servidor" });
  }
}

export async function updatePerfilDono(req, res) {
  const donoId = parseInt(req.params.donoId);
  const { email, nome, telefone, endereco, descricaoNegocio, senha } = req.body;
  let fotoPerfil = req.file
    ? req.file.buffer.toString("base64")
    : req.body.fotoPerfil;

  try {
    const usuario = await prisma.usuario.findUnique({ where: { id: donoId } });
    if (!usuario) {
      return res.status(404).json({ mensagem: "Dono não encontrado" });
    }

    const dataToUpdate = { email, nome, telefone, endereco, descricaoNegocio };
    if (senha) {
      dataToUpdate.senha = await bcrypt.hash(senha, 10);
    }
    if (fotoPerfil) {
      dataToUpdate.fotoPerfil = fotoPerfil;
    }

    const updatedUsuario = await prisma.usuario.update({
      where: { id: donoId },
      data: dataToUpdate,
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        endereco: true,
        descricaoNegocio: true,
        fotoPerfil: true,
      },
    });

    res.json({
      mensagem: "Perfil atualizado com sucesso",
      usuario: updatedUsuario,
    });
  } catch (erro) {
    console.error("Erro ao atualizar perfil:", erro.message);
    res.status(400).json({ mensagem: erro.message });
  }
}

export async function createBusiness(req, res) {
  const { email, nome, telefone, endereco, descricaoNegocio } = req.body;
  let fotoPerfil = req.file
    ? req.file.buffer.toString("base64")
    : req.body.fotoPerfil;

  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extrai o token do Bearer
    if (!token) {
      return res
        .status(401)
        .json({ mensagem: "Token de autenticação ausente" });
    }

    const donoId = await verificarDono(token); // Verifica se é dono
    const usuario = await prisma.usuario.findUnique({ where: { id: donoId } });
    if (!usuario || usuario.tipo !== "DONO") {
      return res
        .status(403)
        .json({ mensagem: "Acesso negado ou usuário não é dono" });
    }

    if (usuario.descricaoNegocio || usuario.fotoPerfil) {
      return res
        .status(400)
        .json({ mensagem: "Negócio já cadastrado para este dono" });
    }

    const negocio = await prisma.usuario.update({
      where: { id: donoId },
      data: { nome, telefone, endereco, descricaoNegocio, fotoPerfil },
      select: {
        id: true,
        nome: true,
        telefone: true,
        endereco: true,
        descricaoNegocio: true,
        fotoPerfil: true,
      },
    });

    res.status(201).json({ mensagem: "Negócio criado com sucesso", negocio });
  } catch (erro) {
    console.error("Erro ao criar negócio:", erro.message);
    res.status(400).json({ mensagem: erro.message });
  }
}
