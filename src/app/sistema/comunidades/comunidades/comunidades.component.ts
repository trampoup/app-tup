import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/configs/services/auth.service';
import { Setor, CATEGORIAS } from 'src/app/cadastro/categorias-enum';
import { categoriasDescricoes } from 'src/app/cadastro/categorias-descricoes-enum';
import { categoriaImagens } from './categoriasImagens-enum';
import { ComunidadeService } from 'src/app/configs/services/comunidade.service';
import { ComunidadeResponseDTO } from '../ComunidadeResponseDTO';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ModalConfirmationService } from 'src/app/configs/services/modal-confirmation.service';

@Component({
  selector: 'app-comunidades',
  templateUrl: './comunidades.component.html',
  styleUrls: ['./comunidades.component.css']
})


export class ComunidadesComponent implements OnInit {
  @ViewChild('scroller', { static: true }) scroller!: ElementRef<HTMLDivElement>;
  readonly cols = 4;
  categorias: Array<{ key: Setor; label: string; image: string; }> = [];
  isLoading: boolean = false;

  comunidades : ComunidadeResponseDTO[] = [];
  comunidadesPaginados: ComunidadeResponseDTO[] = [];

  paginaAtual: number = 1;
  itensPorPagina: number = 6;
  totalItens: number = this.comunidades.length;
  totalPaginas: number = Math.ceil(this.totalItens / this.itensPorPagina);


  errorMessage: string | null = null;
  mensagemBusca: string | null = null;


  constructor(
    private authService: AuthService,
    private comunidadeService:ComunidadeService,
    private router: Router,
    private http: HttpClient,
    private modalConfirmationService: ModalConfirmationService
  ) {
  }

  ngOnInit(): void {
    const keys = Object.keys(CATEGORIAS) as Setor[];
    this.categorias = keys.map((k) => ({
      key: k,
      label: categoriasDescricoes[k],
      image: categoriaImagens[k],
    }));

    this.obterComunidades();
  }

  isCliente():boolean{
    return this.authService.isCliente();
  }
  
  /** Scroll por “página” (viewport width) com animação suave */
  scroll(direction: 'left' | 'right'): void {
    const el = this.scroller?.nativeElement;
    if (!el) return;
    const amount = el.clientWidth; // 4 itens na maioria dos casos
    el.scrollBy({ left: direction === 'right' ? amount : -amount, behavior: 'smooth' });
  }

  onCategoriaClick(key: Setor) {
    // Faça aqui o que precisar (navegação/filtro)
    // this.router.navigate(['/comunidades', key]);
  }

  getRotaInicial():string{
    return this.authService.getRotaInicial();
  }

  abrirModalConfirmacao(comunidade: ComunidadeResponseDTO) {
    this.modalConfirmationService.open({
      title:'Participar da Comunidade',
      description : `Deseja participar da comunidade <strong>${comunidade.nome}</strong>?`,
      iconSrc: '/assets/icones/logo-trampoup.png',
      confirmButtonClass:'btn-acao.confirmar',
      confirmButtonText: 'Participar +',
    },
    () => {
      this.participarDaComunidade(comunidade.id);
    }
  )
  }

  obterComunidades() {
    this.isLoading = true;
    this.comunidadeService.obterComunidadesComBanners().subscribe({
      next: (lista) => {
        this.comunidades = lista;
        this.comunidadesPaginados = this.comunidades;
        this.isLoading = false;
        
        this.totalItens = this.comunidades.length;
        this.totalPaginas = Math.ceil(this.totalItens / this.itensPorPagina);
        this.atualizarPaginacao();
        
        console.log('Comunidades obtidas:', this.comunidades);
      },
      error: (err) => {
        console.error('Erro ao obter comunidades:', err);
        this.isLoading = false;
      }
    });
  }

  participarDaComunidade(comunidadeId: number) {
    this.comunidadeService.participarDaComunidade(comunidadeId).subscribe({
      next: () => {
        this.router.navigate(['/usuario/visualizar-comunidade', comunidadeId]);
      },
      error: (err) => {
        console.error('Erro ao participar da comunidade:', err);7
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
