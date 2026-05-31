// Este arquivo contém a lógica de negócio relacionada a doações
// Aqui validamos os dados e interagimos com o banco para registrar doações

import db from "../db";
import { Doacao, DoacaoResponse, DoacaoDetalhada } from "../models/Doacao";

export class DoacaoBusiness {
  // Registra uma nova doação de item no banco de dados
  async registrarDoacao(doacao: Doacao): Promise<DoacaoResponse> {
    const { usuario_id, instituicao_id, tipo_doacao_id, quantidade, status_entrega } = doacao;

    // Verifica se o usuário informado existe
    const usuario = await db("USUARIOS").where({ id: usuario_id }).first();

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    // Verifica se a instituição existe
    const instituicao = await db("INSTITUICOES").where({ id: instituicao_id }).first();

    if (!instituicao) {
      throw new Error("Instituição não encontrada");
    }

    // Verifica se o tipo de doação é válido
    const tipoDoacao = await db("TIPOS_DOACAO").where({ id: tipo_doacao_id }).first();

    if (!tipoDoacao) {
      throw new Error("Tipo de doação não encontrado");
    }

    // Insere a doação na tabela DOACOES
    const [registroId] = await db("DOACOES")
      .insert({
        usuario_id,
        instituicao_id,
        tipo_doacao_id,
        quantidade,
        status_entrega: status_entrega || "pendente",
      })
      .returning("id");

    // Garante compatibilidade com diferentes versões do Knex/Postgres,
    // que podem retornar um objeto { id } ou apenas o número
    const novoId =
      registroId && typeof registroId === "object" && "id" in registroId
        ? Number((registroId as { id: number }).id)
        : Number(registroId);

    // Busca o registro completo para retornar os dados principais
    const registro = await db("DOACOES").where({ id: novoId }).first();

    return {
      id: registro.id,
      usuarioId: registro.usuario_id,
      instituicaoId: registro.instituicao_id,
      tipoDoacaoId: registro.tipo_doacao_id,
      quantidade: Number(registro.quantidade),
      dataDoacao: registro.data_doacao,
      statusEntrega: registro.status_entrega,
    };
  }

  // Lista todas as doações recebidas por uma instituição específica
  async listarDoacoesPorInstituicao(instituicaoId: number): Promise<{
    instituicaoExiste: boolean;
    doacoes: DoacaoDetalhada[];
  }> {
    // Verifica se a instituição existe antes de buscar as doações
    const instituicao = await db("INSTITUICOES").where({ id: instituicaoId }).first();

    if (!instituicao) {
      return {
        instituicaoExiste: false,
        doacoes: [],
      };
    }

    // Busca as doações recebidas pela instituição
    const doacoesDb = await db("DOACOES as d")
      .leftJoin("USUARIOS as u", "d.usuario_id", "u.id")
      .leftJoin("TIPOS_DOACAO as td", "d.tipo_doacao_id", "td.id")
      .where("d.instituicao_id", instituicaoId)
      .orderBy("d.data_doacao", "desc")
      .select(
        "d.id",
        "d.usuario_id",
        "d.instituicao_id",
        "d.tipo_doacao_id",
        "d.quantidade",
        "d.data_doacao",
        "d.status_entrega",
        "u.nome as usuario_nome",
        "td.nome_tipo as tipo_doacao_nome"
      );

    // Formata os dados para retornar
    const doacoes = doacoesDb.map<DoacaoDetalhada>((doacao) => ({
      id: doacao.id,
      usuarioId: doacao.usuario_id,
      usuarioNome: doacao.usuario_nome ?? null,
      instituicaoId: doacao.instituicao_id,
      tipoDoacaoId: doacao.tipo_doacao_id,
      tipoDoacaoNome: doacao.tipo_doacao_nome ?? null,
      quantidade: Number(doacao.quantidade),
      dataDoacao: doacao.data_doacao,
      statusEntrega: doacao.status_entrega ?? null,
    }));

