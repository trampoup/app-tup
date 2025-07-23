export interface UsuarioCadastroDTO{
    id?: string;
    nome: string; //razão social
    sobrenome:string;
    email: string;
    senha: string;
    telefone: string;
    cpf: string;
    cnpj: string;
    endereco: string;
    cidade: string;
    estado: string;
    setor: string;
    tipoUsuario:string;
}