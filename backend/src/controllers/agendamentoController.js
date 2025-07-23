import { PrismaClient } from "@prisma/client";
import { verificarDono } from "../services/authService.js";

const prisma = new PrismaClient();

export async function criarAgendamento(req, res) {
  const { data, nomeCliente, servicoId } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const donoId = await verificarDono(token);
    const servico = await prisma.servico.findUnique({
      where: { id: parseInt(servicoId) },
    });
    if (!servico || servico.donoId !== donoId) {
      throw new Error("Serviço não encontrado ou você não tem permissão");
    }
    const agendamento = await prisma.agendamento.create({
      data: {
        data: new Date(data),
        nomeCliente: nomeCliente || "Cliente não informado",
        servicoId: parseInt(servicoId),
        donoId,
      },
      include: { servico: true },
    });
    res.status(201).json(agendamento);
  } catch (erro) {
    res.status(400).json({ mensagem: erro.message });
  }
}

export async function listarAgendamentos(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const donoId = await verificarDono(token);
    const agendamentos = await prisma.agendamento.findMany({
      where: { donoId },
      include: { servico: true },
    });
    res.json(agendamentos);
  } catch (erro) {
    res.status(400).json({ mensagem: erro.message });
  }
}

export async function atualizarAgendamento(req, res) {
  const { id } = req.params;
  const { data, nomeCliente, servicoId } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const donoId = await verificarDono(token);
    const agendamentoId = parseInt(id);
    if (isNaN(agendamentoId)) {
      throw new Error("ID inválido");
    }
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
    });
    if (!agendamento || agendamento.donoId !== donoId) {
      throw new Error("Agendamento não encontrado ou você não tem permissão");
    }
    const servico = await prisma.servico.findUnique({
      where: { id: parseInt(servicoId) },
    });
    if (!servico || servico.donoId !== donoId) {
      throw new Error("Serviço não encontrado ou você não tem permissão");
    }
    const agendamentoAtualizado = await prisma.agendamento.update({
      where: { id: agendamentoId },
      data: {
        data: new Date(data),
        nomeCliente: nomeCliente || "Cliente não informado",
        servicoId: parseInt(servicoId),
      },
      include: { servico: true },
    });
    res.json(agendamentoAtualizado);
  } catch (erro) {
    res.status(400).json({ mensagem: erro.message });
  }
}

export async function excluirAgendamento(req, res) {
  const { id } = req.params;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const donoId = await verificarDono(token);
    const agendamentoId = parseInt(id);
    if (isNaN(agendamentoId)) {
      throw new Error("ID inválido");
    }
    const agendamento = await prisma.agendamento.findUnique({
      where: { id: agendamentoId },
    });
    if (!agendamento || agendamento.donoId !== donoId) {
      throw new Error("Agendamento não encontrado ou você não tem permissão");
    }
    await prisma.agendamento.delete({ where: { id: agendamentoId } });
    res.status(204).send();
  } catch (erro) {
    res.status(400).json({ mensagem: erro.message });
  }
}
