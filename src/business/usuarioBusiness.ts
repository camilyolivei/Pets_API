// Este arquivo contém a lógica de negócio relacionada a usuários

import db from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Usuario, UsuarioLogin, UsuarioResponse, Endereco } from "../models/Usuario";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export class UsuarioBusiness {
  async criarUsuario(usuario: Usuario): Promise<UsuarioResponse> {
    const { name, email, password, telefone, endereco } = usuario;

    const usuarioExistente = await db("USUARIOS").where({ email }).first();
    
    if (usuarioExistente) {
      throw new Error("Email já cadastrado"); 
    }

    const senhaHash = await bcrypt.hash(password, 10);

    let enderecoId = null;

    if (endereco) {
      const [retornoEnd] = await db("ENDERECOS").insert({
        rua: endereco.rua,
        numero: endereco.numero,
        complemento: endereco.complemento,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        estado: endereco.estado,
        cep: endereco.cep,
      }).returning("id");
      enderecoId = typeof retornoEnd === 'object' ? retornoEnd.id : retornoEnd;
    }

    const [retornoInsert] = await db("USUARIOS").insert({
      nome: name,
      email,
      senha_hash: senhaHash,
      telefone: telefone || null,
      endereco_id: enderecoId,
    }).returning("id");

    const id = typeof retornoInsert === 'object' ? retornoInsert.id : retornoInsert;

    const result: UsuarioResponse = { id, name, email };
    if (telefone !== undefined) result.telefone = telefone;
    if (endereco !== undefined) result.endereco = endereco;
    return result;
  }

  async login(usuarioLogin: UsuarioLogin): Promise<{ token: string; user: UsuarioResponse }> {
    const { email, password } = usuarioLogin;

    const usuario = await db("USUARIOS").where({ email }).first();
    
    if (!usuario) {
      throw new Error("Credenciais inválidas");
    }

    const senhaValida = await bcrypt.compare(password, usuario.senha_hash);
    
    if (!senhaValida) {
      throw new Error("Credenciais inválidas");
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    const user: UsuarioResponse = {
      id: usuario.id,
      name: usuario.nome,
      email: usuario.email,
    };

    return { token, user };
  }

  async buscarUsuarioPorId(id: number): Promise<UsuarioResponse | null> {
    const usuario = await db("USUARIOS as u")
      .leftJoin("ENDERECOS as e", "u.endereco_id", "e.id")
      .where("u.id", id)
      .select(
        "u.id", "u.nome", "u.email", "u.telefone",
        "e.rua", "e.numero", "e.complemento", "e.bairro", "e.cidade", "e.estado", "e.cep"
      )
      .first();
    
    if (!usuario) return null;

    let endereco = undefined;
    if (usuario.rua) {
      endereco = {
        rua: usuario.rua,
        numero: usuario.numero,
        complemento: usuario.complemento,
        bairro: usuario.bairro,
        cidade: usuario.cidade,
        estado: usuario.estado,
        cep: usuario.cep,
      };
    }

    const result: UsuarioResponse = {
      id: usuario.id,
      name: usuario.nome,
      email: usuario.email,
    };
    if (usuario.telefone !== undefined) result.telefone = usuario.telefone;
    if (endereco !== undefined) result.endereco = endereco;
    
    return result;
  }

  async atualizarUsuario(id: number, dadosAtualizacao: { name?: string; email?: string; telefone?: string; endereco?: Endereco }): Promise<boolean> {
    const updateData: any = {};
    
    if (dadosAtualizacao.name) updateData.nome = dadosAtualizacao.name;
    if (dadosAtualizacao.telefone !== undefined) updateData.telefone = dadosAtualizacao.telefone;
    
    if (dadosAtualizacao.email) {
      const usuarioExistente = await db("USUARIOS")
        .where({ email: dadosAtualizacao.email })
        .whereNot({ id })
        .first();
      
      if (usuarioExistente) {
        throw new Error("Email já está em uso por outro usuário");
      }
      updateData.email = dadosAtualizacao.email;
    }

    if (dadosAtualizacao.endereco) {
      const usuario = await db("USUARIOS").where({ id }).first();
      if (usuario.endereco_id) {
        await db("ENDERECOS").where({ id: usuario.endereco_id }).update({
          rua: dadosAtualizacao.endereco.rua,
          numero: dadosAtualizacao.endereco.numero,
          complemento: dadosAtualizacao.endereco.complemento,
          bairro: dadosAtualizacao.endereco.bairro,
          cidade: dadosAtualizacao.endereco.cidade,
          estado: dadosAtualizacao.endereco.estado,
          cep: dadosAtualizacao.endereco.cep,
        });
      } else {
        const [retornoEnd] = await db("ENDERECOS").insert({
          rua: dadosAtualizacao.endereco.rua,
          numero: dadosAtualizacao.endereco.numero,
          complemento: dadosAtualizacao.endereco.complemento,
          bairro: dadosAtualizacao.endereco.bairro,
          cidade: dadosAtualizacao.endereco.cidade,
          estado: dadosAtualizacao.endereco.estado,
          cep: dadosAtualizacao.endereco.cep,
        }).returning("id");
        updateData.endereco_id = typeof retornoEnd === 'object' ? retornoEnd.id : retornoEnd;
      }
    }

    if (Object.keys(updateData).length === 0) return true; // Nada a atualizar, mas o endereço pode ter sido

    const updatedRows = await db("USUARIOS").where({ id }).update(updateData);
    return true; // Se chegou aqui, ou atualizou usuario, ou endereço, ou os dois
  }

  async deletarUsuario(id: number): Promise<boolean> {
    const deletedRows = await db("USUARIOS").where({ id }).del();
    return deletedRows > 0;
  }
}