import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/configs/services/auth.service';
import { CuponsService } from 'src/app/configs/services/cupons.service';
import { Cupom } from '../cupom';

@Component({
  selector: 'app-lista-de-cupons',
  templateUrl: './lista-de-cupons.component.html',
  styleUrls: ['./lista-de-cupons.component.css']
})
export class ListaDeCuponsComponent implements OnInit {
  meusCupons: Cupom[] = [];
  cuponsDisponiveis : Cupom[] = [];
  selectedCupom : Cupom  | null = null;
  showModal:boolean = false;
  showModalResgatar:boolean = false;

  successMessage:string | null = null;
  errorMessage:string | null = null;

  isLoading:boolean = false;

  constructor(private router: Router,
    private authService:AuthService,
    private cuponsService:CuponsService
  ) { }

  ngOnInit(): void {
    this.listarMeusCupons();
    this.listarTodosOsCupons();
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
