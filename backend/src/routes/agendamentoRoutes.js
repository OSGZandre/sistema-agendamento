import { Router } from "express";
import {
  criarAgendamento,
  listarAgendamentos,
  atualizarAgendamento,
  excluirAgendamento,
  listarHorariosDisponiveis,
} from "../controllers/agendamentoController.js";

const router = Router();

router.post("/", criarAgendamento);
router.get("/", listarAgendamentos);
router.get("/disponiveis", listarHorariosDisponiveis);
router.put("/:id", atualizarAgendamento);
router.delete("/:id", excluirAgendamento);

export default router;
