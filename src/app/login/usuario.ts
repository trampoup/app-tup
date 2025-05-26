import { Setor } from './setor.enum';
import { TipoUsuario } from './tipo-usuario.enum';

export class Usuario {
  id?: number;               
  nome?: string;
  email?: string;
  senha?: string;
  cpf?: string;
  razaoSocial?: string;
  cnpj?: string;
  setor?: Setor;
  endereco?: string;
  cidade?: string;
  estado?: string;
  tipoUsuario?: TipoUsuario;
}