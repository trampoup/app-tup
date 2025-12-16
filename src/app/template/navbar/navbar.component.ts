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
import { Notificacao } from 'src/app/sistema/notificacoes/Notificacao';


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

  isNotificationOpen = false;
  notifications: Notificacao[] = [];
  unreadNotifications = 0;

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

    this.carregarNotificacoesMock();
    this.updateUnreadCount();
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

  private carregarNotificacoesMock(): void {
    const fotoGenerica = 'assets/imagens/foto-perfil-generico.png';

    const agora = Date.now();

    this.notifications = [
      {
        id: 1,
        nomeUsuario: 'Paulo Clima LTDA',
        descricao: 'Lembrete de serviço amanhã às 14h.',
        dataNotificacao: new Date(agora - 20 * 60 * 1000), // há 20 minutos
        lida: false,
        fotoUrl: 'assets/imagens/imagens-de-exemplo/foto-profissional.png'
      },
      {
        id: 2,
        nomeUsuario: 'Fernanda Lima',
        descricao: 'enviou uma nova mensagem para você.',
        dataNotificacao: new Date(agora - 2 * 60 * 60 * 1000), // há 2 horas
        lida: false,
        fotoUrl: fotoGenerica
      },
      {
        id: 3,
        nomeUsuario: 'Fernanda Lima',
        descricao: 'enviou uma nova mensagem para você.',
        dataNotificacao: new Date(agora - 5 * 60 * 1000), // há 5 minutos
        lida: false,
        fotoUrl: fotoGenerica
      },
      {
        id: 4,
        nomeUsuario: 'Fernanda Lima',
        descricao: 'enviou uma nova mensagem para você.',
        dataNotificacao: new Date(agora - 26 * 60 * 60 * 1000), // há 1 dia+
        lida: true,
        fotoUrl: fotoGenerica
      },
      {
        id: 5,
        nomeUsuario: 'Fernanda Lima',
        descricao: 'enviou uma nova mensagem para você.',
        dataNotificacao: new Date(agora - 3 * 24 * 60 * 60 * 1000), // há 3 dias
        lida: true,
        fotoUrl: fotoGenerica
      },
      {
        id: 6,
        nomeUsuario: 'Fernanda Lima',
        descricao: 'enviou uma nova mensagem para você.',
        dataNotificacao: new Date(agora - 4 * 24 * 60 * 60 * 1000), // há 3 dias
        lida: true,
        fotoUrl: fotoGenerica
      },
      {
        id: 7,
        nomeUsuario: 'Fernanda Lima',
        descricao: 'enviou uma nova mensagem para você.',
        dataNotificacao: new Date(agora - 4 * 24 * 60 * 60 * 1000), // há 3 dias
        lida: true,
        fotoUrl: fotoGenerica
      }
    ];

    this.notifications.sort(
      (a, b) => new Date(b.dataNotificacao).getTime() - new Date(a.dataNotificacao).getTime()
    );
  }

  getTempoDecorrido(notificacao: Notificacao): string {
    if (!notificacao?.dataNotificacao) {
      return '';
    }

    const agora = Date.now();
    const data = new Date(notificacao.dataNotificacao).getTime();
    const diffMs = agora - data;

    if (diffMs < 0) {
      return 'agora mesmo';
    }

    const diffSeg = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSeg / 60);
    const diffHoras = Math.floor(diffMin / 60);
    const diffDias = Math.floor(diffHoras / 24);

    if (diffMin < 1) {
      return 'agora mesmo';
    }

    if (diffMin < 60) {
      return `há ${diffMin} minuto${diffMin > 1 ? 's' : ''}`;
    }

    if (diffHoras < 24) {
      return `há ${diffHoras} hora${diffHoras > 1 ? 's' : ''}`;
    }

    return `há ${diffDias} dia${diffDias > 1 ? 's' : ''}`;
  }

  // Método para alternar o dropdown de notificações
  toggleNotification(): void {
    this.isNotificationOpen = !this.isNotificationOpen;
    
    // Fecha o dropdown do usuário se estiver aberto
    if (this.isNotificationOpen && this.isDropdownOpen) {
      this.isDropdownOpen = false;
    }
  }


  markNotificationAsRead(notification: Notificacao): void {
    if (notification.lida) return;
    notification.lida = true;
    this.updateUnreadCount();
  }

  markAllAsRead(): void {
    // Marca todas as notificações como lidas
    this.notifications.forEach(notification => {
      notification.lida = true;
    });
    
    // Atualiza o contador de notificações não lidas
    this.updateUnreadCount();
  }

  // Método para atualizar contador de não lidas
  updateUnreadCount(): void {
    this.unreadNotifications = this.notifications.filter(n => !n.lida).length;
  }


}
