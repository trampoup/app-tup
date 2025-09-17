import { Setor } from "src/app/login/setor.enum";
import { UsuarioDadosDTO } from "../cupons/UsuarioDadosDTO";

export class ComunidadeResponseDTO{
    id!: number;
    nome!: string;
    setor!: Setor;
    descricao!: string;
    temBanner!: boolean;
    bannerUrl?: string | null
    criador?: UsuarioDadosDTO | null;
}