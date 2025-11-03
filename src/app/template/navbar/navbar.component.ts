import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
  TemplateRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/configs/services/auth.service';
import { LocalizacaoService } from 'src/app/configs/services/localizacao.service';
import { ModalGenericoService } from 'src/app/configs/services/modal-generico.service';
import { Localizacao } from 'src/app/sistema/localizacao/localizacao';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('sidebar') sidebar!: ElementRef;
  @ViewChild('header') header!: ElementRef;
  @ViewChild('content') content!: ElementRef;
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  @ViewChild('dropdownToggle') dropdownToggle!: ElementRef;

  @ViewChild('templateConteudoModal') templateConteudoModal!: TemplateRef<any>;

  isSidebarOpen = false;
  isDropdownOpen = false;

  nomeUsuario: string = '';
  permissaoUsuario: string = '';
  fotoUsuario:string | null = null;

  localizacaoUsuario: Localizacao | null = null;
  enderecoUsuario: string = '';
  cidadeUsuario: string = '';
  estadoUsuario: string = '';

  isLoading: boolean = false;
  isSavingSelection:boolean = false;
  localizacoes: Localizacao[] = [];
  selectedLocalizacaoId: number | string | null = null;

   // Mapeamento das permissões para suas descrições
  private permissaoDescricao: { [key: string]: string } = {
    'ADMIN': 'Administrador',
    'PROFISSIONAL': 'Profissional',
    'CLIENTE': 'Cliente'
  };

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private authService: AuthService,
    private modalGenericoService: ModalGenericoService,
    private localizacaoService: LocalizacaoService
  ) {}

  ngOnInit(): void {
    this.authService.obterPerfilUsuario().subscribe({
      next: (perfil) => {
        this.nomeUsuario = perfil.nome;
        this.permissaoUsuario = this.permissaoDescricao[perfil.tipoUsuario] || 'Usuário';
        this.enderecoUsuario = perfil.endereco ?? "Endereço do Usuário";
        this.cidadeUsuario = perfil.cidade,
        this.estadoUsuario = perfil.estado
        this.localizacaoUsuario = perfil.localizacaoAtual ?? null;
      },
      error: (error) => {
        console.error('Erro ao obter perfil do usuário:', error);
      }
    });
  }

  carregarLocalizacoes():void{
    this.isLoading = true;
    this.localizacaoService.obterLocalizacoesLogado().subscribe({
      next: (localizacoes) => {
        this.localizacoes = localizacoes;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar localizações:', error);
        this.isLoading = false;
      }
    });
  }

  abrirModalSelecionarLocalizacao():void{
    this.carregarLocalizacoes();
    this.modalGenericoService.openModal(
      {
        title:'Escolher localização',
        size: 'md:max-w-3xl',
        showFooter:false
      },
      undefined,
      this.templateConteudoModal
    );
  }

  selecionarLocalizacao(localizacao:Localizacao):void{
    if (this.isSavingSelection) return;
    this.isSavingSelection = true;

    this.localizacaoService.definirLocalizacaoAtual(localizacao.id!).subscribe({
      next: () => {
        // atualizar header imediatamente
        this.enderecoUsuario = `${localizacao.rua}, ${localizacao.numero}`;
        this.cidadeUsuario = localizacao.cidade!;
        this.estadoUsuario = localizacao.estado!;

        this.isSavingSelection = false;
      },
      error: () => { this.isSavingSelection = false; }
    });
  }

  isSelected(loc: Localizacao): boolean {
    const id = (loc as Localizacao).id ?? (loc as Localizacao).id;
    return this.selectedLocalizacaoId === id;
  }

  onSelectLocalizacao(loc: Localizacao): void {
    if (this.isSavingSelection) return;

    const id = (loc as any).id ?? (loc as any).idLocalizacao;
    this.selectedLocalizacaoId = id;
    this.isSavingSelection = true;

    const aplicarNoHeader = () => {
      this.localizacaoUsuario = loc; // <-- seta a atual para o header usar
      this.enderecoUsuario = `${loc.rua}, ${loc.numero}`;
      this.cidadeUsuario = loc.cidade!;
      this.estadoUsuario = loc.estado!;
    };

    // Se existir um endpoint para definir a localização atual/padrão, chame-o.
    // Ajuste o nome do método conforme seu service.
    const temPersistencia = (this.localizacaoService as any).definirLocalizacaoAtual;

    if (temPersistencia) {
      (this.localizacaoService as any).definirLocalizacaoAtual(id).subscribe({
        next: () => {
          aplicarNoHeader();
          this.isSavingSelection = false;
          this.modalGenericoService.closeModal();
        },
        error: (err: any) => {
          console.error('Erro ao definir localização atual:', err);
          this.isSavingSelection = false;
        }
      });
    } else {
      // Sem persistência: aplica localmente e fecha
      aplicarNoHeader();
      this.isSavingSelection = false;
    }
  }

  getRotaMeuPerfil(): string {
    if (this.authService.isCliente()) {
      return '/usuario/minha-conta-cliente';
    } else if (this.authService.isProfissional()) {
      return '/usuario/minha-conta-profissional';
    } else if (this.authService.isAdministrador()) {
      return '/usuario/minha-conta-admin';
    } else {
      return '/login'; // rota padrão se nenhum tipo corresponder
    }
  }

  isCliente(): boolean{
    return this.authService.isCliente();
  }

  isAdmin(): boolean{
    return this.authService.isAdministrador();
  }

  isProfissional(): boolean{
    return this.authService.isProfissional();
  }

  rotaInicial(): string{
    return this.authService.getRotaInicial();
  }

  rotaDashboard(): string{
    return this.authService.getRotaDashboard()
  }

  ngAfterViewInit(): void {
    if (!this.sidebar || !this.header || !this.content) {
      console.error('Erro: Elementos da Navbar não foram encontrados');
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;

    if (this.sidebar && this.header && this.content) {
      if (this.isSidebarOpen) {
        this.renderer.addClass(this.sidebar.nativeElement, 'show-sidebar');
        this.renderer.addClass(this.header.nativeElement, 'left-pd');
        this.renderer.addClass(this.content.nativeElement, 'shifted');
        // 🔹 Ajusta a margem dinamicamente para 280px
        this.renderer.setStyle(
          this.content.nativeElement,
          'margin-left',
          '280px'
        );
      } else {
        this.renderer.removeClass(this.sidebar.nativeElement, 'show-sidebar');
        this.renderer.removeClass(this.header.nativeElement, 'left-pd');
        this.renderer.removeClass(this.content.nativeElement, 'shifted');
        // 🔹 Ajusta a margem dinamicamente para 90px
        this.renderer.setStyle(
          this.content.nativeElement,
          'margin-left',
          '90px'
        );
      }
    }
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;

    if (this.sidebar && this.header && this.content) {
      this.renderer.removeClass(this.sidebar.nativeElement, 'show-sidebar');
      this.renderer.removeClass(this.header.nativeElement, 'left-pd');
      this.renderer.removeClass(this.content.nativeElement, 'shifted');
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    const dropdownToggle = document.getElementById('dropdown-toggle');
    if (dropdownToggle) {
      if (this.isDropdownOpen) {
        dropdownToggle.classList.add('active');
      } else {
        dropdownToggle.classList.remove('active');
      }
    }
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }

  logout() {
    this.authService.encerrarSessao();
    this.router.navigate(['/login']);
  }

  getInitial(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }

  getRandomColor(seed: string): string {
    const colors = [
      '#FFB3BA', // rosa pastel
      '#FFDFBA', // laranja pastel
      '#BAFFC9', // verde pastel
      '#BAE1FF', // azul pastel
      '#D5BAFF'  // roxo pastel
    ];
    const index = seed ? seed.charCodeAt(0) % colors.length : 0;
    return colors[index];
  }
}
