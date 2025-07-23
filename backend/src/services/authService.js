import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "segredo_dev";

export async function autenticar(email, senha) {
  console.log("Tentando autenticar:", email);
  const usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario) {
    console.log("Usuário não encontrado para o email:", email);
    throw new Error("Usuário não encontrado");
  }

  console.log("Senha no banco:", usuario.senha);
  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    console.log("Senha inválida para o email:", email);
    throw new Error("Senha Inválida");
  }

  const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, JWT_SECRET, {
    expiresIn: "1d",
  });
  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
    },
  };
}

export async function registrar({ nome, email, senha, tipo }) {
  console.log("Cadastrando usuário:", email);
  const usuarioExistente = await prisma.usuario.findUnique({
    where: { email },
  });
  if (usuarioExistente) {
    throw new Error("Email já cadastrado");
  }

  const hashedPassword = await bcrypt.hash(senha, 10);
  const usuario = await prisma.usuario.create({
    data: { nome, email, senha: hashedPassword, tipo },
  });

  const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, JWT_SECRET, {
    expiresIn: "1d",
  });

  return {
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo,
    },
  };
}
