import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/configs/services/auth.service';
import { ComunidadeService } from 'src/app/configs/services/comunidade.service';
import { ModalDeleteService } from 'src/app/configs/services/modal-delete.service';
import { environment } from 'src/environments/environment';
import { ComunidadeResponseDTO } from '../ComunidadeResponseDTO';

@Component({
  selector: 'app-minhas-comunidades',
  templateUrl: './minhas-comunidades.component.html',
  styleUrls: ['./minhas-comunidades.component.css']
})
export class MinhasComunidadesComponent implements OnInit {
  isLoading: boolean = false;
  comunidades : ComunidadeResponseDTO[] = [];
  comunidadesPaginados: ComunidadeResponseDTO[] = [];

  paginaAtual: number = 1;
  itensPorPagina: number = 3;
  totalItens: number = this.comunidades.length;
  totalPaginas: number = Math.ceil(this.totalItens / this.itensPorPagina);



  constructor(
    private authService: AuthService,
    private router: Router,
    private comunidadeService:ComunidadeService,
    private http: HttpClient,
    private modalDeleteService: ModalDeleteService
  ) { }

  ngOnInit(): void {
    this.obterComunidadesParticipando();
  }

  getRotaInicial():string{
    return this.authService.getRotaInicial();
  }

  visualizarComunidade(comunidadeId: number) {
     this.router.navigate(['/usuario/visualizar-comunidade', comunidadeId]);
  }


  obterComunidadesParticipando() {
    this.isLoading = true;
    this.comunidadeService.obterComunidadesParticipandoComBanners().subscribe({
      next: (lista) => {
        this.comunidades = lista;
        this.comunidadesPaginados = this.comunidades;
        this.isLoading = false;
        
        this.totalItens = this.comunidades.length;
        this.totalPaginas = Math.ceil(this.totalItens / this.itensPorPagina);
        this.atualizarPaginacao();
      },
      error: (err) => {
        console.error('Erro ao obter comunidades:', err);
        this.isLoading = false;
      }
    });
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.comunidadesPaginados = this.comunidades.slice(inicio, fim);
  }

  onPaginaMudou(novaPagina: number) {
    this.paginaAtual = novaPagina;
    this.atualizarPaginacao();
  }

  openModalDelete(comunidade:ComunidadeResponseDTO) {
    this.modalDeleteService.openModal({
      title:'Sair da Comunidade',
      description : `Deseja sair da comunidade <strong>${comunidade.nome}</strong>}<strong>?`,
      item:comunidade,
      deletarTextoBotao:'Sair'
    },
    () => {
      this.sairDaComunidade(comunidade.id);
    });
  }

  sairDaComunidade(comunidadeId: number) {
    this.comunidadeService.sairDaComunidade(comunidadeId).subscribe({
      next: () => {
        this.obterComunidadesParticipando();
      },
      error: (err) => {
        console.error('Erro ao sair da comunidade:', err);
      }
    });
  }

  onSearch(searchTerm: string) {
    // if (!searchTerm || searchTerm.trim() === '') {
    //   this.mensagemBusca = '';
    //   this.fetchClientes();
    //   return;
    // }
    // this.isLoading = true;
    // this.clienteService.buscarUsuariosPorNome(searchTerm).subscribe(
    //   (cliente: ApiResponse<ClienteCadastroDTO[]>) => {
    //     this.clientes = cliente.response;
    //     this.paginaAtual = 1;
    //     this.totalItens = this.clientes.length;
    //     this.totalPaginas = Math.ceil(
    //       this.clientes.length / this.itensPorPagina
    //     );
    //     this.atualizarPaginacao();
    //     this.isLoading = false;
    //     if (!cliente || cliente.response.length === 0) {
    //       this.mensagemBusca = 'Busca não encontrada';
    //     }
    //   },
    //   (error) => {
    //     console.error('Erro ao buscar clientes:', error);
    //     this.isLoading = false;
    //     if (error.message && error.message.includes('404')) {
    //       this.clientes = [];
    //       this.totalItens = 0;
    //       this.atualizarPaginacao();
    //       this.mensagemBusca = 'Busca não encontrada';
    //     }
    //   }
    // );
  }
}
