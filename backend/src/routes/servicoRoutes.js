import { Router } from "express";
import {
  criarServico,
  listarServicos,
  atualizarServico,
  excluirServico,
  listarServicosPublicos,
} from "../controllers/servicoController.js";

const router = Router();

router.post("/", criarServico);
router.get("/", listarServicos);
router.get("/publicos/:donoId", listarServicosPublicos);
router.put("/:id", atualizarServico);
router.delete("/:id", excluirServico);

export default router;
