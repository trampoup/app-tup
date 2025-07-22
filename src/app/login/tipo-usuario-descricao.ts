import { TipoUsuario } from "./tipo-usuario.enum";

export const TipoUsuarioDescricao: Record<TipoUsuario, string> = {
    [TipoUsuario.ADMIN]: 'Administrador',
    [TipoUsuario.PROFISSIONAL]: 'Profissional',
    [TipoUsuario.CLIENTE]: 'Cliente',
}