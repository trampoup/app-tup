import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/configs/services/auth.service';
import { TipoUsuario } from 'src/app/login/tipo-usuario.enum';
import { UsuarioSiteDTO } from '../cadastrar-site/usuario-site-dto';
import { UsuarioService } from 'src/app/configs/services/usuario.service';
import { UsuarioMidiasService } from 'src/app/configs/services/usuario-midias.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Servico } from '../../servicos/Servico';
import { categoriasDescricoes } from 'src/app/cadastro/categorias-descricoes-enum';
import { ServicosService } from 'src/app/configs/services/servicos.service';
import { AvaliacaoDTO } from '../Avaliacao';
import { AvaliacaoService } from 'src/app/configs/services/avaliacao.service';

@Component({
  selector: 'app-meu-mini-site',
  templateUrl: './meu-mini-site.component.html',
  styleUrls: ['./meu-mini-site.component.css']
})
export class MeuMiniSiteComponent implements OnInit {
  TipoUsuario = TipoUsuario;

  servicos: Servico[] = [];


  avaliacoes: AvaliacaoDTO[] = [];
  avaliacoesPaginadas: AvaliacaoDTO[] = [];
  paginaAtualAvaliacoes = 1;
  itensPorPaginaAvaliacoes = 4;
  totalPaginasAvaliacoes = 0;
  mediaAvaliacoes = 0;

  // cache de fotos dos clientes
  fotosClientes: Record<number, string | null> = {};


  // Paginacao de servicos
  paginaAtualServicos = 1;
  itensPorPaginaServicos = 6;
  totalPaginasServicos = Math.ceil(this.servicos.length / this.itensPorPaginaServicos);
  servicosPaginados: Servico[] = [];


  perfil: UsuarioSiteDTO | null = null;
  categoriasDescricoes = categoriasDescricoes;
  skillsLista: string[] = [];

  // URLs de mídia (blob:)
  bannerUrl: string | null = null;
  fotoUrl: string | null = null;
  videoUrl: SafeUrl | null = null;
  private videoObjectUrl: string | null = null; // para revogar depois

  constructor(
    private authService: AuthService,
    private router: Router,
    private usuarioService : UsuarioService,
    private usuarioMidiasService: UsuarioMidiasService,
    private sanitizer: DomSanitizer,
    private servicosService : ServicosService,
    private avaliacaoService: AvaliacaoService
  ) { }

  ngOnInit(): void {
    this.atualizarPaginacaoServicos();
    this.atualizarPaginacaoAvaliacoes();

    this.carregarMeuSite();
    this.carregarMeusServicos();
    this.carregarMidias();
    this.carregarMinhasAvaliacoes();
  }

  // valores mockados só para visual
  userScore = 120;
  maxScore = 200;

  get progressPercent(): number {
    return Math.min(100, Math.round((this.userScore / this.maxScore) * 100));
  }

  private carregarMeuSite() {
    this.usuarioService.obterMeuSite().subscribe({
      next: (dto) => {
        this.perfil = dto;

        const raw = dto?.skills ?? '';
        this.skillsLista = raw
          .split(/[;,]/)
          .map(s => s.trim())
          .filter(Boolean);
      },
      error: () => {
      }
    });
  }  

  private carregarMeusServicos() {
    this.servicosService.obterMeusServicos().subscribe({
      next: (servicos) => {
        this.servicos = servicos ?? [];
        this.atualizarPaginacaoServicos();
      },
      error: (err) => console.error('Erro ao obter serviços', err),
    });
  }

  private carregarMidias() {
    this.usuarioMidiasService.getMinhaMidia('banner').subscribe((url) => {
      this.bannerUrl = url;
    });

    this.usuarioMidiasService.getMinhaMidia('foto_perfil').subscribe((url) => {
      this.fotoUrl = url;
    });

    this.usuarioMidiasService.getMinhaMidia('video').subscribe((url) => {
      this.videoUrl = url ? this.sanitizer.bypassSecurityTrustUrl(url) : null;
    });
  }

  ngOnDestroy(): void {
  }

  getRoleUsuario(): TipoUsuario {
    return this.authService.getRoleUsuario();
  }
  
  // ----- Avaliações do profissional logado -----
  private carregarMinhasAvaliacoes(): void {
    this.avaliacaoService.listarMinhas().subscribe({
      next: (lista) => {
        this.avaliacoes = lista ?? [];
        this.atualizarMediaAvaliacoes();
        this.atualizarPaginacaoAvaliacoes();
      },
      error: (err) => {
        console.error('Erro ao carregar avaliações do profissional logado', err);
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

  redirectToSitePublico(): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/perfil-publico', this.perfil?.id])
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  }


}
