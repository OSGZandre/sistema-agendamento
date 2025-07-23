import { Router } from "express";
import {
  criarServico,
  listarServicos,
  atualizarServico,
  excluirServico,
} from "../controllers/servicoController.js";

const router = Router();

router.post("/", criarServico);
router.get("/", listarServicos);
router.put("/:id", atualizarServico);
router.delete("/:id", excluirServico);

export default router;
