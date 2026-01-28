import { Component, OnInit } from '@angular/core';
import { TipoUsuario } from 'src/app/login/tipo-usuario.enum';
import { Servico } from '../Servico';
import { AuthService } from 'src/app/configs/services/auth.service';
import { StatusServico } from '../StatusServico';

export interface ServicoHistorico {
  id: number;
  clienteNome: string;
  data: Date;
  status: StatusServico;
  servicoDescricao: string; // ex: endereço/descrição do serviço (coluna "Serviço")
}

@Component({
  selector: 'app-historico-servicos',
  templateUrl: './historico-servicos.component.html',
  styleUrls: ['./historico-servicos.component.css']
})
export class HistoricoServicosComponent implements OnInit {
  isLoading: boolean = false;
  TipoUsuario = TipoUsuario;
  successMessage: string | null = '';
  errorMessage: string | null = '';
  mensagemBusca: string | null = '';

  //Serviços para a visão do profissional
  servicos: ServicoHistorico[] = [];
  servicosPaginados: ServicoHistorico[] = [];
  selectedServico: ServicoHistorico | null = null;

  itensPorPagina: number = 5;
  paginaAtual: number = 1;
  totalItens: number = 0;
  totalPaginas: number = 0;

  constructor(
    private authService : AuthService,
  ) { }

  ngOnInit(): void {
    this.carregarMock();
  }

  private carregarMock(): void {
    const enderecoPadrao =
      'Russas - CE - Travessa Raimundo Maciel Pereira, 41, Apartamento 11, Vila Gonçalves';

    this.servicos = [
      { id: 1, clienteNome: 'Maria', data: new Date(2026, 0, 10), status: StatusServico.CONCLUIDO, servicoDescricao: enderecoPadrao },
      { id: 2, clienteNome: 'Paulo', data: new Date(2026, 0, 12), status: StatusServico.EM_PROGRESSO, servicoDescricao: enderecoPadrao },
      { id: 3, clienteNome: 'Maria', data: new Date(2026, 0, 13), status: StatusServico.CONCLUIDO, servicoDescricao: enderecoPadrao },
      { id: 4, clienteNome: 'Paulo', data: new Date(2026, 0, 14), status: StatusServico.CONCLUIDO, servicoDescricao: enderecoPadrao },
      { id: 5, clienteNome: 'Maria', data: new Date(2026, 0, 15), status: StatusServico.CANCELADO, servicoDescricao: enderecoPadrao },
      { id: 6, clienteNome: 'Paulo', data: new Date(2026, 0, 16), status: StatusServico.CONCLUIDO, servicoDescricao: enderecoPadrao },
    ];

    this.totalItens = this.servicos.length;
    this.paginaAtual = 1;
    this.atualizarPaginacao();
  }

  obterRoleUsuario():TipoUsuario{
    return this.authService.getRoleUsuario();
  }

  getRotaInicial():string{
    return this.authService.getRotaInicial();
  }

  onPaginaMudou(novaPagina: number) {
      this.paginaAtual = novaPagina;
      this.atualizarPaginacao();
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.servicosPaginados = this.servicos.slice(inicio, fim);
  }

  getInitials(nome: string): string {
    if (!nome) return '';
    const parts = nome.trim().split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
    return (first + last).toUpperCase();
  }

  getRandomColor(seed: string): string {
    const colors = [
      '#FFB3BA', // rosa pastel
      '#FFDFBA', // laranja pastel
      '#BAFFC9', // verde pastel
      '#BAE1FF', // azul pastel
      '#D5BAFF'  // roxo pastel
    ];
    const index = seed ? seed.charCodeAt(0) % colors.length : 0;
    return colors[index];
  }

}
