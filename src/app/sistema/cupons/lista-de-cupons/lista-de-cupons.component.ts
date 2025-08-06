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
    if (this.isNotClient()) {
      this.cuponsService.getMeusCuponsCadastrados().subscribe(
        res => { 
          this.meusCupons = res ?? [];
          console.log(this.meusCupons)
        },
        error => {
          console.error('Erro ao carregar meus cupons', error);
        }
      );
    }else{
      this.cuponsService.getMeusCuponsResgatados().subscribe(
        res => this.meusCupons = res ?? [],
        err => console.error('Erro ao carregar meus cupons resgatados', err)
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
        this.listarMeusCupons();
      },
      error: err => console.error('Falha ao resgatar cupom', err)
    });
  }


  openModalRegras(cupom: Cupom): void{
    this.showModal = true;
    this.selectedCupom = cupom;
  }

  fecharModal(): void {
    this.showModal = false;
    this.selectedCupom = null;
  }
}
