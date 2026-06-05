import { Knex } from "knex";
import bcrypt from "bcryptjs";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries in dependent tables to avoid foreign key constraints errors
  // Removendo em ordem para respeitar chaves estrangeiras
  await knex("MATCHES").del();
  await knex("SWIPES").del();
  await knex("PET_REPORTADO_APOS_RESGATE").del();
  await knex("STATUS_RESGATE").del();
  await knex("REPORTES_RESGATE").del();
  await knex("PROCESSO_ADOCAO").del();
  await knex("DOACOES").del();
  await knex("FOTOS_PET").del();
  await knex("REQUISITOS_ADOCAO").del();
  await knex("PETS").del();
  await knex("TIPOS_DOACAO").del();
  await knex("INSTITUICOES").del();
  await knex("USUARIOS").del();
  await knex("ENDERECOS").del();

  // Inserts seed entries
  // 1. ENDERECOS
  const [enderecoOng] = await knex("ENDERECOS").insert([
    {
      rua: "Rua das ONGs",
      numero: "100",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01001-000",
    }
  ]).returning("id");

  const [enderecoUser] = await knex("ENDERECOS").insert([
    {
      rua: "Av Paulista",
      numero: "1500",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01310-100",
    }
  ]).returning("id");

  const enderecoOngId = typeof enderecoOng === 'object' ? enderecoOng.id : enderecoOng;
  const enderecoUserId = typeof enderecoUser === 'object' ? enderecoUser.id : enderecoUser;

  // 2. INSTITUICOES
  const [ongId] = await knex("INSTITUICOES").insert([
    {
      nome: "ONG Amigos de Patas",
      cnpj: "12345678000199",
      email: "contato@amigosdepatas.org",
      telefone: "11999998888",
      link_site: "https://amigosdepatas.org",
      descricao: "ONG dedicada ao resgate de animais de rua.",
      endereco_id: enderecoOngId,
    }
  ]).returning("id");

  // 3. USUARIOS
  const senhaHash = await bcrypt.hash("123456", 10);
  const [userId] = await knex("USUARIOS").insert([
    {
      nome: "Usuário Padrão",
      email: "usuario@teste.com",
      senha_hash: senhaHash,
      telefone: "11988887777",
      endereco_id: enderecoUserId,
    }
  ]).returning("id");
  
  // 4. TIPOS DE DOACAO
  await knex("TIPOS_DOACAO").insert([
    { nome_tipo: "Ração", unidade_medida: "kg" },
    { nome_tipo: "Dinheiro", unidade_medida: "BRL" },
    { nome_tipo: "Medicamentos", unidade_medida: "caixa" }
  ]);
  
  // 5. PETS
  await knex("PETS").insert([
    {
      nome: "Rex",
      especie: "Cachorro",
      raca: "Vira-lata",
      sexo: "M",
      idade_aproximada: "2 anos",
      porte: "Médio",
      instituicao_id: typeof ongId === 'object' ? ongId.id : ongId,
      status_adocao: "disponível"
    }
  ]);
}
