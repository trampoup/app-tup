import { TipoUsuario } from "src/app/login/tipo-usuario.enum";
import { Localizacao } from "../localizacao/localizacao";
import { Setor } from "src/app/cadastro/categorias-enum";

export class UsuarioDadosDTO{
    id?:number;
    nome!:string;
    sobrenome?:string
    cpf?:string;
    email!:string;
    tipoUsuario!:TipoUsuario;
    setor?:Setor;
    endereco?:string;
    cidade!:string;
    estado!:string;
    localizacaoAtual?:Localizacao;
}