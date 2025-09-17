import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComunidadeService } from 'src/app/configs/services/comunidade.service';
import { ComunidadeResponseDTO } from '../ComunidadeResponseDTO';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-visualizar-comunidade',
  templateUrl: './visualizar-comunidade.component.html',
  styleUrls: ['./visualizar-comunidade.component.css']
})
export class VisualizarComunidadeComponent implements OnInit {
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
  ) { }

  ngOnInit(): void {
    this.carregarComunidade();
  } 

  carregarComunidade(): void{
    this.comunidadeId = this.route.snapshot.paramMap.get('id');
    console.log('ID da comunidade:', this.comunidadeId);
    if (!this.comunidadeId) { return; }
    this.isLoading = true;

    this.comunidadeService.obterComunidadePorId(this.comunidadeId).subscribe({
      next: (comunidade: ComunidadeResponseDTO) => {
        console.log('Comunidade obtida:', comunidade);
        this.comunidade = comunidade;
        //isso aqui vai mudar, é só pra mostrar na reunião
        this.http.get(`${environment.apiURLBase}/api/comunidades/${comunidade.id}/banner`, { responseType: 'blob' })
          .subscribe(blob => {
            if (!blob || blob.size === 0) {
              this.bannerUrl = '/assets/imagens/banner-trampo-generico.png';
              return;
            }
            const imgBlob = blob.type?.startsWith('image/') ? blob : new Blob([blob], { type: 'image/jpeg' });
            const reader = new FileReader();
            reader.onload = () => this.bannerUrl = reader.result as string; // data:image/...
            reader.readAsDataURL(imgBlob);
          });
          this.isLoading = false;
        },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro ao carregar comunidade:', err);
      }
    });
  }

}
