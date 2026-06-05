// Este arquivo define os "modelos" (tipos) relacionados a usuários

// Interface para endereço
export interface Endereco {
  rua: string;
  numero?: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep?: string;
}

// Interface para criar um novo usuário
export interface Usuario {
  id?: number;        
  name: string;      
  email: string;      
  password: string;   
  telefone?: string;
  endereco?: Endereco;
}

// Interface para fazer login
export interface UsuarioLogin {
  email: string;      
  password: string;   
}

// Interface para retornar dados do usuário
export interface UsuarioResponse {
  id: number;        
  name: string;       
  email: string;     
  telefone?: string;
  endereco?: Endereco;
}

