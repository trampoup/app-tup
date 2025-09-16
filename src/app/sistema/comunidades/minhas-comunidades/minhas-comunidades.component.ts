import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/configs/services/auth.service';

@Component({
  selector: 'app-minhas-comunidades',
  templateUrl: './minhas-comunidades.component.html',
  styleUrls: ['./minhas-comunidades.component.css']
})
export class MinhasComunidadesComponent implements OnInit {
  isLoading: boolean = false;
  comunidades : any[] = [];

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
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
