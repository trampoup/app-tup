import { Setor } from "src/app/login/setor.enum";
import { TipoUsuario } from "src/app/login/tipo-usuario.enum";

export class UsuarioDadosDTO{
    id?:number;
    nome!:string;
    email!:string;
    tipoUsuario!:TipoUsuario;
    setor?:Setor;
    endereco?:string;
    cidade!:string;
    estado!:string;
}