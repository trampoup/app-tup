import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/configs/services/auth.service';
import { TipoUsuario } from 'src/app/login/tipo-usuario.enum';
import { UsuarioSiteDTO } from '../cadastrar-site/usuario-site-dto';
import { UsuarioService } from 'src/app/configs/services/usuario.service';
import { UsuarioMidiasService } from 'src/app/configs/services/usuario-midias.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { categoriasDescricoes } from 'src/app/cadastro/categorias-descricoes-enum';
import { Servico } from '../../servicos/Servico';
import { ServicosService } from 'src/app/configs/services/servicos.service';
import { AvaliacaoDTO } from '../Avaliacao';
import { AvaliacaoService } from 'src/app/configs/services/avaliacao.service';

@Component({
  selector: 'app-mini-site-publico',
  templateUrl: './mini-site-publico.component.html',
  styleUrls: ['./mini-site-publico.component.css']
})
export class MiniSitePublicoComponent implements OnInit {
  TipoUsuario = TipoUsuario;

  servicos: Servico[] = [];

  paginaAtualServicos = 1;
  itensPorPaginaServicos = 6;
  totalPaginasServicos = Math.ceil(this.servicos.length / this.itensPorPaginaServicos);
  servicosPaginados: Servico[] = [];

  avaliacoes: AvaliacaoDTO[] = [];
  avaliacoesPaginadas: AvaliacaoDTO[] = [];
  paginaAtualAvaliacoes = 1;
  itensPorPaginaAvaliacoes = 6;
  totalPaginasAvaliacoes = 0;
  mediaAvaliacoes = 0;

  fotosClientes: Record<number, string | null> = {};

  isLoading: boolean = false;

  perfil: UsuarioSiteDTO | null = null;
  skillsLista: string[] = [];

  categoriasDescricoes = categoriasDescricoes;

  // URLs de mídia (blob:)
  bannerUrl: string | null = null;
  fotoUrl: string | null = null;
  videoUrl: SafeUrl | null = null;
  private videoObjectUrl: string | null = null; // para revogar depois

  // valores mockados só para visual (mantidos)
  userScore = 120;
  maxScore = 200;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private usuarioMidiasService: UsuarioMidiasService,
    private sanitizer: DomSanitizer,
    private servicosService: ServicosService,
    private avaliacaoService: AvaliacaoService
  ) {}

  ngOnInit(): void {
    this.atualizarPaginacaoServicos();
    this.atualizarPaginacaoAvaliacoes();

    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);
    if (!id || Number.isNaN(id)) {
      this.isLoading = false;
      return;
    }

    this.carregarPerfilPublico(id);
    this.carregarServicos(id);
    this.carregarMidiasPublicas(id);
    this.carregarAvaliacoes(id);
  }

  // ----- Perfil (dados)
  private carregarPerfilPublico(id: number) {
    this.usuarioService.obterSitePorIdUsuario(id).subscribe({
      next: (dto) => {
        this.perfil = dto;
        const raw = dto?.skills ?? '';
        this.skillsLista = raw.split(/[;,]/).map((s) => s.trim()).filter(Boolean);
      },
      error: () => {},
      complete: () => (this.isLoading = false)
    });
  }

  private carregarServicos(id: number | string) {
    this.servicosService.obterServicosPorProfissional(id).subscribe({
      next: (servicos) => {
        this.servicos = servicos ?? [];
        this.atualizarPaginacaoServicos();
      },
      error: (err) => console.error('Erro ao obter serviços', err)
    });
  }

  private carregarMidiasPublicas(id: number) {
    // banner
    this.usuarioMidiasService.getMidiaDoUsuario('banner', id).subscribe({
      next: (blob) => {
        if (!blob || blob.size === 0) return;
        const typed = blob.type?.startsWith('image/')
          ? blob
          : new Blob([blob], { type: 'image/jpeg' });
        const reader = new FileReader();
        reader.onload = () => (this.bannerUrl = reader.result as string);
        reader.readAsDataURL(typed);
      }
    });

    // foto perfil
    this.usuarioMidiasService.getMidiaDoUsuario('foto_perfil', id).subscribe({
      next: (blob) => {
        if (!blob || blob.size === 0) return;
        const typed = blob.type?.startsWith('image/')
          ? blob
          : new Blob([blob], { type: 'image/jpeg' });
        const reader = new FileReader();
        reader.onload = () => (this.fotoUrl = reader.result as string);
        reader.readAsDataURL(typed);
      }
    });

    // vídeo
    this.usuarioMidiasService.getMidiaDoUsuario('video', id).subscribe({
      next: (blob) => {
        if (!blob || blob.size === 0) return;

        const typed = blob.type?.startsWith('video/')
          ? blob
          : new Blob([blob], { type: 'video/mp4' });

        if (this.videoObjectUrl) URL.revokeObjectURL(this.videoObjectUrl);

        this.videoObjectUrl = URL.createObjectURL(typed);
        this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(this.videoObjectUrl);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.videoObjectUrl) {
      URL.revokeObjectURL(this.videoObjectUrl);
      this.videoObjectUrl = null;
    }
  }

  // ----- Helpers visuais gerais

  get progressPercent(): number {
    return Math.min(100, Math.round((this.userScore / this.maxScore) * 100));
  }

  getRoleUsuario(): TipoUsuario {
    return this.authService.getRoleUsuario();
  }

  // ----- Paginação de serviços

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

  // ----- Avaliações (somente leitura no público)

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

  atualizarPaginacaoAvaliacoes(): void {
    const inicio = (this.paginaAtualAvaliacoes - 1) * this.itensPorPaginaAvaliacoes;
    const fim = inicio + this.itensPorPaginaAvaliacoes;
    this.avaliacoesPaginadas = this.avaliacoes.slice(inicio, fim);
    this.totalPaginasAvaliacoes = Math.ceil(
      (this.avaliacoes.length || 0) / this.itensPorPaginaAvaliacoes
    );
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
      .map((a) => a.clienteId)
      .filter((id): id is number => !!id);

    if (!ids.length) {
      return;
    }

    this.usuarioMidiasService.getFotosPerfilDaPagina(ids).subscribe({
      next: (mapa) => {
        this.fotosClientes = { ...this.fotosClientes, ...mapa };
      },
      error: (err) => {
        console.error('Erro ao carregar fotos dos clientes', err);
      }
    });
  }

  // ----- Navegação

  redirectToGameficacao() {
    this.router.navigate(['/usuario/gameficacao']);
  }

  redirectToEditarSite() {
    this.router.navigate(['/usuario/cadastro-de-site']);
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
}
