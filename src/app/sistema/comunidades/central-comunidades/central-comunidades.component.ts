import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/configs/services/auth.service';
import { ComunidadeService } from 'src/app/configs/services/comunidade.service';
import { ModalConfirmationService } from 'src/app/configs/services/modal-confirmation.service';
import { ComunidadeResponseDTO } from '../ComunidadeResponseDTO';
import { ModalDeleteService } from 'src/app/configs/services/modal-delete.service';
import { Setor } from 'src/app/cadastro/categorias-enum';
import { categoriasDescricoes } from 'src/app/cadastro/categorias-descricoes-enum';

@Component({
  selector: 'app-central-comunidades',
  templateUrl: './central-comunidades.component.html',
  styleUrls: ['./central-comunidades.component.css']
})
export class CentralComunidadesComponent implements OnInit {
  isLoading: boolean = false;
  comunidades : ComunidadeResponseDTO[] = [];
  comunidadesPaginados: ComunidadeResponseDTO[] = [];

  paginaAtualCParticipo: number = 1;
  itensPorPaginaCParticipo: number = 3;
  totalItensCParticipo: number = this.comunidades.length;
  totalPaginasCParticipo: number = Math.ceil(this.totalItensCParticipo / this.itensPorPaginaCParticipo);

  categorias: Setor[] = Object.keys(categoriasDescricoes) as Setor[];
  categoriasDescricoes = categoriasDescricoes;
  errorMessage: string | null = null;
  mensagemBusca: string | null = null;
  
  constructor(
    private authService: AuthService,
    private comunidadeService:ComunidadeService,
    private router: Router,
    private http: HttpClient,
    private modalConfirmationService: ModalConfirmationService,
    private modalDeleteService: ModalDeleteService
  ) { }

  ngOnInit(): void {
    this.obterComunidadesParticipando();
  }

  isCliente():boolean{
    return this.authService.isCliente();
  }

  visualizarComunidade(comunidadeId: number) {
     this.router.navigate(['/usuario/visualizar-comunidade', comunidadeId]);
  }


  obterComunidadesParticipando() {
    this.isLoading = true;
    this.comunidadeService.obterComunidadesParticipandoComBanners().subscribe({
      next: (lista) => {
        this.comunidades = lista;
        this.comunidadesPaginados = this.comunidades;
        this.isLoading = false;
        
        this.totalItensCParticipo = this.comunidades.length;
        this.totalPaginasCParticipo = Math.ceil(this.totalItensCParticipo / this.itensPorPaginaCParticipo);
        this.paginaAtualCParticipo = 1;
        this.atualizarPaginacao();
        console.log('Comunidades obtidas:', this.comunidades);
      },
      error: (err) => {
        console.error('Erro ao obter comunidades:', err);
        this.isLoading = false;
      }
    });
  }

  onFiltroSetorChange(e: Event){
    this.isLoading = true;
    const valor = (e.target as HTMLSelectElement).value as Setor | '';
    
    if (valor === '') {
      this.obterComunidadesParticipando();
    } else {
      this.comunidadeService.filtrarComunidadesPorSetor(valor).subscribe({
        next: (lista) => {
          this.comunidades = lista;
          this.totalItensCParticipo = lista.length;
          this.totalPaginasCParticipo = Math.ceil(this.totalItensCParticipo / this.itensPorPaginaCParticipo);
          this.paginaAtualCParticipo = 1;
          this.atualizarPaginacao();
          console.log('Comunidades filtradas:', lista);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao obter comunidades:', err);
          this.isLoading = false;
        }
      });
    }
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtualCParticipo - 1) * this.itensPorPaginaCParticipo;
    const fim = inicio + this.itensPorPaginaCParticipo;
    this.comunidadesPaginados = this.comunidades.slice(inicio, fim);
  }

  onPaginaMudou(novaPagina: number) {
    this.paginaAtualCParticipo = novaPagina;
    this.atualizarPaginacao();
  }

  openModalDelete(comunidade:ComunidadeResponseDTO) {
    this.modalDeleteService.openModal({
      title:'Sair da Comunidade',
      description : `Deseja sair da comunidade <strong>${comunidade.nome}</strong>}<strong>?`,
      item:comunidade,
      deletarTextoBotao:'Sair'
    },
    () => {
      this.sairDaComunidade(comunidade.id);
    });
  }

  sairDaComunidade(comunidadeId: number) {
    this.comunidadeService.sairDaComunidade(comunidadeId).subscribe({
      next: () => {
        this.obterComunidadesParticipando();
      },
      error: (err) => {
        console.error('Erro ao sair da comunidade:', err);
      }
    });
  }

}
