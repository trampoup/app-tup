import { Component, OnInit } from '@angular/core';
import { Notificacao } from '../../Notificacao';
import { ModalConfirmationService } from 'src/app/configs/services/modal-confirmation.service';

@Component({
  selector: 'app-notificacao-cliente',
  templateUrl: './notificacao-cliente.component.html',
  styleUrls: ['./notificacao-cliente.component.css']
})
export class NotificacaoClienteComponent implements OnInit {

  isLoading: boolean = false;

  notificacoes: Notificacao[] = [];
  notificacoesFiltradas: Notificacao[] = [];
  notificacoesPaginadas: Notificacao[] = [];

  filtroSelecionado: string = 'todos';

  paginaAtual: number = 1;
  itensPorPagina: number = 5;
  totalItens: number = 0;
  totalPaginas: number = 0;

  constructor(
      private modalConfirmationService: ModalConfirmationService,
  ) {}

  ngOnInit(): void {
    this.carregarNotificacoesMock();
    this.aplicarFiltro();
  }

  private carregarNotificacoesMock(): void {
    const fotoGenerica = 'assets/imagens/foto-perfil-generico.png';

    const agora = Date.now();

    this.notificacoes = [
      {
        id: 1,
        nomeUsuario: 'Paulo Clima LTDA',
        descricao: 'Lembrete de serviço amanhã às 14h.',
        dataNotificacao: new Date(agora - 20 * 60 * 1000), // há 20 minutos
        lida: false,
        fotoUrl: 'assets/imagens/imagens-de-exemplo/foto-profissional.png'
      },
      {
        id: 2,
        nomeUsuario: 'Fernanda Lima',
        descricao: 'enviou uma nova mensagem para você.',
        dataNotificacao: new Date(agora - 2 * 60 * 60 * 1000), // há 2 horas
        lida: false,
        fotoUrl: fotoGenerica
      },
      {
        id: 3,
        nomeUsuario: 'Fernanda Lima',
        descricao: 'enviou uma nova mensagem para você.',
        dataNotificacao: new Date(agora - 5 * 60 * 1000), // há 5 minutos
        lida: false,
        fotoUrl: fotoGenerica
      },
      {
        id: 4,
        nomeUsuario: 'Fernanda Lima',
        descricao: 'enviou uma nova mensagem para você.',
        dataNotificacao: new Date(agora - 26 * 60 * 60 * 1000), // há 1 dia+
        lida: true,
        fotoUrl: fotoGenerica
      },
      {
        id: 5,
        nomeUsuario: 'Fernanda Lima',
        descricao: 'enviou uma nova mensagem para você.',
        dataNotificacao: new Date(agora - 3 * 24 * 60 * 60 * 1000), // há 3 dias
        lida: true,
        fotoUrl: fotoGenerica
      },
      {
        id: 6,
        nomeUsuario: 'Fernanda Lima',
        descricao: 'enviou uma nova mensagem para você.',
        dataNotificacao: new Date(agora - 4 * 24 * 60 * 60 * 1000), // há 3 dias
        lida: true,
        fotoUrl: fotoGenerica
      },
      {
        id: 7,
        nomeUsuario: 'Fernanda Lima',
        descricao: 'enviou uma nova mensagem para você.',
        dataNotificacao: new Date(agora - 4 * 24 * 60 * 60 * 1000), // há 3 dias
        lida: true,
        fotoUrl: fotoGenerica
      }
    ];
  }

  getTempoDecorrido(notificacao: Notificacao): string {
    if (!notificacao?.dataNotificacao) {
      return '';
    }

    const agora = Date.now();
    const data = new Date(notificacao.dataNotificacao).getTime();
    const diffMs = agora - data;

    if (diffMs < 0) {
      return 'agora mesmo';
    }

    const diffSeg = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSeg / 60);
    const diffHoras = Math.floor(diffMin / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffMin < 1) {
      return 'agora mesmo';
    }

    if (diffMin < 60) {
      return `há ${diffMin} minuto${diffMin > 1 ? 's' : ''}`;
    }

    if (diffHoras < 24) {
      return `há ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`;
    }

    return `há ${diffDias} dia${diffDias > 1 ? 's' : ''}`;
  }


  onFiltroChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.filtroSelecionado = select.value;
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
    switch (this.filtroSelecionado) {
      case 'lidas':
        this.notificacoesFiltradas = this.notificacoes.filter(n => n.lida);
        break;
      case 'nao-lidas':
        this.notificacoesFiltradas = this.notificacoes.filter(n => !n.lida);
        break;
      case 'todos':
      default:
        this.notificacoesFiltradas = [...this.notificacoes];
        break;
    }

    this.paginaAtual = 1;
    this.atualizarPaginacao();
  }

  openModalConfirmacao(){
    this.modalConfirmationService.open({
        title: 'Marcar as notificações',
        description: `Tem certeza que deseja marcar todas as notificações como lidas?`,
        confirmButtonText: 'Confirmar',
        size: 'md',
        iconSrc: '/assets/icones/notificacao 2.svg',
      },
      () => {
        this.markAllAsRead();
      }
    );
  }

  markNotificationAsRead(notificacao: Notificacao): void {
    if (notificacao.lida) return;

    notificacao.lida = true;

    // Se o filtro estiver em "não lidas", ao clicar some da lista
    if (this.filtroSelecionado !== 'todos') {
      this.aplicarFiltro();
    } else {
      this.atualizarPaginacao();
    }
  }

  markAllAsRead(): void {
    this.notificacoes.forEach(n => (n.lida = true));
    this.aplicarFiltro();
  }

  atualizarPaginacao(): void {
    this.totalItens = this.notificacoesFiltradas.length;
    this.totalPaginas = Math.ceil(this.totalItens / this.itensPorPagina);

    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;

    this.notificacoesPaginadas = this.notificacoesFiltradas.slice(inicio, fim);
  }

  onPaginaMudou(novaPagina: number): void {
    this.paginaAtual = novaPagina;
    this.atualizarPaginacao();
  }
}
