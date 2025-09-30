import { TipoComplemento } from "./TipoComplemento.enum";

export const TipoComplementoDescricoes : Record<TipoComplemento, string> = {
    [TipoComplemento.CASA] : "Casa",
    [TipoComplemento.APARTAMENTO] : "Apartamento",
    [TipoComplemento.COMERCIAL] : "Comercial",
    [TipoComplemento.CONDOMINIO] : "Condomínio",
    [TipoComplemento.OUTROS] : "Outro"
}