// Este arquivo contém a lógica de negócio relacionada a pets
// Aqui fazemos todas as operações no banco de dados relacionadas a pets

import db from "../db";
import { Pet, PetResponse } from "../models/Pet";

export class PetBusiness {
  // Busca todos os pets cadastrados no banco de dados
  async listarPets(): Promise<PetResponse[]> {
    const pets = await db("PETS").select("*");

    return pets.map(pet => ({
      id: pet.id,
      name: pet.nome,
      type: pet.especie,
      owner_id: pet.instituicao_id,
      vacinado: pet.vacinado,
      castrado: pet.castrado,
      cor: pet.cor,
      age: pet.idade_aproximada,
      desc: pet.historia,
      data_cadastro: pet.data_cadastro,
      ativo: pet.ativo,
    }));
  }

  // Cria um novo pet no banco de dados
  async criarPet(pet: Pet): Promise<PetResponse> {
    const { name, type, owner_id } = pet;

    // Correção: Adicionado .returning('id') para funcionar no Postgres
    const [retornoInsert] = await db("PETS").insert({
      nome: name,
      especie: type,
      sexo: "N",
      instituicao_id: owner_id,
      vacinado: pet.vacinado ?? false,
      castrado: pet.castrado ?? false,
      cor: pet.cor ?? null,
      idade_aproximada: pet.age ?? null,
      historia: pet.desc ?? null,
      ativo: pet.ativo ?? true,
      status_adocao: "disponível",
    }).returning("id");

    // Extrai o ID de forma segura (pode vir como número ou objeto {id: 1})
    const id = typeof retornoInsert === 'object' ? retornoInsert.id : retornoInsert;

    const novoPet: any = {
      id: id,
      name,
      type,
      owner_id,
      vacinado: pet.vacinado ?? false,
      castrado: pet.castrado ?? false,
      ativo: pet.ativo ?? true,
      age: pet.age ?? null,
      desc: pet.desc ?? null,
    };

    if (pet.cor !== undefined) novoPet.cor = pet.cor;

    return novoPet as PetResponse;
  }

  // Busca um pet específico pelo seu ID
  async buscarPetPorId(id: number): Promise<PetResponse | null> {
    const pet = await db("PETS").where({ id }).first();

    if (!pet) {
      return null;
    }

    return {
      id: pet.id,
      name: pet.nome,
      type: pet.especie,
      owner_id: pet.instituicao_id,
      vacinado: pet.vacinado,
      castrado: pet.castrado,
      cor: pet.cor,
      age: pet.idade_aproximada,
      desc: pet.historia,
      data_cadastro: pet.data_cadastro,
      ativo: pet.ativo,
    };
  }

  // Atualiza os dados de um pet existente
  async atualizarPet(id: number, dadosAtualizacao: any): Promise<boolean> {
    const updateData: any = {};

    if (dadosAtualizacao.name) updateData.nome = dadosAtualizacao.name;
    if (dadosAtualizacao.type) updateData.especie = dadosAtualizacao.type;
    if (dadosAtualizacao.owner_id) updateData.instituicao_id = dadosAtualizacao.owner_id;
    if (dadosAtualizacao.age) updateData.idade_aproximada = dadosAtualizacao.age;
    if (dadosAtualizacao.desc) updateData.historia = dadosAtualizacao.desc;
    if (dadosAtualizacao.ativo !== undefined) updateData.ativo = dadosAtualizacao.ativo;
    if (dadosAtualizacao.vacinado !== undefined) updateData.vacinado = dadosAtualizacao.vacinado;
    if (dadosAtualizacao.castrado !== undefined) updateData.castrado = dadosAtualizacao.castrado;
    if (dadosAtualizacao.cor !== undefined) updateData.cor = dadosAtualizacao.cor;

    if (Object.keys(updateData).length === 0) return false;

    const updatedRows = await db("PETS").where({ id }).update(updateData);
    return updatedRows > 0;
  }

  // Deleta um pet do banco de dados
  async deletarPet(id: number): Promise<boolean> {
    const deletedRows = await db("PETS").where({ id }).del();
    return deletedRows > 0;
  }
}