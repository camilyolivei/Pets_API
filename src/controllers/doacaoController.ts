// Este arquivo é o Controller de Doações
// Os Controllers recebem a requisição HTTP, chamam a camada de negócio e enviam a resposta correta

import { Request, Response } from "express";
import { DoacaoBusiness } from "../business/doacaoBusiness";

// Cria uma instância da classe de negócio para usar nos métodos
const doacaoBusiness = new DoacaoBusiness();

export class DoacaoController {
  // Rota POST /doacoes - Registra uma nova doação de item
  async registrarDoacao(req: Request, res: Response) {
    try {
      const { usuario_id, instituicao_id, tipo_doacao_id, quantidade, status_entrega } = req.body;

      // Valida os campos obrigatórios recebidos no corpo da requisição
      if (!usuario_id || !instituicao_id || !tipo_doacao_id || quantidade === undefined) {
        return res.status(400).send({ error: "Informe usuário, instituição, tipo de doação e quantidade." });
      }

      const quantidadeNumero = Number(quantidade);

      if (isNaN(quantidadeNumero) || quantidadeNumero <= 0) {
        return res.status(400).send({ error: "Quantidade deve ser um número maior que zero." });
      }

      // Chama a camada de negócio para validar e salvar a doação
      const novaDoacao = await doacaoBusiness.registrarDoacao({
        usuario_id,
        instituicao_id,
        tipo_doacao_id,
        quantidade: quantidadeNumero,
        status_entrega,
      });

      // Retorna a confirmação com os principais dados da doação registrada
      res.status(201).json({
        message: "Doação registrada com sucesso!",
        doacao: novaDoacao,
      });
    } catch (error: any) {
      console.error(error);

      if (error.message === "Usuário não encontrado" || error.message === "Instituição não encontrada" || error.message === "Tipo de doação não encontrado") {
        return res.status(404).send({ error: error.message });
      }

      res.status(500).send({ error: "Erro ao registrar doação." });
    }
  }

  // Rota GET /doacoes/instituicao/:id - Lista todas as doações recebidas por uma instituição
  async listarDoacoesPorInstituicao(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Valida o parâmetro recebido na rota
      if (!id) {
        return res.status(400).send({ error: "ID inválido." });
      }

      const instituicaoId = Number(id);

      if (isNaN(instituicaoId)) {
        return res.status(400).send({ error: "ID inválido." });
      }

      // Chama a camada de negócio para buscar as doações
      const resultado = await doacaoBusiness.listarDoacoesPorInstituicao(instituicaoId);

      // Se a instituição não existir, retorna 404 com a mensagem solicitada
      if (!resultado.instituicaoExiste) {
        return res.status(404).send({ error: "Instituição não encontrada" });
      }

      // Retorna as doações (array vazio se não houver doações, com status 200)
      res.status(200).json(resultado.doacoes);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Erro ao buscar doações da instituição." });
    }
  }

  // Rota GET /doacoes/usuario/:id - Lista todas as doações realizadas por um usuário
  async listarDoacoesPorUsuario(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).send({ error: "ID inválido." });
      }

      const usuarioId = Number(id);

      if (isNaN(usuarioId)) {
        return res.status(400).send({ error: "ID inválido." });
      }

      const resultado = await doacaoBusiness.listarDoacoesPorUsuario(usuarioId);

      if (!resultado.usuarioExiste) {
        return res.status(404).send({ error: "Usuário não encontrado" });
      }

      res.status(200).json(resultado.doacoes);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Erro ao buscar doações do usuário." });
    }
  }
}

