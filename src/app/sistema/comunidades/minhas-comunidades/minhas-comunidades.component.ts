import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/configs/services/auth.service';
import { ComunidadeService } from 'src/app/configs/services/comunidade.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-minhas-comunidades',
  templateUrl: './minhas-comunidades.component.html',
  styleUrls: ['./minhas-comunidades.component.css']
})
export class MinhasComunidadesComponent implements OnInit {
  isLoading: boolean = false;
  comunidades : any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private comunidadeService:ComunidadeService,
    private http: HttpClient,
  ) { }

  ngOnInit(): void {
    this.obterComunidades();
  }

  getRotaInicial():string{
    return this.authService.getRotaInicial();
  }

  visualizarComunidade(comunidadeId: number) {
     this.router.navigate(['/usuario/visualizar-comunidade', comunidadeId]);
  }


  obterComunidades() {
    this.isLoading = true;
    this.comunidadeService.obterComunidadesComBanners().subscribe({
      next: (lista) => {
        this.comunidades = lista;
        this.isLoading = false;
        console.log('Comunidades obtidas:', this.comunidades);
      },
      error: (err) => {
        console.error('Erro ao obter comunidades:', err);
        this.isLoading = false;
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
