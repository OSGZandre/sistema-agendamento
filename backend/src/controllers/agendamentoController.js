import { PrismaClient } from "@prisma/client";
import { verificarDono } from "../services/authService.js";

const prisma = new PrismaClient();

const diaMap = {
  "SEGUNDA-FEIRA": "SEGUNDA",
  "TERCA-FEIRA": "TERCA",
  "QUARTA-FEIRA": "QUARTA",
  "QUINTA-FEIRA": "QUINTA",
  "SEXTA-FEIRA": "SEXTA",
  SABADO: "SABADO",
  DOMINGO: "DOMINGO",
};

export async function criarAgendamento(req, res) {
  const { data, nomeCliente, servicoId } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    if (!token) {
      return res
        .status(401)
        .json({ mensagem: "Token de autenticação não fornecido" });
    }
    const donoId = await verificarDono(token);
    const servico = await prisma.servico.findUnique({
      where: { id: parseInt(servicoId) },
    });
    if (!servico || servico.donoId !== donoId) {
      throw new Error("Serviço não encontrado ou não pertence a este dono");
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
    if (!token) {
      return res
        .status(401)
        .json({ mensagem: "Token de autenticação não fornecido" });
    }
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

export async function listarHorariosDisponiveis(req, res) {
  const { donoId, data, servicoId } = req.query;

  try {
    const donoIdNum = parseInt(donoId);
    if (isNaN(donoIdNum)) {
      throw new Error("ID do dono inválido");
    }

    // Converter data para objeto Date e extrair dia da semana, normalizando
    const dataSelecionada = new Date(data);
    let diaSemana = dataSelecionada
      .toLocaleDateString("pt-BR", { weekday: "long" })
      .toUpperCase();
    diaSemana = diaMap[diaSemana] || diaSemana.replace("-", ""); // Usa o mapeamento ou remove hífen
    console.log(
      `Verificando horários para donoId=${donoIdNum}, data=${data}, servicoId=${servicoId}, diaSemana=${diaSemana}`
    );

    // Buscar o serviço específico
    const servico = await prisma.servico.findUnique({
      where: { id: parseInt(servicoId), donoId: donoIdNum },
    });
    if (!servico) {
      console.log(
        `Serviço ${servicoId} não encontrado para donoId ${donoIdNum}`
      );
      return res.status(404).json({ mensagem: "Serviço não encontrado" });
    }
    if (!servico.diasDisponiveis.includes(diaSemana)) {
      console.log(
        `Dia ${diaSemana} não está em diasDisponiveis: ${servico.diasDisponiveis}`
      );
      return res
        .status(404)
        .json({
          mensagem: "Nenhum horário disponível para a data selecionada",
        });
    }

    // Buscar agendamentos do dono para o dia
    const agendamentos = await prisma.agendamento.findMany({
      where: {
        donoId: donoIdNum,
        data: {
          gte: new Date(dataSelecionada.setHours(0, 0, 0, 0)),
          lt: new Date(dataSelecionada.setHours(23, 59, 59, 999)),
        },
      },
      include: { servico: true },
    });

    const horariosDisponiveis = [];

    const [horaInicio, minInicio] = servico.horaInicio.split(":").map(Number);
    const [horaFim, minFim] = servico.horaFim.split(":").map(Number);
    let horaAtual = horaInicio * 60 + minInicio; // Em minutos
    const horaFimTotal = horaFim * 60 + minFim;

    console.log(
      `Intervalo: ${servico.horaInicio} - ${servico.horaFim}, duracao: ${
        servico.duracao || 30
      }`
    );

    while (horaAtual < horaFimTotal) {
      // Gerar horários até o fim
      const horarioInicio = new Date(dataSelecionada);
      horarioInicio.setHours(Math.floor(horaAtual / 60), horaAtual % 60, 0, 0);
      const horarioFim = new Date(horarioInicio);
      horarioFim.setMinutes(horarioFim.getMinutes() + (servico.duracao || 30)); // Usar duracao do serviço

      // Verificar se o horário conflita com agendamentos existentes
      const conflita = agendamentos.some((agendamento) => {
        const agendamentoInicio = new Date(agendamento.data);
        const agendamentoFim = new Date(agendamentoInicio);
        agendamentoFim.setMinutes(
          agendamentoFim.getMinutes() + (agendamento.servico.duracao || 30)
        );
        return horarioInicio < agendamentoFim && horarioFim > agendamentoInicio;
      });

      if (!conflita) {
        horariosDisponiveis.push({
          hora: horarioInicio.toISOString(),
          servicoId: servico.id,
          servicoNome: servico.nome,
        });
      }

      horaAtual += 60; // Incremento de 1 hora
    }

    if (horariosDisponiveis.length === 0) {
      console.log("Nenhum horário disponível após verificação");
      return res
        .status(404)
        .json({
          mensagem: "Nenhum horário disponível para a data selecionada",
        });
    }

    console.log(`Horários disponíveis: ${JSON.stringify(horariosDisponiveis)}`);
    res.json(horariosDisponiveis);
  } catch (erro) {
    console.error("Erro na listagem de horários:", erro.message);
    res.status(400).json({ mensagem: erro.message });
  }
}
