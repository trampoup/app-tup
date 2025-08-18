import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/configs/services/auth.service';
import { CuponsService } from 'src/app/configs/services/cupons.service';
import { Cupom } from '../cupom';
import { ModalDeleteService } from 'src/app/configs/services/modal-delete.service';

@Component({
  selector: 'app-lista-de-cupons',
  templateUrl: './lista-de-cupons.component.html',
  styleUrls: ['./lista-de-cupons.component.css']
})
export class ListaDeCuponsComponent implements OnInit {
  meusCupons: Cupom[] = [];
  cuponsDisponiveis : Cupom[] = [];

  paginaAtual: number = 1;
  itensPorPagina: number = 6;
  totalPaginas: number = Math.ceil(this.meusCupons.length / this.itensPorPagina);
  meusCuponsPaginados: Cupom[] = [];

  paginaAtualDisponiveis: number = 1;
  totalPaginasDisponiveis: number = Math.ceil(this.cuponsDisponiveis.length / this.itensPorPagina);
  cuponsDisponiveisPaginados:Cupom[] = [];

  selectedCupom : Cupom  | null = null;
  showModal:boolean = false;
  showModalResgatar:boolean = false;

  successMessage:string | null = null;
  errorMessage:string | null = null;

  isLoading:boolean = false;

  constructor(private router: Router,
    private authService:AuthService,
    private cuponsService:CuponsService,
    private modalDeleteService: ModalDeleteService
  ) { }

  ngOnInit(): void {
    this.listarMeusCupons();
    this.listarTodosOsCupons();
    this.atualizarPaginacao();
    this.atualizarPaginacaoDisponiveis();
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.meusCuponsPaginados = this.meusCupons.slice(inicio, fim);
  }

  get totalItens() {
    return this.meusCupons.length;
  }

  onPaginaMudou(novaPagina: number) {
    this.paginaAtual = novaPagina;
    this.atualizarPaginacao();
  }

  atualizarPaginacaoDisponiveis(): void {
    const inicio = (this.paginaAtualDisponiveis - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.cuponsDisponiveisPaginados = this.cuponsDisponiveis.slice(inicio, fim);
  }

  onPaginaMudouDisponiveis(novaPagina: number) {
    this.paginaAtualDisponiveis = novaPagina;
    this.atualizarPaginacaoDisponiveis();
  }

  openModalDeletar(cupom: Cupom): void {
    this.selectedCupom = cupom;
    this.modalDeleteService.openModal({
      title: 'Deletar Cupom',
      description: `Você tem certeza que deseja deletar o cupom <strong>${cupom.titulo}</strong>?`,
      item: cupom,
      deletarTextoBotao: 'Deletar',
    }, () => {
      this.deletarCupom(cupom);
    });
  }

  deletarCupom(cupom: Cupom): void {
    this.cuponsService.deletarCupom(cupom.id!).subscribe({
      next: () => {
        this.successMessage = "Cupom deletado com sucesso!";
        setTimeout(() => this.successMessage = null, 2000);
        this.errorMessage = null;
        this.listarMeusCupons();
        this.listarTodosOsCupons();
      },
      error: err => {
        console.error('Erro ao deletar cupom', err);
        this.errorMessage = "Erro ao deletar cupom!";
        setTimeout(() => this.errorMessage = null, 2000);
      }
    });
  }

  editarCupom(id:number | string): void {
    this.router.navigate(['/usuario/cadastro-de-cupom', id]);
  }

  getRotaInicial():string{
    return this.authService.getRotaInicial();
  }

  isNotClient():boolean{
    return (this.authService.isAdministrador()) || (this.authService.isProfissional());
  }

  listarMeusCupons(){
    this.isLoading = true;
    if (this.isNotClient()) {
      this.cuponsService.getMeusCuponsCadastrados().subscribe(
        res => { 
          this.meusCupons = res ?? [];
          console.log(this.meusCupons)
          this.totalPaginas = Math.ceil(this.meusCupons.length / this.itensPorPagina);
          this.atualizarPaginacao();
          console.log("Cupons paginados" + this.meusCuponsPaginados);
          this.isLoading = false;
        },
        error => {
          console.error('Erro ao carregar meus cupons', error);          
          this.isLoading = false;
        }
      );
    }else{
      this.cuponsService.getMeusCuponsResgatados().subscribe(
        res => {
          this.meusCupons = res ?? [];
          this.totalPaginas = Math.ceil(this.meusCupons.length / this.itensPorPagina);
          this.atualizarPaginacao();
          this.isLoading = false;
        },
        err => {
          console.error('Erro ao carregar meus cupons resgatados', err);
          this.isLoading = false;
        }
      );
    }
  }


  listarTodosOsCupons(): void {
    this.cuponsService.getTodosCupons().subscribe(
      res => {
        this.cuponsDisponiveis = res ?? [];
        this.totalPaginasDisponiveis = Math.ceil(this.cuponsDisponiveis.length / this.itensPorPagina);
        this.atualizarPaginacaoDisponiveis();
      },
      error => {
        console.error('Erro ao carregar cupons', error);
      }
    );
  }


  resgatarCupom(cupom: Cupom): void {
    this.cuponsService.resgatarCupom(cupom.id!).subscribe({
      next: () => {
        this.showModalResgatar = false;
        this.successMessage = "Cupom resgatado com sucesso!"
        setTimeout(() => this.successMessage = null, 2000);
        this.errorMessage = null;
        this.listarMeusCupons();
      },
      error: err => {
        console.error('Falha ao resgatar cupom', err);
        this.errorMessage = "Erro ao resgatar cupom!"
        setTimeout(() => this.errorMessage = null, 2000);
      }
      
    });
  }


  openModalRegras(cupom: Cupom): void{
    this.showModal = true;
    this.selectedCupom = cupom;
  }

  fecharModal(): void {
    this.showModal = false;
    this.selectedCupom = null;
    this.showModalResgatar = false;
  }

  openModalResgatar(cupom:Cupom){
    this.showModalResgatar = true;
    this.selectedCupom = cupom;
  }
}
