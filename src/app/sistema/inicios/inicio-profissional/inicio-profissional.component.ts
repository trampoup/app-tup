import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { categoriasDescricoes } from 'src/app/cadastro/categorias-descricoes-enum';
import { UsuarioSiteDTO } from '../../mini-site/cadastrar-site/usuario-site-dto';
import { UsuarioMidiasService } from 'src/app/configs/services/usuario-midias.service';
import { UsuarioService } from 'src/app/configs/services/usuario.service';
import { AnimationOptions } from 'ngx-lottie';

@Component({
  selector: 'app-inicio-profissional',
  templateUrl: './inicio-profissional.component.html',
  styleUrls: ['./inicio-profissional.component.css']
})
export class InicioProfissionalComponent implements OnInit {
  profissionaisInteresse: UsuarioSiteDTO[] = [];
  profissionaisInteressePaginados: UsuarioSiteDTO[] = [];
  paginaAtualInteresse: number = 1;
  itensPorPaginaInteresse: number = 6;
  totalItensInteresse: number = 0;

  // Mapa de fotos de perfil
  fotoPerfilMap: Record<number, string | null> = {};
  placeholderFoto = '/assets/imagens/foto-perfil-generico.png';
  
  categoriasDescricoes = categoriasDescricoes;
  mensagemBusca: string | null = '';
  isLoading: boolean = false;

  expandedDestaqueIndex: number | null = null;

  rocketLunchAnimOptions: AnimationOptions = {
    path: '/assets/animations/Rocket Lunch.json',
    loop: true,
    autoplay: true
  };

  temMiniSite:boolean = false;
  nomeProfissional: string = 'Profissional';
  cidadeBanner: string = '—';
  servicosRealizados:number = 38;
  anosExperiencia:number = 0;

  constructor(
    private router: Router,
    private usuarioMidiasService: UsuarioMidiasService,
    private usuarioService: UsuarioService,
  ) { }

  ngOnInit(): void {
    this.carregarResumoBanner();
    this.carregarProfissionaisPorInteresse();
    this.atualizarPaginacaoProfissionaisInteresse();
  }

  private carregarResumoBanner(): void {
    this.usuarioService.obterResumoInicioProfissional().subscribe({
      next: (res) => {
        console.log('Resumo início profissional:', res);
        this.temMiniSite = res.miniSiteAtivo;
        this.nomeProfissional = res.nome || 'Profissional';
        this.cidadeBanner = res.cidadeAtual || 'sua região';
        this.servicosRealizados = res.servicosRealizados ?? 0;
        this.anosExperiencia = res.anosExperiencia ?? 0;
      },
      error: () => {
        // fallback: sem mini site
        this.temMiniSite = false;
        this.cidadeBanner = 'sua região';
        this.servicosRealizados = 0;
        this.anosExperiencia = 0;
      }
    });
  }

  verPerfil(d: any, $event: MouseEvent) {
    $event.stopPropagation();
    this.router.navigate(['/usuario/perfil-profissional']); 
  }

  trackByIndex(index: number, _item: any): number {
    return index;
  }

  onPaginaMudouInteresse(novaPagina: number) {
    this.paginaAtualInteresse = novaPagina;
    this.expandedDestaqueIndex = null;
    this.atualizarPaginacaoProfissionaisInteresse();
  }

  atualizarPaginacaoProfissionaisInteresse(): void {
    const inicio = (this.paginaAtualInteresse - 1) * this.itensPorPaginaInteresse;
    const fim = inicio + this.itensPorPaginaInteresse;
    this.profissionaisInteressePaginados = this.profissionaisInteresse.slice(inicio, fim);
    this.carregarFotosPerfisPaginados();
  }

  carregarProfissionaisPorInteresse() {
    this.isLoading = true;
    this.usuarioService.obterTodosProfissionais().subscribe({
      next: (profissionais) => {
        this.profissionaisInteresse = profissionais || [];
        this.totalItensInteresse = this.profissionaisInteresse.length;
        this.atualizarPaginacaoProfissionaisInteresse();
        this.carregarFotosPerfisPaginados();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar profissionais por interesse:', error);
        this.profissionaisInteresse = [];
        this.totalItensInteresse = 0;
        this.atualizarPaginacaoProfissionaisInteresse();
        this.isLoading = false;
      }
    });
  }

  private carregarFotosPerfisPaginados(): void {
    const idsPagina = this.profissionaisInteressePaginados
      .map(p => p.id)
      .filter((id): id is number => typeof id === 'number');

    const faltando = idsPagina.filter(id => !(id in this.fotoPerfilMap));

    if (faltando.length === 0) return;

    this.usuarioMidiasService.getFotosPerfilDaPagina(faltando)
      .subscribe((mapa) => {
        this.fotoPerfilMap = { ...this.fotoPerfilMap, ...mapa };
      });
  }

  visualizarProfissional(id: number){
    this.router.navigate(['/usuario/perfil-profissional', id]);
  }

  redirectToCadastroSite() {
    this.router.navigate(['/usuario/cadastro-de-site']);
  }
}
