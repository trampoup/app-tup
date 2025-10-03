import { TipoComplemento } from "./cadastrar-localizacao/TipoComplemento.enum"

export class Localizacao{
    id?:number
    estado?:string
    cidade?:string
    rua?:string
    numero?:string
    complemento?:TipoComplemento
    bairro?:string
    cep?:string
    atual?:boolean;
}