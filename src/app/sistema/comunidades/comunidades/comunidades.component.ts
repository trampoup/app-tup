import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/configs/services/auth.service';
import { CategoriaKey, CATEGORIAS } from 'src/app/cadastro/categorias-enum';
import { categoriasDescricoes } from 'src/app/cadastro/categorias-descricoes-enum';
import { categoriaImagens } from './categoriasImagens-enum';

@Component({
  selector: 'app-comunidades',
  templateUrl: './comunidades.component.html',
  styleUrls: ['./comunidades.component.css']
})


export class ComunidadesComponent implements OnInit {
  @ViewChild('scroller', { static: true }) scroller!: ElementRef<HTMLDivElement>;
  readonly cols = 4;
  categorias: Array<{ key: CategoriaKey; label: string; image: string; }> = [];

  comunidades : any[] = [];

  constructor(
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    const keys = Object.keys(CATEGORIAS) as CategoriaKey[];
    this.categorias = keys.map((k) => ({
      key: k,
      label: categoriasDescricoes[k],
      image: categoriaImagens[k],
    }));
  }
  
  /** Scroll por “página” (viewport width) com animação suave */
  scroll(direction: 'left' | 'right'): void {
    const el = this.scroller?.nativeElement;
    if (!el) return;
    const amount = el.clientWidth; // 4 itens na maioria dos casos
    el.scrollBy({ left: direction === 'right' ? amount : -amount, behavior: 'smooth' });
  }

  onCategoriaClick(key: CategoriaKey) {
    // Faça aqui o que precisar (navegação/filtro)
    // this.router.navigate(['/comunidades', key]);
  }

  getRotaInicial():string{
    return this.authService.getRotaInicial();
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
