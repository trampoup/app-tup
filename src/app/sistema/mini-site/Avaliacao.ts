export interface AvaliacaoDTO {
    id?: number;
    titulo?: string;
    descricao?: string;
    estrela: number;          
    profissionalId: number;
    dataCriacao?: string | Date; 
    clienteId?: number;
    clienteNome?: string;
}