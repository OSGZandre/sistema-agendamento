import { Router } from "express";
import {
  abrirCaixa,
  fecharCaixa,
  listarCaixaDoDia,
  finalizarAgendamento,
  adicionarVendaExtra,
} from "../controllers/caixaController.js";

const router = Router();

router.post("/abrir", abrirCaixa);
router.post("/fechar", fecharCaixa);
router.get("/dia", listarCaixaDoDia);
router.post("/finalizar-agendamento", finalizarAgendamento);
router.post("/venda-extra", adicionarVendaExtra);

export default router;
