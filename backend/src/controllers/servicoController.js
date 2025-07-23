import { PrismaClient } from "@prisma/client";
import { verificarDono } from "../services/authService.js";

const prisma = new PrismaClient();

export async function criarServico(req, res) {
  const {
    nome,
    preco,
    duracao,
    metodosPagamento,
    diasDisponiveis,
    horaInicio,
    horaFim,
  } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const donoId = await verificarDono(token);
    const servico = await prisma.servico.create({
      data: {
        nome,
        preco,
        duracao,
        metodosPagamento,
        diasDisponiveis,
        horaInicio,
        horaFim,
        donoId,
      },
    });
    res.status(201).json(servico);
  } catch (erro) {
    res.status(400).json({ mensagem: erro.message });
  }
}

export async function listarServicos(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const donoId = await verificarDono(token);
    const servicos = await prisma.servico.findMany({
      where: { donoId },
    });
    res.json(servicos);
  } catch (erro) {
    res.status(400).json({ mensagem: erro.message });
  }
}

export async function listarServicosPublicos(req, res) {
  const { donoId } = req.params;

  try {
    const servicos = await prisma.servico.findMany({
      where: { donoId: parseInt(donoId) },
    });
    if (servicos.length === 0) {
      return res
        .status(404)
        .json({ mensagem: "Nenhum serviço encontrado para este dono" });
    }
    res.json(servicos);
  } catch (erro) {
    res.status(400).json({ mensagem: erro.message });
  }
}

export async function atualizarServico(req, res) {
  const { id } = req.params;
  const {
    nome,
    preco,
    duracao,
    metodosPagamento,
    diasDisponiveis,
    horaInicio,
    horaFim,
  } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const donoId = await verificarDono(token);
    const servicoId = parseInt(id);
    if (isNaN(servicoId)) {
      throw new Error("ID inválido");
    }
    const servico = await prisma.servico.findUnique({
      where: { id: servicoId },
    });
    if (!servico || servico.donoId !== donoId) {
      throw new Error("Serviço não encontrado ou você não tem permissão");
    }
    const servicoAtualizado = await prisma.servico.update({
      where: { id: servicoId },
      data: {
        nome,
        preco,
        duracao,
        metodosPagamento,
        diasDisponiveis,
        horaInicio,
        horaFim,
      },
    });
    res.json(servicoAtualizado);
  } catch (erro) {
    res.status(400).json({ mensagem: erro.message });
  }
}

export async function excluirServico(req, res) {
  const { id } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const donoId = await verificarDono(token);
    const servicoId = parseInt(id);
    if (isNaN(servicoId)) {
      throw new Error("ID inválido");
    }
    const servico = await prisma.servico.findUnique({
      where: { id: servicoId },
    });
    if (!servico || servico.donoId !== donoId) {
      throw new Error("Serviço não encontrado ou você não tem permissão");
    }
    await prisma.servico.delete({ where: { id: servicoId } });
    res.status(204).send();
  } catch (erro) {
    res.status(400).json({ mensagem: erro.message });
  }
}
