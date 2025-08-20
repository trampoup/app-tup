import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-profissional',
  templateUrl: './inicio-profissional.component.html',
  styleUrls: ['./inicio-profissional.component.css']
})
export class InicioProfissionalComponent implements OnInit {
  anuncios = [ /*LISTA DE ANUNCIOS(TEMPORÁRIO, SOMENTE PARA MOSTRAR A INTERFACE AO ALEX)*/
    {
      titulo: 'anuncio 2',
      imagem: 'assets/imagens/imagens-de-exemplo/anuncio1-exemplo.png'
    },
    {
      titulo: 'anuncio 1',
      imagem: 'assets/imagens/imagens-de-exemplo/anuncio2-exemplo.png'
    }
  ];

  destaques = [
    {
      titulo: 'destaque1',
      imagem: 'assets/imagens/imagens-de-exemplo/profissional-exemplo.png'
    },
    {
      titulo: 'destaque2',
      imagem: 'assets/imagens/imagens-de-exemplo/profissional-exemplo.png'
    },
    {
      titulo: 'destaque3',
      imagem: 'assets/imagens/imagens-de-exemplo/profissional-exemplo.png'
    },
    {
      titulo: 'destaque4',
      imagem: 'assets/imagens/imagens-de-exemplo/profissional-exemplo.png'
    },
    {
      titulo: 'destaque5',
      imagem: 'assets/imagens/imagens-de-exemplo/profissional-exemplo.png'
    },
    {
      titulo: 'destaque6',
      imagem: 'assets/imagens/imagens-de-exemplo/profissional-exemplo.png'
    }
];
  paginaAtual: number = 1;
  itensPorPagina: number = 8;
  totalPaginas: number = Math.ceil(this.destaques.length / this.itensPorPagina);
  destaquesPaginados : any[] = [];

  paginaAtualServicos: number = 1;
  itensPorPaginaServicos: number = 8;
  totalPaginasServicos: number = Math.ceil(this.anuncios.length / this.itensPorPagina);
  servicosPaginados : any[] = [];


  // 👇 Estado de expansão (índice dentro da página atual)
  expandedDestaqueIndex: number | null = null;


  constructor(
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.atualizarPaginacaoDestaques();
    this.atualizarPaginacaoServicos();
  }

  // Toggle do card
  toggleDestaque(i: number) {
    this.expandedDestaqueIndex = this.expandedDestaqueIndex === i ? null : i;
  }

  // Acessibilidade: ESC para fechar expansão
  @HostListener('document:keydown.escape')
  onEsc() {
    this.expandedDestaqueIndex = null;
  }

  // Exemplo de ação dentro do card expandido
  verPerfil(d: any, $event: MouseEvent) {
    $event.stopPropagation(); // evita fechar/alternar o card ao clicar no botão
    this.router.navigate(['/usuario/perfil-profissional']); // Navega para o perfil do profissional
  }

  trackByIndex(index: number, _item: any): number {
    return index;
  }

  atualizarPaginacaoDestaques(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.destaquesPaginados = this.destaques.slice(inicio, fim);
  }

  get totalItens() {
    return this.destaques.length;
  }

  onPaginaMudou(novaPagina: number) {
    this.paginaAtual = novaPagina;
    this.expandedDestaqueIndex = null; // fecha ao mudar de página
    this.atualizarPaginacaoDestaques();
  }


  atualizarPaginacaoServicos(): void {
    const inicio = (this.paginaAtualServicos - 1) * this.itensPorPaginaServicos;
    const fim = inicio + this.itensPorPaginaServicos;
    this.servicosPaginados = this.destaques.slice(inicio, fim); //SUBSTITUIR POR SERVIÇOS QUANDO IMPLEMENTAR
  }

  get totalItensServicos() {
    return this.destaques.length; //SUBSTITUIR POR SERVIÇOS QUANDO IMPLEMENTAR
  }

  onPaginaMudouServicos(novaPagina: number) {
    this.paginaAtualServicos = novaPagina;
    this.atualizarPaginacaoServicos();
  }

}
