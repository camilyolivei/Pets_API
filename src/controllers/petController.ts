// Este arquivo é o Controller de Pets

import { Request, Response } from "express";
import { PetBusiness } from "../business/petBusiness";

// Cria uma instância da classe de negócio para usar nos métodos
const petBusiness = new PetBusiness();

export class PetController {
  // Rota GET /pets - Lista todos os pets cadastrados
  async listarPets(req: Request, res: Response): Promise<void> {
    try {
      const pets = await petBusiness.listarPets();
      
      res.status(200).json(pets);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao listar pets");
    }
  }

  // Rota POST /pets - Cria um novo pet
  async criarPet(req: Request, res: Response): Promise<void> {
    try {
      const { name, type, owner_id, age, desc, cor, vacinado, castrado, ativo, img } = req.body;

      if (!name || !type || !owner_id) {
        res.status(400).send("Nome, tipo e owner_id são obrigatórios");
        return;
      }

      const novoPet = await petBusiness.criarPet({ name, type, owner_id, age, desc, cor, vacinado, castrado, ativo, img });
      
      res.status(201).json(novoPet);
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao criar pet");
    }
  }

  // Rota GET /pets/:id - Busca um pet pelo seu ID
  async buscarPetPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).send("ID inválido");
        return;
      }

      const petId = parseInt(id);

      if (isNaN(petId)) {
        res.status(400).send("ID inválido");
        return;
      }

      const pet = await petBusiness.buscarPetPorId(petId);
      
      if (pet) {
        res.status(200).json(pet);
      } else {
        res.status(404).send("Pet não encontrado");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao buscar pet");
    }
  }

  // Rota PATCH /pets/:id - Atualiza os dados de um pet
  async atualizarPet(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, type, owner_id, age, desc, cor, vacinado, castrado, ativo, img } = req.body;
      
      if (!id) {
        res.status(400).send("ID inválido");
        return;
      }

      const petId = parseInt(id);

      if (isNaN(petId)) {
        res.status(400).send("ID inválido");
        return;
      }

      const atualizado = await petBusiness.atualizarPet(petId, { name, type, owner_id, age, desc, cor, vacinado, castrado, ativo, img });
      
      if (atualizado) {
        res.status(200).send("Pet atualizado com sucesso");
      } else {
        res.status(404).send("Pet não encontrado");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao atualizar pet");
    }
  }

  // Rota DELETE /pets/:id - Deleta um pet
  async deletarPet(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      if (!id) {
        res.status(400).send("ID inválido");
        return;
      }

      const petId = parseInt(id);

      if (isNaN(petId)) {
        res.status(400).send("ID inválido");
        return;
      }

      const deletado = await petBusiness.deletarPet(petId);
      
      if (deletado) {
        res.status(200).send("Pet deletado com sucesso");
      } else {
        res.status(404).send("Pet não encontrado");
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("Erro ao deletar pet");
    }
  }
}