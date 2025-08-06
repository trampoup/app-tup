import { UsuarioDadosDTO } from './UsuarioDadosDTO';

export class Cupom {
  id?: number;
  titulo!: string;
  descricao!: string;
  dataDeInicio!: string;
  dataDeTermino!: string;
  valor!: number;
  qtdCupom!:number;
  criador?:UsuarioDadosDTO;
}