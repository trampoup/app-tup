import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/configs/services/auth.service';
import { TipoUsuario } from 'src/app/login/tipo-usuario.enum';

@Component({
  selector: 'app-mini-site-publico',
  templateUrl: './mini-site-publico.component.html',
  styleUrls: ['./mini-site-publico.component.css']
})
export class MiniSitePublicoComponent implements OnInit {
  TipoUsuario = TipoUsuario;

  servicos = [ /*LISTA DE SERVICOS(TEMPORÁRIO, SOMENTE PARA MOSTRAR A INTERFACE AO ALEX)*/
    {
      titulo: 'Instalação de Ar-Condicionado Split',
      descricao: 'Instalação completa de unidades split com avaliação do local, fixação segura e testes.',
      valor: 250.00,
    },
    {
      titulo: 'Instalação de Ar-Condicionado Split',
      descricao: 'Instalação completa de unidades split com avaliação do local, fixação segura e testes.',
      valor: 250.00,
    },
    {
      titulo: 'Instalação de Ar-Condicionado Split',
      descricao: 'Instalação completa de unidades split com avaliação do local, fixação segura e testes.',
      valor: 250.00,
    },
    {
      titulo: 'Instalação de Ar-Condicionado Split',
      descricao: 'Instalação completa de unidades split com avaliação do local, fixação segura e testes.',
      valor: 250.00,
    },
    {
      titulo: 'Instalação de Ar-Condicionado Split',
      descricao: 'Instalação completa de unidades split com avaliação do local, fixação segura e testes.',
      valor: 250.00,
    },
    {
      titulo: 'Instalação de Ar-Condicionado Split',
      descricao: 'Instalação completa de unidades split com avaliação do local, fixação segura e testes.',
      valor: 250.00,
    },
    {
      titulo: 'Instalação de Ar-Condicionado Split',
      descricao: 'Instalação completa de unidades split com avaliação do local, fixação segura e testes.',
      valor: 250.00,
    }
  ];

  avaliacoes = [ /*LISTA DE AVALIAÇÕES(TEMPORÁRIO, SOMENTE PARA MOSTRAR A INTERFACE AO ALEX)*/
    {
      nome: 'Maria',
      foto: '/assets/imagens/imagens-de-exemplo/m-userphoto-exemplo.png',
      titulo: 'Ameiiii!!!!',
      descricao: 'Serviço rápido e bem feito. Muito atencioso!'
    },
    {
      nome: 'Carlos',
      foto: '/assets/imagens/imagens-de-exemplo/c-userphoto-exemplo.png',
      titulo: 'Super recomendo!',
      descricao: 'Meu ar voltou a funcionar como novo. Super recomendo!'
    },
    {
      nome: 'Juliana',
      foto: '/assets/imagens/imagens-de-exemplo/j-userphoto-exemplo.png',
      titulo: 'Instalação sem sujeira',
      descricao: 'Fez a instalação sem sujeira e explicou tudo direitinho.'
    },
    {
      nome: 'Carlos',
      foto: '/assets/imagens/imagens-de-exemplo/c-userphoto-exemplo.png',
      titulo: 'Super recomendo!',
      descricao: 'Meu ar voltou a funcionar como novo. Super recomendo!'
    },
    {
      nome: 'Maria',
      foto: '/assets/imagens/imagens-de-exemplo/m-userphoto-exemplo.png',
      titulo: 'Ameiiii!!!!',
      descricao: 'Serviço rápido e bem feito. Muito atencioso!'
    }
  ];
  // Paginacao de servicos
  paginaAtualServicos = 1;
  itensPorPaginaServicos = 6;
  totalPaginasServicos = Math.ceil(this.servicos.length / this.itensPorPaginaServicos);
  servicosPaginados: typeof this.servicos = [];

  // Paginacao de avaliacoes
  paginaAtualAvaliacoes = 1;
  itensPorPaginaAvaliacoes = 4;
  totalPaginasAvaliacoes = Math.ceil(this.avaliacoes.length / this.itensPorPaginaAvaliacoes);
  avaliacoesPaginadas: typeof this.avaliacoes = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.atualizarPaginacaoServicos();
    this.atualizarPaginacaoAvaliacoes();
  }

  // valores mockados só para visual
  userScore = 120;
  maxScore = 200;

  get progressPercent(): number {
    return Math.min(100, Math.round((this.userScore / this.maxScore) * 100));
  }


  getRoleUsuario(): TipoUsuario {
    return this.authService.getRoleUsuario();
  }

  atualizarPaginacaoAvaliacoes(): void {
    const inicio = (this.paginaAtualAvaliacoes - 1) * this.itensPorPaginaAvaliacoes;
    const fim = inicio + this.itensPorPaginaAvaliacoes;
    this.avaliacoesPaginadas = this.avaliacoes.slice(inicio, fim);
  }

  get totalItensAvaliacoes() {
    return this.avaliacoes.length; 
  }

  onPaginaMudouAvaliacoes(novaPagina: number) {
    this.paginaAtualAvaliacoes = novaPagina;
    this.atualizarPaginacaoAvaliacoes();
  }

  atualizarPaginacaoServicos(): void {
    const inicio = (this.paginaAtualServicos - 1) * this.itensPorPaginaServicos;
    const fim = inicio + this.itensPorPaginaServicos;
    this.servicosPaginados = this.servicos.slice(inicio, fim);
  }

  get totalItensServicos() {
    return this.servicos.length; 
  }

  onPaginaMudouServicos(novaPagina: number) {
    this.paginaAtualServicos = novaPagina;
    this.atualizarPaginacaoServicos();
  }

  redirectToGameficacao(){
    this.router.navigate(['/usuario/gameficacao']);
  }

  redirectToEditarSite(){
    this.router.navigate(['/usuario/cadastro-de-site']);
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
}
