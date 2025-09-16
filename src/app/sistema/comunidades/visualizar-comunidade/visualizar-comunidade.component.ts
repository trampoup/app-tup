import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
  }

}
