import { PrismaClient } from "@prisma/client";
import { verificarDono } from "../services/authService.js";

const prisma = new PrismaClient();

export async function abrirCaixa(req, res) {
  const { suprimento } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      return res
        .status(401)
        .json({ mensagem: "Token de autenticação não fornecido" });
    }
    const donoId = await verificarDono(token);
    const dataAtual = new Date().toISOString().slice(0, 10); // Data do dia

    // Verifica se já existe um caixa aberto pra hoje
    const caixaExistente = await prisma.caixa.findFirst({
      where: {
        donoId,
        dataAbertura: {
          gte: new Date(dataAtual),
          lt: new Date(dataAtual + "T23:59:59.999Z"),
        },
        aberto: true,
      },
    });
    if (caixaExistente) {
      return res.status(400).json({ mensagem: "Caixa já aberto para hoje" });
    }

    const caixa = await prisma.caixa.create({
      data: { donoId, suprimento: parseFloat(suprimento) },
    });
    res.status(201).json({ mensagem: "Caixa aberto com sucesso", caixa });
  } catch (erro) {
    res.status(400).json({ mensagem: erro.message });
  }
}

export async function fecharCaixa(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      return res
        .status(401)
        .json({ mensagem: "Token de autenticação não fornecido" });
    }
    const donoId = await verificarDono(token);
    const dataAtual = new Date().toISOString().slice(0, 10);

    const caixaAberto = await prisma.caixa.findFirst({
      where: {
        donoId,
        dataAbertura: {
          gte: new Date(dataAtual),
          lt: new Date(dataAtual + "T23:59:59.999Z"),
        },
        aberto: true,
      },
    });
    if (!caixaAberto) {
      return res.status(400).json({ mensagem: "Nenhum caixa aberto hoje" });
    }

    const pagamentos = await prisma.pagamento.findMany({
      where: { caixaId: caixaAberto.id },
    });
    const totalVendas = pagamentos.reduce((sum, p) => sum + p.valor, 0);

    const caixaFechado = await prisma.caixa.update({
      where: { id: caixaAberto.id },
      data: { dataFechamento: new Date(), aberto: false, totalVendas },
    });
    res.json({ mensagem: "Caixa fechado com sucesso", caixa: caixaFechado });
  } catch (erro) {
    res.status(400).json({ mensagem: erro.message });
  }
}

export async function listarCaixaDoDia(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      return res
        .status(401)
        .json({ mensagem: "Token de autenticação não fornecido" });
    }
    const donoId = await verificarDono(token);
    const dataAtual = new Date().toISOString().slice(0, 10);

    const caixa = await prisma.caixa.findFirst({
      where: {
        donoId,
        dataAbertura: {
          gte: new Date(dataAtual),
          lt: new Date(dataAtual + "T23:59:59.999Z"),
        },
      },
      include: { pagamentos: true },
    });
    if (!caixa) {
      return res
        .status(404)
        .json({ mensagem: "Nenhum caixa encontrado para hoje" });
    }
    res.json(caixa);
  } catch (erro) {
    res.status(400).json({ mensagem: erro.message });
  }
}

export async function finalizarAgendamento(req, res) {
  const { agendamentoId, metodo, valor, produtoId } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      return res
        .status(401)
        .json({ mensagem: "Token de autenticação não fornecido" });
    }
    const donoId = await verificarDono(token);
    const dataAtual = new Date().toISOString().slice(0, 10);

    const caixaAberto = await prisma.caixa.findFirst({
      where: {
        donoId,
        dataAbertura: {
          gte: new Date(dataAtual),
          lt: new Date(dataAtual + "T23:59:59.999Z"),
        },
        aberto: true,
      },
    });
    if (!caixaAberto) {
      return res.status(400).json({ mensagem: "Nenhum caixa aberto hoje" });
    }

    const pagamento = await prisma.pagamento.create({
      data: {
        caixaId: caixaAberto.id,
        agendamentoId,
        produtoId,
        valor: parseFloat(valor),
        metodo,
      },
    });

    if (agendamentoId) {
      await prisma.agendamento.delete({ where: { id: agendamentoId } });
    }

    res.json({
      mensagem: "Pagamento registrado e agendamento finalizado",
      pagamento,
    });
  } catch (erro) {
    res.status(400).json({ mensagem: erro.message });
  }
}

export async function adicionarVendaExtra(req, res) {
  const { valor, metodo, produtoId } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      return res
        .status(401)
        .json({ mensagem: "Token de autenticação não fornecido" });
    }
    const donoId = await verificarDono(token);
    const dataAtual = new Date().toISOString().slice(0, 10);

    const caixaAberto = await prisma.caixa.findFirst({
      where: {
        donoId,
        dataAbertura: {
          gte: new Date(dataAtual),
          lt: new Date(dataAtual + "T23:59:59.999Z"),
        },
        aberto: true,
      },
    });
    if (!caixaAberto) {
      return res.status(400).json({ mensagem: "Nenhum caixa aberto hoje" });
    }

    const pagamento = await prisma.pagamento.create({
      data: {
        caixaId: caixaAberto.id,
        produtoId,
        valor: parseFloat(valor),
        metodo,
      },
    });

    res.json({ mensagem: "Venda extra registrada", pagamento });
  } catch (erro) {
    res.status(400).json({ mensagem: erro.message });
  }
}
