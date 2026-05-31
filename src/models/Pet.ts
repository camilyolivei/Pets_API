// Este arquivo define os "modelos" (tipos) relacionados a pets

// Interface para um pet completo
export interface Pet {
  id?: number;        
  name: string;       
  type: string;      
  owner_id: number;   
  vacinado?: boolean;
  castrado?: boolean;
  cor?: string;
  data_cadastro?: string;
  ativo?: boolean;
  age?: string;
  desc?: string;
  img?: string;
}

// Interface para criar um novo pet (mesma estrutura do Pet)
export interface PetRequest {
  name: string;      
  type: string;       
  owner_id: number;   
  vacinado?: boolean;
  castrado?: boolean;
  cor?: string;
  age?: string;
  desc?: string;
  img?: string;
}

// Interface para retornar dados do pet
export interface PetResponse {
  id: number;         
  name: string;       
  type: string;      
  owner_id: number;   
  vacinado?: boolean;
  castrado?: boolean;
  cor?: string;
  data_cadastro?: string;
  ativo?: boolean;
  age?: string;
  desc?: string;
  img?: string;
}

