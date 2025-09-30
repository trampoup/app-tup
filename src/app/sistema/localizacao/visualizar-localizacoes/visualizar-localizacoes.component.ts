import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/configs/services/auth.service';

@Component({
  selector: 'app-visualizar-localizacoes',
  templateUrl: './visualizar-localizacoes.component.html',
  styleUrls: ['./visualizar-localizacoes.component.css']
})
export class VisualizarLocalizacoesComponent implements OnInit {
  isLoading: boolean = false;
  isEdit: boolean = false;

  successMessage: string | null = '';
  errorMessage: string | null = '';
  mensagemBusca: string | null = '';

  localizacoes: any[] = [];
  localizacoesPaginados: any[] = [];

  constructor(
    private authService : AuthService
  ) { }

  ngOnInit(): void {
  }

  getRotaInicial():string{
    return this.authService.getRotaInicial();
  }

  visualizarLocalizacao(id: number){
    this.isLoading = true;
  }

  editarLocalizacao(id: number){
    this.isEdit = true;
  }

  openModalDeletar(){

  }

}
