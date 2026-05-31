// Este arquivo define as rotas relacionadas a adoções

import express from "express";
import { AdocaoController } from "../controllers/adocaoController";

// Cria um roteador para organizar as rotas de adoções
const router = express.Router();

// Cria uma instância do controller para usar nos métodos
const adocaoController = new AdocaoController();

// POST /adocoes - Cria uma nova solicitação de adoção (usuário quer adotar um pet)
router.post("/", adocaoController.criarAdocao);

// PATCH /adocoes/:id/status - Atualiza o status de uma adoção
router.patch("/:id/status", adocaoController.atualizarStatus);

// GET /adocoes/usuario/:id - Lista as solicitações de adoção de um usuário específico
router.get("/usuario/:id", adocaoController.listarAdocoesPorUsuario);

// GET /adocoes/instituicao/:id - Lista as solicitações de adoção recebidas por uma instituição
router.get("/instituicao/:id", adocaoController.listarAdocoesPorInstituicao);

export default router;
