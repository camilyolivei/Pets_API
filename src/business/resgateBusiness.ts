// Este arquivo contém a lógica de negócio relacionada a resgates

import db from "../db";
import { Resgate } from "../models/Resgate";

export class ResgateBusiness {
  // Cria um novo reporte de resgate no banco de dados
  async reportarResgate(resgate: Resgate) {
    // Correção: Adicionado .returning('id') e tratamento do retorno
    const [retornoInsert] = await db("REPORTES_RESGATE").insert({
      descricao_local: resgate.localizacao || resgate.descricao,
      condicao_animal: resgate.status || "desconhecida",
    }).returning("id");

    const id = typeof retornoInsert === 'object' ? retornoInsert.id : retornoInsert;

    // Retorna o ID do reporte que acabou de ser criado
    return id;
  }

  // Busca todos os resgates pendentes ou urgentes
  async listarResgates() {
    const resgatesDb = await db("REPORTES_RESGATE")
      .select("*")
      .orderBy("data_hora_reporte", "desc");
      
    return resgatesDb.map((r: any) => ({
      id: r.id,
      descricao: r.descricao_local,
      localizacao: r.descricao_local,
      status: r.condicao_animal,
      data: r.data_hora_reporte
    }));
  }
}