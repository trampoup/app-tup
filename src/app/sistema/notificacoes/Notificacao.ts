export interface Notificacao {
  id: number;
  nomeUsuario: string;
  descricao: string;
  dataNotificacao: Date;
  lida: boolean;
  fotoUrl: string;
}