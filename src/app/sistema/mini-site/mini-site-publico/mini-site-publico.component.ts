import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/configs/services/auth.service';
import { TipoUsuario } from 'src/app/login/tipo-usuario.enum';
import { UsuarioSiteDTO } from '../cadastrar-site/usuario-site-dto';
import { UsuarioService } from 'src/app/configs/services/usuario.service';
import { UsuarioMidiasService } from 'src/app/configs/services/usuario-midias.service';

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

  isLoading : boolean = false;

  perfil: UsuarioSiteDTO | null = null;
  skillsLista: string[] = [];

  // URLs de mídia (blob:)
  bannerUrl: string | null = null;
  fotoUrl: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,  
    private usuarioService:UsuarioService,
    private usuarioMidiasService:UsuarioMidiasService
  ) { }

  ngOnInit(): void {
    this.atualizarPaginacaoServicos();
    this.atualizarPaginacaoAvaliacoes();


    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);
    if (!id || Number.isNaN(id)) {
      console.log("URL INVALIDA ID AUSENTE");
      this.isLoading = false;
      return;
    }

    this.carregarPerfilPublico(id);
    this.carregarMidiasPublicas(id);
  }

  // ----- Perfil (dados)
  private carregarPerfilPublico(id: number) {
    this.usuarioService.obterSitePorIdUsuario(id).subscribe({
      next: (dto) => {
        this.perfil = dto;
        const raw = dto?.skills ?? '';
        this.skillsLista = raw.split(/[;,]/).map(s => s.trim()).filter(Boolean);
      },
      error: () => {},
      complete: () => this.isLoading = false
    });
  }

  // ----- Mídias
  private carregarMidiasPublicas(id: number) {
    // banner
    this.usuarioMidiasService.getMidiaDoUsuario('banner', id).subscribe({
      next: (blob) => {
        if (!blob || blob.size === 0) return;
        const typed = blob.type?.startsWith('image/') ? blob : new Blob([blob], { type: 'image/jpeg' });
        const reader = new FileReader();
        reader.onload = () => this.bannerUrl = reader.result as string;
        reader.readAsDataURL(typed);
      }
    });

    // foto perfil
    this.usuarioMidiasService.getMidiaDoUsuario('foto_perfil', id).subscribe({
      next: (blob) => {
        if (!blob || blob.size === 0) return;
        const typed = blob.type?.startsWith('image/') ? blob : new Blob([blob], { type: 'image/jpeg' });
        const reader = new FileReader();
        reader.onload = () => this.fotoUrl = reader.result as string;
        reader.readAsDataURL(typed);
      }
    });
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
