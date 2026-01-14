import { Setor } from "src/app/cadastro/categorias-enum";

export interface UsuarioSiteDTO {
  id?: number | null;
  nome?: string | null;
  setor?: Setor | null;
  bio?: string | null;
  skills?: string | null;
  tempoExperiencia?: number | null;
  visualizacoesPerfil?: number | null;
}