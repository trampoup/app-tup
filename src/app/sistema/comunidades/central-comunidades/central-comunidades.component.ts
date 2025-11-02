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
  isLoadingCriadas: boolean = false;
  isLoadingParticipando: boolean = false;

  comunidadesParticipando : ComunidadeResponseDTO[] = [];
  comunidadesParticipandoPaginados: ComunidadeResponseDTO[] = [];
  comunidadesCriadas : ComunidadeResponseDTO[] = [];
  comunidadesCriadasPaginados: ComunidadeResponseDTO[] = [];

  paginaAtualCParticipo: number = 1;
  itensPorPaginaCParticipo: number = 3;
  totalItensCParticipo: number = this.comunidadesParticipando.length;
  totalPaginasCParticipo: number = Math.ceil(this.totalItensCParticipo / this.itensPorPaginaCParticipo);

  paginaAtualCCriadas: number = 1;
  itensPorPaginaCCriadas: number = 3;
  totalItensCCriadas: number = this.comunidadesCriadas.length;
  totalPaginasCCriadas: number = Math.ceil(this.totalItensCCriadas / this.itensPorPaginaCCriadas);



  categorias: Setor[] = Object.keys(categoriasDescricoes) as Setor[];
  categoriasDescricoes = categoriasDescricoes;
  errorMessage: string | null = null;
  mensagemBusca: string | null = null;
  
  constructor(
    private authService: AuthService,
    private comunidadeService:ComunidadeService,
    private router: Router,
    private modalDeleteService: ModalDeleteService
  ) { }

  ngOnInit(): void {
    this.obterComudadesCriadas();
    this.obterComunidadesParticipando();
  }

  isCliente():boolean{
    return this.authService.isCliente();
  }

  visualizarComunidade(comunidadeId: number) {
     this.router.navigate(['/usuario/visualizar-comunidade', comunidadeId]);
  }

  obterComudadesCriadas(){
    this.isLoadingCriadas = true;
    this.comunidadeService.obterComunidadesCriadasComBanners().subscribe({
      next: (lista) => {
        this.comunidadesCriadas = lista;
        this.comunidadesCriadasPaginados = this.comunidadesCriadas;
        this.isLoadingCriadas = false;

        this.totalItensCCriadas = this.comunidadesCriadas.length;
        this.totalPaginasCCriadas = Math.ceil(this.totalItensCCriadas / this.itensPorPaginaCCriadas);
        this.paginaAtualCCriadas = 1;
        this.atualizarPaginacaoCriadas();
        console.log('Comunidades criadas obtidas:', this.comunidadesCriadas);
      },
      error: (err) => {
        console.error('Erro ao obter comunidades criadas:', err);
        this.isLoadingCriadas = false;
      }
    });
  }


  obterComunidadesParticipando() {
    this.isLoadingParticipando = true;
    this.comunidadeService.obterComunidadesParticipandoComBanners().subscribe({
      next: (lista) => {
        this.comunidadesParticipando = lista;
        this.comunidadesParticipandoPaginados = this.comunidadesParticipando;
        this.isLoadingParticipando = false;
        
        this.totalItensCParticipo = this.comunidadesParticipando.length;
        this.totalPaginasCParticipo = Math.ceil(this.totalItensCParticipo / this.itensPorPaginaCParticipo);
        this.paginaAtualCParticipo = 1;
        this.atualizarPaginacaoParticipando();
        console.log('Comunidades obtidas:', this.comunidadesParticipando);
      },
      error: (err) => {
        console.error('Erro ao obter comunidades:', err);
        this.isLoadingParticipando = false;
      }
    });
  }

  onFiltroSetorChange(e: Event){
    this.isLoadingParticipando = true;
    const valor = (e.target as HTMLSelectElement).value as Setor | '';
    
    if (valor === '') {
      this.obterComunidadesParticipando();
    } else {
      this.comunidadeService.filtrarComunidadesPorSetor(valor).subscribe({
        next: (lista) => {
          this.comunidadesParticipando = lista;
          this.totalItensCParticipo = lista.length;
          this.totalPaginasCParticipo = Math.ceil(this.totalItensCParticipo / this.itensPorPaginaCParticipo);
          this.paginaAtualCParticipo = 1;
          this.atualizarPaginacaoParticipando();
          console.log('Comunidades filtradas:', lista);
          this.isLoadingParticipando = false;
        },
        error: (err) => {
          console.error('Erro ao obter comunidades:', err);
          this.isLoadingParticipando = false;
        }
      });
    }
  }

  atualizarPaginacaoCriadas(): void {
    const inicio = (this.paginaAtualCCriadas - 1) * this.itensPorPaginaCCriadas;
    const fim = inicio + this.itensPorPaginaCCriadas;
    this.comunidadesCriadasPaginados = this.comunidadesCriadas.slice(inicio, fim);
  }

  onPaginaMudouCriadas(novaPagina: number) {
    this.paginaAtualCCriadas = novaPagina;
    this.atualizarPaginacaoCriadas();
  }

  atualizarPaginacaoParticipando(): void {
    const inicio = (this.paginaAtualCParticipo - 1) * this.itensPorPaginaCParticipo;
    const fim = inicio + this.itensPorPaginaCParticipo;
    this.comunidadesParticipandoPaginados = this.comunidadesParticipando.slice(inicio, fim);
  }

  onPaginaMudouParticipando(novaPagina: number) {
    this.paginaAtualCParticipo = novaPagina;
    this.atualizarPaginacaoParticipando();
  }

  editarComunidade(comunidadeId: number) {
    this.router.navigate(['/usuario/cadastro-de-comunidade', comunidadeId]);
  }


  openModalSair(comunidade:ComunidadeResponseDTO) {
    this.modalDeleteService.openModal({
      title:'Sair da Comunidade',
      description : `Deseja sair da comunidade <strong>${comunidade.nome}</strong>}?`,
      item:comunidade,
      deletarTextoBotao:'Sair'
    },
    () => {
      this.sairDaComunidade(comunidade.id);
    });
  }

  openModalDelete(comunidade:ComunidadeResponseDTO) {
    this.modalDeleteService.openModal({
      title:'Deletar Comunidade',
      description : `Deseja deletar a sua comunidade <strong>${comunidade.nome}</strong>?`,
      item:comunidade,
      deletarTextoBotao:'Deletar'
    },
    () => {
      this.deletarComunidade(comunidade.id);
    });
  }

  deletarComunidade(comunidadeId: number) {
    this.comunidadeService.deletarComunidade(comunidadeId).subscribe({
      next: () => {
        this.obterComudadesCriadas();
        this.obterComunidadesParticipando();
      },
      error: (err) => {
        console.error('Erro ao deletar comunidade:', err);
      }
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
