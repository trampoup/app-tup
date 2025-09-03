import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/configs/services/auth.service';
import { TipoUsuario } from 'src/app/login/tipo-usuario.enum';
import { UsuarioSiteDTO } from '../cadastrar-site/usuario-site-dto';
import { UsuarioService } from 'src/app/configs/services/usuario.service';
import { UsuarioMidiasService } from 'src/app/configs/services/usuario-midias.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-meu-mini-site',
  templateUrl: './meu-mini-site.component.html',
  styleUrls: ['./meu-mini-site.component.css']
})
export class MeuMiniSiteComponent implements OnInit {
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

  comentarios = [
    {
      nome: 'Ana Paula',
      foto: '/assets/imagens/imagens-de-exemplo/a-userphoto-exemplo.png',
      data: 'há 2 dias',
      titulo: 'Excelente atendimento',
      texto: 'Chegou no horário, explicou o serviço e entregou melhor que o combinado.',
      estrelas: 5,
      verificado: true
    },
    {
      nome: 'Rafael N.',
      foto: '/assets/imagens/imagens-de-exemplo/r-userphoto-exemplo.png',
      data: 'há 1 semana',
      titulo: 'Preço justo e serviço rápido',
      texto: 'Instalação sem sujeira e com testes. Recomendo.',
      estrelas: 4,
      verificado: false
    },
    {
      nome: 'Juliana F.',
      foto: '/assets/imagens/imagens-de-exemplo/j-userphoto-exemplo.png',
      data: 'há 3 semanas',
      titulo: 'Resolveu meu problema',
      texto: 'Meu ar não gelava, ele identificou na hora e consertou. Voltarei a contratar.',
      estrelas: 5,
      verificado: true
    },
    {
      nome: 'Carlos M.',
      foto: '/assets/imagens/imagens-de-exemplo/c-userphoto-exemplo.png',
      data: 'há 1 mês',
      titulo: 'Bom, mas poderia ser mais rápido',
      texto: 'Trabalho bem feito, só achei que demorou um pouco na chegada.',
      estrelas: 4,
      verificado: false
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

  perfil: UsuarioSiteDTO | null = null;
  skillsLista: string[] = [];

  // URLs de mídia (blob:)
  bannerUrl: string | null = null;
  fotoUrl: string | null = null;
  videoUrl: SafeUrl | null = null;
  private videoObjectUrl: string | null = null; // para revogar depois

  constructor(
    private authService: AuthService,
    private router: Router,
    private usuarioService : UsuarioService,
    private usuarioMidiasService: UsuarioMidiasService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.atualizarPaginacaoServicos();
    this.atualizarPaginacaoAvaliacoes();

    this.carregarMeuSite();
    this.carregarMidias();
  }

  // valores mockados só para visual
  userScore = 120;
  maxScore = 200;

  get progressPercent(): number {
    return Math.min(100, Math.round((this.userScore / this.maxScore) * 100));
  }


  private carregarMeuSite() {
    this.usuarioService.obterMeuSite().subscribe({
      next: (dto) => {
        this.perfil = dto;
        console.log("meu id", this.perfil.id);
        // monta lista de skills (se vier string "a, b; c")
        const raw = dto?.skills ?? '';
        this.skillsLista = raw
          .split(/[;,]/)
          .map(s => s.trim())
          .filter(Boolean);
      },
      error: () => {
        // se 401 ou erro, mantém mocks/estado padrão
      }
    });
  }  

  private carregarMidias() {
    this.usuarioMidiasService.getMinhaMidia('banner').subscribe({
      next: (blob) => {
        if (!blob || blob.size === 0) return;

        const typed = blob.type?.startsWith('image/')
          ? blob
          : new Blob([blob], { type: 'image/jpeg' }); // fallback

        const reader = new FileReader();
        reader.onload = () => {
          // vira "data:image/..;base64,..." — super confiável no <img [src]>
          this.bannerUrl = reader.result as string;
        };
        reader.readAsDataURL(typed);
      },
      error: () => {}
    });

    this.usuarioMidiasService.getMinhaMidia('foto_perfil').subscribe({
      next: (blob) => {
        if (!blob || blob.size === 0) return;

        const typed = blob.type?.startsWith('image/')
          ? blob
          : new Blob([blob], { type: 'image/jpeg' });

        const reader = new FileReader();
        reader.onload = () => {
          this.fotoUrl = reader.result as string;
        };
        reader.readAsDataURL(typed);
      },
      error: () => {}
    });

    // 🎥 VÍDEO
    this.usuarioMidiasService.getMinhaMidia('video').subscribe({
      next: (blob) => {
        if (!blob || blob.size === 0) return;

        const typed = blob.type?.startsWith('video/')
          ? blob
          : new Blob([blob], { type: 'video/mp4' });

        // revoga o anterior (evita vazamento de memória)
        if (this.videoObjectUrl) URL.revokeObjectURL(this.videoObjectUrl);

        // cria o Object URL e sanitiza
        this.videoObjectUrl = URL.createObjectURL(typed);
        this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(this.videoObjectUrl); // <-- AQUI
      }
    });
  }

  ngOnDestroy(): void {
    if (this.videoObjectUrl) {
      URL.revokeObjectURL(this.videoObjectUrl);
      this.videoObjectUrl = null;
    }
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

  redirectToSitePublico(): void {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/perfil-publico', this.perfil?.id])
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  }


}
