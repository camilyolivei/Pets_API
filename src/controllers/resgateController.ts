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
}