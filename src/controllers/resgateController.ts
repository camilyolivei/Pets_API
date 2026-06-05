// Este arquivo é o Controller de Resgates

import { Request, Response } from "express";
import { ResgateBusiness } from "../business/resgateBusiness";

const resgateBusiness = new ResgateBusiness();

export class ResgateController {
  // Rota POST /resgates/reportar
  async reportarResgate(req: Request, res: Response) {
    try {
      // Correção: Adicionado 'status' na desestruturação
      const { descricao, localizacao, status } = req.body;

      if (!descricao || !localizacao) {
        return res.status(400).send({ error: "Informe descrição e localização." });
      }

      // Correção: Passando o status para a camada de negócio
      await resgateBusiness.reportarResgate({ descricao, localizacao, status });
      
      res.status(201).send({ message: "Resgate reportado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Erro ao reportar resgate." });
    }
  }

  // Rota GET /resgates
  async listarResgates(req: Request, res: Response) {
    try {
      const resgates = await resgateBusiness.listarResgates();
      res.status(200).json(resgates);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Erro ao buscar resgates." });
    }
  }

  // Rota PATCH /resgates/:id/status
  async atualizarStatus(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id as string);
      const { status } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ error: "ID inválido." });
      }

      if (!status) {
        return res.status(400).json({ error: "Status é obrigatório." });
      }

      const atualizado = await resgateBusiness.atualizarStatus(id, status as string);

      if (atualizado) {
        res.status(200).json({ message: "Status do resgate atualizado com sucesso!" });
      } else {
        res.status(404).json({ error: "Resgate não encontrado." });
      }
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message || "Erro ao atualizar status do resgate." });
    }
  }
}