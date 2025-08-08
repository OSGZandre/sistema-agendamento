import express from "express";
import {
  getPerfilDono,
  updatePerfilDono,
  createBusiness,
} from "../controllers/perfilController.js";

const router = express.Router();

router.get("/dono/:donoId", getPerfilDono);
router.put("/dono/:donoId", updatePerfilDono);
router.post("/business/create", createBusiness);

export default router;
