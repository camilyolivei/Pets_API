// Este arquivo define as rotas relacionadas a doações

import express from "express";
import { DoacaoController } from "../controllers/doacaoController";

// Cria um roteador para organizar as rotas de doações
const router = express.Router();

// Cria uma instância do controller para usar nos métodos
const doacaoController = new DoacaoController();

// POST /doacoes - Registra uma nova doação de item
router.post("/", doacaoController.registrarDoacao);

// GET /doacoes/instituicao/:id - Lista todas as doações recebidas por uma instituição
router.get("/instituicao/:id", doacaoController.listarDoacoesPorInstituicao);

// GET /doacoes/usuario/:id - Lista todas as doações realizadas por um usuário
router.get("/usuario/:id", doacaoController.listarDoacoesPorUsuario);

export default router;

