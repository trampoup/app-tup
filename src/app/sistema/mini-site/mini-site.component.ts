import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/configs/services/auth.service';
import { TipoUsuario } from 'src/app/login/tipo-usuario.enum';
import { UsuarioSiteDTO } from './cadastrar-site/usuario-site-dto';
import { categoriasDescricoes } from 'src/app/cadastro/categorias-descricoes-enum';
import { Servico } from '../servicos/Servico';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ServicosService } from 'src/app/configs/services/servicos.service';
import { UsuarioMidiasService } from 'src/app/configs/services/usuario-midias.service';
import { UsuarioService } from 'src/app/configs/services/usuario.service';
import { filter } from 'rxjs';
import { ModalConfirmationService } from 'src/app/configs/services/modal-confirmation.service';
import { ModalGenericoService } from 'src/app/configs/services/modal-generico.service';
import { AvaliacaoDTO } from './Avaliacao';
import { AvaliacaoService } from 'src/app/configs/services/avaliacao.service';

@Component({
  selector: 'app-mini-site',
  templateUrl: './mini-site.component.html',
  styleUrls: ['./mini-site.component.css']
})
export class MiniSiteComponent implements OnInit {
  TipoUsuario = TipoUsuario;
  categoriasDescricoes = categoriasDescricoes;

  isLoading = false;
  isFavorito: boolean = false;

  perfil: UsuarioSiteDTO | null = null;
  skillsLista: string[] = [];

  servicos: Servico[] = [];
  servicosPaginados: Servico[] = [];
  
  // Paginacao de servicos
  paginaAtualServicos = 1;
  itensPorPaginaServicos = 6;
  totalPaginasServicos = Math.ceil(this.servicos.length / this.itensPorPaginaServicos);

  avaliacoes: AvaliacaoDTO[] = [];
  avaliacoesPaginadas: AvaliacaoDTO[] = [];

  // Paginação de avaliações
  paginaAtualAvaliacoes = 1;
  itensPorPaginaAvaliacoes = 6;
  mediaAvaliacoes = 0;
  
  bannerUrl: string | null = null;
  fotoUrl: string | null = null;
  videoUrl: SafeUrl | null = null;
  private videoObjectUrl: string | null = null;

  @ViewChild('avaliacaoTemplate') avaliacaoTemplate!: TemplateRef<any>;

  avaliacaoEstrelas = 0;
  avaliacaoTitulo = '';
  avaliacaoTexto = '';
  avaliacaoErro: string | null = null;
  starHover = 0;

  fotosClientes: Record<number, string | null> = {};

  
  constructor(
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private usuarioMidiasService: UsuarioMidiasService,
    private servicosService: ServicosService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private router: Router,
    private el: ElementRef,
    private modalConfirmationService : ModalConfirmationService,
    private modalGenericoService : ModalGenericoService,
    private avaliacaoService : AvaliacaoService
  ) { }


  ngOnInit(): void {
    this.atualizarPaginacaoServicos();


    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);
    if (!id || Number.isNaN(id)) {
      this.isLoading = false;
      return;
    }
    this.carregarPerfilPublico(id);
    this.isFavorito = this.verificarSeEhFavorito(id);
    this.carregarServicosComBannner(id);
    this.carregarMidiasPublicas(id);
    this.carregarAvaliacoes(id);
  }

  private scrollToTop(): void {
    const container = this.el.nativeElement.closest('mat-drawer-content');
    if (container) {
      container.scrollTop = 0;
    }
  }

  // ----- Perfil (dados)
  private carregarPerfilPublico(id: number) {
    this.usuarioService.obterSitePorIdUsuario(id).subscribe({
      next: (dto) => {
        this.perfil = dto;
        const raw = dto?.skills ?? '';
        this.skillsLista = raw.split(/[;,]/).map(s => s.trim()).filter(Boolean);
        this.scrollToTop();
      },
      error: () => {},
      complete: () => this.isLoading = false
    });
  }

  private carregarServicosComBannner(id : number | string) {
    this.servicosService.obterServicosPorProfissionalComBanners(id).subscribe({
      next: (servicos) => {
        this.servicos = servicos ?? [];
        this.atualizarPaginacaoServicos();
      },
      error: (err) => console.error('Erro ao obter serviços', err),
    });
  }

  private carregarMidiasPublicas(id: number) {
    // banner
    this.usuarioMidiasService.getMidiaDoUsuario('banner', id).subscribe({
      next: (blob) => {
        if (!blob || blob.size === 0) return;
        const typed = blob.type?.startsWith('image/') ? blob : new Blob([blob], { type: 'image/jpeg' });
        const reader = new FileReader();
        reader.onload = () => this.bannerUrl = reader.result as string;
        reader.readAsDataURL(typed);
      }
    });

    // foto perfil
    this.usuarioMidiasService.getMidiaDoUsuario('foto_perfil', id).subscribe({
      next: (blob) => {
        if (!blob || blob.size === 0) return;
        const typed = blob.type?.startsWith('image/') ? blob : new Blob([blob], { type: 'image/jpeg' });
        const reader = new FileReader();
        reader.onload = () => this.fotoUrl = reader.result as string;
        reader.readAsDataURL(typed);
      }
    });


    this.usuarioMidiasService.getMidiaDoUsuario('video', id).subscribe({
      next: (blob) => {
        if (!blob || blob.size === 0) return;

        const typed = blob.type?.startsWith('video/')
          ? blob
          : new Blob([blob], { type: 'video/mp4' });

        // revoga o anterior (evita vazamento de memória)
        if (this.videoObjectUrl) URL.revokeObjectURL(this.videoObjectUrl);

        // cria o Object URL e sanitiza
        this.videoObjectUrl = URL.createObjectURL(typed);
        this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(this.videoObjectUrl); // <-- AQUI
      }
    });

  }

  ngOnDestroy(): void {
    if (this.videoObjectUrl) {
      URL.revokeObjectURL(this.videoObjectUrl);
      this.videoObjectUrl = null;
  }}
  // valores mockados só para visual
  userScore = 120;
  maxScore = 200;

  get progressPercent(): number {
    return Math.min(100, Math.round((this.userScore / this.maxScore) * 100));
  }


  getRoleUsuario(): TipoUsuario {
    return this.authService.getRoleUsuario();
  }


  atualizarPaginacaoServicos(): void {
    const inicio = (this.paginaAtualServicos - 1) * this.itensPorPaginaServicos;
    const fim = inicio + this.itensPorPaginaServicos;
    this.servicosPaginados = this.servicos.slice(inicio, fim);
  }

  get totalItensServicos() {
    return this.servicos.length; 
  }

  onPaginaMudouServicos(novaPagina: number) {
    this.paginaAtualServicos = novaPagina;
    this.atualizarPaginacaoServicos();
  }

  redirectToGameficacao(){
    this.router.navigate(['/usuario/gameficacao']);
  }

  redirectToEditarSite(){
    this.router.navigate(['/usuario/cadastro-de-site']);
  }

  verificarSeEhFavorito(id:number): boolean {
    this.usuarioService.verificarSeEhFavorito(id).subscribe({
      next: (isFavorito) => {
        this.isFavorito = isFavorito;
      },
      error: (err) => {
        console.error('Erro ao verificar se é favorito', err);
        return false;
      }
    });
    return false;
  }

  abrirModalFavoritar(){
    this.modalConfirmationService.open({
      title: 'Favoritar Profissional',
      iconSrc: '/assets/icones/save-icon.svg',
      description: 'Deseja adicionar este profissional aos seus favoritos?',
      confirmButtonText: 'Sim',
    },
    () =>{
      this.favoritarProfissional();
    }
  );
  }

  favoritarProfissional(){
    if (!this.perfil?.id) {
      console.error('ID do profissional não disponível para favoritar.');
      return;
    }
    this.usuarioService.favoritarProfissional(this.perfil?.id!).subscribe({
      next: () => {
        this.isFavorito = true;
      },
      error: (err) => {
        console.error('Erro ao favoritar profissional', err);
      }
    });
  }

  abrirModalDesfavoritar(){
    this.modalConfirmationService.open({
      title: 'Desfavoritar Profissional',
      iconSrc: '/assets/icones/save-icon.svg',
      description: 'Deseja remover este profissional dos seus favoritos?',
      confirmButtonText: 'Sim',
    },
    () =>{
      this.desfavoritarProfissional();
    }
  );
  }

  desfavoritarProfissional(){
    if (!this.perfil?.id) {
      console.error('ID do profissional não disponível para favoritar.');
      return;
    }
    this.usuarioService.desfavoritarProfissional(this.perfil?.id!).subscribe({
      next: () => {
        this.isFavorito = false;
      },
      error: (err) => {
        console.error('Erro ao desfavoritar profissional', err);
      }
    });
  }

  abrirModalAvaliarProfissional(): void {
    this.avaliacaoEstrelas = 0;
    this.avaliacaoTitulo = '';
    this.avaliacaoTexto = '';
    this.avaliacaoErro = null;
    this.starHover = 0;

    this.modalGenericoService.openModal(
      {
        title: 'Avaliar Profissional',
        confirmTextoBotao: 'Enviar',
        cancelTextoBotao: 'Cancelar',
        showFooter: true,
        size: 'lg'
      },
      () => this.onConfirmAvaliacao(),   
      this.avaliacaoTemplate            
    );
  }

  onConfirmAvaliacao(): boolean {
    this.avaliacaoErro = null;

    const titulo = this.avaliacaoTitulo.trim();
    const texto  = this.avaliacaoTexto.trim();

    // validações de campos obrigatórios
    if (!this.avaliacaoEstrelas) {
      this.avaliacaoErro = 'Selecione uma nota de 1 a 5 estrelas para o serviço.';
      return false;
    }

    if (!titulo) {
      this.avaliacaoErro = 'Digite um título curto para a sua avaliação.';
      return false;
    }

    if (!texto) {
      this.avaliacaoErro = 'Escreva um comentário contando como foi o serviço.';
      return false;
    }

    // validações de tamanho (espelha o backend)
    if (titulo.length > 50) {
      this.avaliacaoErro = 'O título da avaliação pode ter no máximo 50 caracteres.';
      return false;
    }

    if (texto.length > 150) {
      this.avaliacaoErro = 'O texto da avaliação pode ter no máximo 150 caracteres.';
      return false;
    }

    if (!this.perfil?.id) {
      this.avaliacaoErro = 'Não foi possível identificar o profissional a ser avaliado.';
      return false;
    }


    const dto: AvaliacaoDTO = {
      titulo: this.avaliacaoTitulo.trim(),
      descricao: this.avaliacaoTexto.trim(),
      estrela: this.avaliacaoEstrelas,
      profissionalId: this.perfil.id
    };

    this.avaliacaoService.criar(dto).subscribe({
      next: (resp) => {
        // adiciona na lista local
        this.avaliacoes.unshift(resp);
        this.atualizarMediaAvaliacoes();
        this.atualizarPaginacaoAvaliacoes();
      },
      error: (err) => {
        console.error('Erro ao enviar avaliação', err);
      }
    });
    return true;
  }

  setAvaliacaoEstrelas(valor: number): void {
    this.avaliacaoEstrelas = valor;
  }

  onStarHover(valor: number): void {
    this.starHover = valor;
  }

  onStarLeave(): void {
    this.starHover = 0;
  }

  private carregarAvaliacoes(profissionalId: number): void {
    this.avaliacaoService.listarPorProfissional(profissionalId).subscribe({
      next: (lista) => {
        this.avaliacoes = lista ?? [];
        this.atualizarMediaAvaliacoes();
        this.atualizarPaginacaoAvaliacoes();
      },
      error: (err) => {
        console.error('Erro ao carregar avaliações', err);
      }
    });
  }

  private atualizarMediaAvaliacoes(): void {
    if (!this.avaliacoes.length) {
      this.mediaAvaliacoes = 0;
      return;
    }
    const soma = this.avaliacoes.reduce((acc, a) => acc + (a.estrela || 0), 0);
    this.mediaAvaliacoes = soma / this.avaliacoes.length;
  }

    // Paginação avaliações
  atualizarPaginacaoAvaliacoes(): void {
    const inicio = (this.paginaAtualAvaliacoes - 1) * this.itensPorPaginaAvaliacoes;
    const fim = inicio + this.itensPorPaginaAvaliacoes;
    this.avaliacoesPaginadas = this.avaliacoes.slice(inicio, fim);
    this.carregarFotosClientesPagina();
  }

  get totalItensAvaliacoes() {
    return this.avaliacoes.length;
  }

  onPaginaMudouAvaliacoes(novaPagina: number) {
    this.paginaAtualAvaliacoes = novaPagina;
    this.atualizarPaginacaoAvaliacoes();
  }


  getTempoDecorridoAvaliacao(avaliacao: AvaliacaoDTO): string {
    if (!avaliacao?.dataCriacao) {
      return '';
    }

    let dataMs: number;

    if (avaliacao.dataCriacao instanceof Date) {
      dataMs = avaliacao.dataCriacao.getTime();
    } else {
      // string "yyyy-MM-dd HH:mm:ss" -> "yyyy-MM-ddTHH:mm:ss"
      const raw = avaliacao.dataCriacao.toString().replace(' ', 'T');
      const parsed = new Date(raw);
      if (isNaN(parsed.getTime())) {
        return '';
      }
      dataMs = parsed.getTime();
    }

    const agora = Date.now();
    const diffMs = agora - dataMs;

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

  private carregarFotosClientesPagina(): void {
    const ids = this.avaliacoesPaginadas
      .map(a => a.clienteId)
      .filter((id): id is number => !!id);

    if (!ids.length) {
      return;
    }

    this.usuarioMidiasService.getFotosPerfilDaPagina(ids).subscribe({
      next: (mapa) => {
        // mescla no cache local para não perder já carregados
        this.fotosClientes = { ...this.fotosClientes, ...mapa };
      },
      error: (err) => {
        console.error('Erro ao carregar fotos dos clientes', err);
      }
    });
  }

}
