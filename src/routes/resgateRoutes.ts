// Este arquivo define as rotas relacionadas a resgates

import express from "express";
import { ResgateController } from "../controllers/resgateController";

// Cria um roteador para organizar as rotas de resgates
const router = express.Router();

// Cria uma instância do controller para usar nos métodos
const resgateController = new ResgateController();

// POST /resgates/reportar - Cria um novo reporte de animal que precisa ser resgatado
router.post("/reportar", resgateController.reportarResgate);

// GET /resgates - Lista todos os resgates
router.get("/", resgateController.listarResgates);

// PATCH /resgates/:id/status - Atualiza o status do resgate (ex: Resolvido)
router.patch("/:id/status", resgateController.atualizarStatus);

export default router;
