import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import servicoRoutes from "./routes/servicoRoutes.js";
import agendamentoRoutes from "./routes/agendamentoRoutes.js";
import perfilRoutes from "./routes/perfilRoutes.js";
import caixaRoutes from "./routes/caixaRoutes.js"; // Nova rota
import bodyParser from "body-parser";
import multer from "multer";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(express.json());

const upload = multer({ limits: { fileSize: 10 * 1024 * 1024 } });
app.use("/api/perfil", upload.single("fotoPerfil"), perfilRoutes);

app.use("/api", authRoutes);
app.use("/api/servicos", servicoRoutes);
app.use("/api/agendamentos", agendamentoRoutes);
app.use("/api/caixa", caixaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
