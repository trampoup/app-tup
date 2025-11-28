import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/configs/services/usuario.service';
import { UsuarioMidiasService } from 'src/app/configs/services/usuario-midias.service';
import { AuthService } from 'src/app/configs/services/auth.service';
import { UsuarioDadosDTO } from 'src/app/sistema/cupons/UsuarioDadosDTO';
import { categoriasDescricoes } from 'src/app/cadastro/categorias-descricoes-enum';
import { Setor } from 'src/app/cadastro/categorias-enum';

@Component({
  selector: 'app-visualizacao-de-favoritos',
  templateUrl: './visualizacao-de-favoritos.component.html',
  styleUrls: ['./visualizacao-de-favoritos.component.css']
})
export class VisualizacaoDeFavoritosComponent implements OnInit {

  isLoading: boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  mensagemBusca: string | null = null;

  favoritos: UsuarioDadosDTO[] = [];
  favoritosFiltrados: UsuarioDadosDTO[] = [];
  favoritosPaginados: UsuarioDadosDTO[] = [];

  paginaAtualFavoritos: number = 1;
  itensPorPaginaFavoritos: number = 12;
  totalItensFavoritos: number = 0;
  totalPaginasFavoritos: number = 0;

  categoriasDescricoes = categoriasDescricoes;

  // Filtro por setor
  setores: Setor[] = [];
  selectedSetor: Setor | 'TODOS' = 'TODOS';

  fotoPerfilMap: Record<number, string | null> = {};
  placeholderFoto = '/assets/imagens/foto-perfil-generico.png';

  constructor(
    private usuarioService: UsuarioService,
    private usuarioMidiasService: UsuarioMidiasService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // mesma lógica da lista de serviços (visão cliente)
    this.setores = Object.keys(this.categoriasDescricoes) as Setor[];
    this.carregarFavoritos();
  }

  getRotaInicial(): string {
    return this.authService.getRotaInicial();
  }

  visualizarProfissional(id: number): void {
    this.router.navigate(['/usuario/perfil-profissional', id]);
  }

  private carregarFavoritos(): void {
    this.isLoading = true;

    this.usuarioService.obterFavoritos().subscribe({
      next: (favoritos) => {
        this.favoritos = favoritos ?? [];
        this.favoritosFiltrados = [...this.favoritos];

        this.totalItensFavoritos = this.favoritosFiltrados.length;
        this.totalPaginasFavoritos = Math.ceil(
          this.totalItensFavoritos / this.itensPorPaginaFavoritos
        );

        if (this.favoritos.length === 0) {
          this.mensagemBusca = 'Você ainda não tem profissionais favoritos.';
        } else {
          this.mensagemBusca = null;
        }

        this.paginaAtualFavoritos = 1;
        this.atualizarPaginacaoFavoritos();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao obter favoritos', err);
        this.errorMessage = 'Erro ao obter seus profissionais favoritos.';
        setTimeout(() => (this.errorMessage = null), 2000);
        this.isLoading = false;
      }
    });
  }

  onSetorChange(valor: string) {
    if (valor === 'TODOS') {
      this.selectedSetor = 'TODOS';
      this.favoritosFiltrados = [...this.favoritos];
    } else {
      this.selectedSetor = valor as Setor;
      this.favoritosFiltrados = this.favoritos.filter(
        f => f.setor === this.selectedSetor  // assumindo que UsuarioDadosDTO tem 'setor'
      );
    }

    if (this.favoritosFiltrados.length === 0 && this.selectedSetor !== 'TODOS') {
      this.mensagemBusca = `Nenhum profissional favorito encontrado para o setor "${this.categoriasDescricoes[this.selectedSetor]}".`;
    } else if (this.favoritos.length === 0) {
      this.mensagemBusca = 'Você ainda não tem profissionais favoritos.';
    } else {
      this.mensagemBusca = null;
    }

    this.totalItensFavoritos = this.favoritosFiltrados.length;
    this.totalPaginasFavoritos = Math.ceil(
      this.totalItensFavoritos / this.itensPorPaginaFavoritos
    );
    this.paginaAtualFavoritos = 1;
    this.atualizarPaginacaoFavoritos();
  }

  onPaginaMudouFavoritos(novaPagina: number): void {
    this.paginaAtualFavoritos = novaPagina;
    this.atualizarPaginacaoFavoritos();
  }

  private atualizarPaginacaoFavoritos(): void {
    const inicio = (this.paginaAtualFavoritos - 1) * this.itensPorPaginaFavoritos;
    const fim = inicio + this.itensPorPaginaFavoritos;
    this.favoritosPaginados = this.favoritosFiltrados.slice(inicio, fim);
    this.carregarFotosPerfisPaginados();
  }

  private carregarFotosPerfisPaginados(): void {
    const idsPagina = this.favoritosPaginados
      .map(f => f.id)
      .filter((id): id is number => typeof id === 'number');

    const faltando = idsPagina.filter(id => !(id in this.fotoPerfilMap));
    if (faltando.length === 0) return;

    this.usuarioMidiasService.getFotosPerfilDaPagina(faltando)
      .subscribe({
        next: (mapa: Record<number, string | null>) => {
          this.fotoPerfilMap = { ...this.fotoPerfilMap, ...mapa };
        },
        error: (err) => {
          console.error('Erro ao carregar fotos de perfil da página', err);
        }
      });
  }
}
