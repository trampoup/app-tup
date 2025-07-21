import { Setor } from './setor.enum';
import { TipoUsuario } from './tipo-usuario.enum';

export class Usuario {
  id?: number;               
  nome?: string;
  sobrenome?: string;
  telefone?: string;
  email?: string;
  senha?: string;
  cpf?: string;
  cnpj?: string;
  setor?: Setor;
  endereco?: string;
  cidade?: string;
  estado?: string;
  tipoUsuario?: TipoUsuario;
}