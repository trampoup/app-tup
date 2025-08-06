import { TipoUsuario } from "src/app/login/tipo-usuario.enum";

export interface UsuarioPerfil {
    idUsuario: number;
    nome: string;
    email: string;
    tipoUsuario: TipoUsuario;
    endereco: string;
}