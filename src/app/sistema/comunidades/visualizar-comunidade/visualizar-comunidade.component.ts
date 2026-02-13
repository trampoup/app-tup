import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComunidadeService } from 'src/app/configs/services/comunidade.service';
import { ComunidadeResponseDTO } from '../ComunidadeResponseDTO';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ModalGenericoService } from 'src/app/configs/services/modal-generico.service';

@Component({
  selector: 'app-visualizar-comunidade',
  templateUrl: './visualizar-comunidade.component.html',
  styleUrls: ['./visualizar-comunidade.component.css']
})
export class VisualizarComunidadeComponent implements OnInit {
  @ViewChild('templateMenuModal') templateMenuModal!: TemplateRef<any>;
  bannerUrl: string | null = null;
  fotoUrl: string | null = null;

  publicacoes: any[] = [
    { titulo: 'Dica do Dia: Como Melhorar o Desempenho do Seu Ar-Condicionado! ❄️',
      temBanner: true,
      conteudo:
       `
       Você sabia que pequenos cuidados podem fazer toda a diferença na eficiência do seu ar-condicionado?

        Aqui vão algumas dicas simples, mas que ajudam muito:
        • Limpe os filtros regularmente: Filtros sujos aumentam o consumo de energia e diminuem a qualidade do ar.
        • Fique de olho na temperatura: O ideal é manter entre 23°C e 25°C. Isso garante conforto e economia.
        • Verifique a vedação dos ambientes: Portas e janelas bem fechadas evitam o desperdício de energia.
        • Agende manutenções preventivas: Além de evitar problemas, aumenta a vida útil do aparelho.`,
      },
    { titulo: 'Dica do Dia: Como Melhorar o Desempenho do Seu Ar-Condicionado! ❄️',
      temBanner: true,
      conteudo: null},
    { titulo: 'Dica do Dia: Como Melhorar o Desempenho do Seu Ar-Condicionado! ❄️',
      temBanner: false,
      conteudo:
       `
       Você sabia que pequenos cuidados podem fazer toda a diferença na eficiência do seu ar-condicionado?

        Aqui vão algumas dicas simples, mas que ajudam muito:
        • Limpe os filtros regularmente: Filtros sujos aumentam o consumo de energia e diminuem a qualidade do ar.
        • Fique de olho na temperatura: O ideal é manter entre 23°C e 25°C. Isso garante conforto e economia.
        • Verifique a vedação dos ambientes: Portas e janelas bem fechadas evitam o desperdício de energia.
        • Agende manutenções preventivas: Além de evitar problemas, aumenta a vida útil do aparelho.`,
      },
    { titulo: null,
      temBanner: true,
      conteudo: null},
  ];

  comunidadeId:string | null = null;
  isLoading : boolean = false;
  comunidade: ComunidadeResponseDTO | null = null;
  bannerURL: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private comunidadeService:ComunidadeService,
    private http: HttpClient,
    private modalGenericoService: ModalGenericoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.carregarComunidade();
  } 

  carregarComunidade(): void{
    this.comunidadeId = this.route.snapshot.paramMap.get('id');
    if (!this.comunidadeId) { return; }
    this.isLoading = true;

    this.comunidadeService.obterComunidadePorId(this.comunidadeId).subscribe({
      next: (comunidade: ComunidadeResponseDTO) => {
        this.comunidade = comunidade;
        this.bannerUrl = comunidade.bannerUrl || '/assets/imagens/banner-trampo-generico.png';
        this.isLoading = false;
        },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro ao carregar comunidade:', err);
      }
    });
  }

  abrirModalMenu(): void {
    this.modalGenericoService.openModal(
      {
        title: 'Opções da Comunidade',
        size: 'md:max-w-md',
        showFooter: false,
        cancelTextoBotao: 'Fechar'
      },
      undefined,
      this.templateMenuModal
    );
  }

  fecharModalMenu(): void {
    this.modalGenericoService.closeModal();
  }

    sairDaComunidade(): void {
    if (this.comunidade?.id) {
      this.comunidadeService.sairDaComunidade(this.comunidade.id).subscribe({
        next: () => {
          this.fecharModalMenu();
           this.router.navigate(['/usuario/comunidades']);
        },
        error: (err) => {
          console.error('Erro ao sair da comunidade:', err);
          this.fecharModalMenu();
        }
      });
    }
  }

}
