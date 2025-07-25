import express from "express";
import {
  getPerfilDono,
  updatePerfilDono,
} from "../controllers/perfilController.js";

const router = express.Router();

router.get("/dono/:donoId", getPerfilDono);
router.put("/dono/:donoId", updatePerfilDono);

export default router;
