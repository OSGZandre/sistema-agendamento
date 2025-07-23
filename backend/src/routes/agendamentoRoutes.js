import { Router } from "express";
import {
  criarAgendamento,
  listarAgendamentos,
  atualizarAgendamento,
  excluirAgendamento,
} from "../controllers/agendamentoController.js";

const router = Router();

router.post("/", criarAgendamento);
router.get("/", listarAgendamentos);
router.put("/:id", atualizarAgendamento);
router.delete("/:id", excluirAgendamento);

export default router;
