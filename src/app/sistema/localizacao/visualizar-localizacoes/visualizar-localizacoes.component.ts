import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/configs/services/auth.service';
import { Localizacao } from '../localizacao';
import { LocalizacaoService } from 'src/app/configs/services/localizacao.service';
import { Router } from '@angular/router';

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

  localizacoes: Localizacao[] = [];
  localizacoesPaginados: Localizacao[] = [];

  itensPorPagina: number = 5;
  paginaAtual: number = 1;
  totalItens: number = 0;
  totalPaginas: number = 0;

  constructor(
    private authService : AuthService,
    private router:Router,
    private localizacaoService: LocalizacaoService
  ) { }

  ngOnInit(): void {
    this.carregarLocalizacoes();
  }

  carregarLocalizacoes(){
    this.isLoading = true;

    this.localizacaoService.obterLocalizacoesLogado().subscribe(
      res => {
        this.localizacoes = res ?? []
        this.isLoading = false;
        this.totalItens = this.localizacoes.length; 
        this.totalPaginas = Math.ceil(
          this.localizacoes.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
      },
      err => {
        console.error('Erro ao carregar meus localizações', err);
        this.isLoading = false;
      }
    )
  }

  getRotaInicial():string{
    return this.authService.getRotaInicial();
  }

  visualizarLocalizacao(id: number){
    this.router.navigate(['/usuario/visualizar-localizacao', id]);
  }

  editarLocalizacao(id: number){
    this.router.navigate(['/usuario/cadastro-de-localizacao', id]);
  }

  openModalDeletar(){

  }



  onPaginaMudou(novaPagina: number) {
      this.paginaAtual = novaPagina;
      this.atualizarPaginacao();
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.localizacoesPaginados = this.localizacoes.slice(inicio, fim);
  }


}
