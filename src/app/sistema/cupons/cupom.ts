import { TipoCupom } from './tipo-cupom.enum';

export interface Cupom {
  id?: number;
  tipoCupom?: TipoCupom;
  titulo?: string;
  descricao?: string;
  dataInicio?: string;
  dataTermino?: string;
  valor?: number;
}