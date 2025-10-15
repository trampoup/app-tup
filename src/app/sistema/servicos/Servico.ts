import { Setor } from "src/app/cadastro/categorias-enum";

export class Servico{
    id?: number;
    nome?: string;
    descricao?: string;
    valor?: number;
    setor?: Setor;
    createdAt?: string;
    bannerUrl?: string  | null; 
}