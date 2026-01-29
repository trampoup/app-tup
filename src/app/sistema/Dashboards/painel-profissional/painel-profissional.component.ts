import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/configs/services/auth.service';
import { ClimaService } from 'src/app/configs/services/clima.service';
import { ModalWelcomeService } from 'src/app/configs/services/modal-welcome.service';
import { UsuarioDadosDTO } from '../../cupons/UsuarioDadosDTO';
import { StatusServico } from '../../servicos/StatusServico';
import { getAvatarColor } from 'src/app/shared/avatar/avatar-color.utils';
import { ModalGenericoService } from 'src/app/configs/services/modal-generico.service';

@Component({
  selector: 'app-painel-profissional',
  templateUrl: './painel-profissional.component.html',
  styleUrls: ['./painel-profissional.component.css']
})
export class PainelProfissionalComponent implements OnInit {
  @ViewChild('finalizarServicoTpl', { static: true }) finalizarServicoTpl!: TemplateRef<any>;

  usuario: UsuarioDadosDTO | null = null;
  weatherDescription: string = 'Carregando...'; //nublado, etc..
  temperature: number = 0; //temperatura
  iconUrl: string = ''; //imagem de acordo com o clima.
  windSpeed: number = 0; //velocidade do vento
  weatherData: any = {}; //.name é a cidade
  currentTime: string = '';
  currentDate: string = '';

  quantidadeTotalServicos: number = 120;
  avaliacaoMedia: number = 4.6;
  quantidadeServicosDoMes: number = 8;
  quantidadeClientesAtendidos:number = 61;

  StatusServico = StatusServico;

  servicoSelecionado: any | null = null;
  codigo: string[] = Array(6).fill('');


  historicoServicos = [ //PROVISORIO
    {
      tipo:'Limpeza',
      photo: '/assets/imagens/imagens-de-exemplo/m-userphoto-exemplo.svg',
      nome: 'Maria Silva',
      status: StatusServico.EM_PROGRESSO,
      ingressou: new Date('2025-01-15')
    },
    {
      tipo:'Limpeza',
      photo: '/assets/imagens/imagens-de-exemplo/p-userphoto-exemplo.svg',
      nome: 'Pedro Costa',
      status: StatusServico.CONCLUIDO,
      ingressou: new Date('2025-06-03')
    },
    {
      tipo:'Limpeza',
      photo: '/assets/imagens/imagens-de-exemplo/p-userphoto-exemplo.svg',
      nome: 'Pedro Costa',
      status: StatusServico.CONCLUIDO,
      ingressou: new Date('2025-06-03')
    },
    {
      tipo:'Limpeza',
      photo: '/assets/imagens/imagens-de-exemplo/j-userphoto-exemplo.svg',
      nome: 'Joana Mendes',
      status: StatusServico.CONCLUIDO,
      ingressou: new Date('2025-05-28')
    },
    {
      tipo:'Limpeza',
      photo: '/assets/imagens/imagens-de-exemplo/j-userphoto-exemplo.svg',
      nome: 'Joana Mendes',
      status: StatusServico.CONCLUIDO,
      ingressou: new Date('2025-06-13')
    }
  ];

  constructor(
    private authService: AuthService,
    private climaService: ClimaService,
    private modalWelcomeService:ModalWelcomeService,
    private modalGenericoService: ModalGenericoService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.renderChartGrafico();
    this.getWeatherForCurrentLocation();
    this.renderCharServicosPorMes();

    this.authService.obterPerfilUsuario().subscribe(
      (usuario) => {
        this.usuario = usuario;
      }
    );
  
    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 60_000);
    
    if (this.authService.showModal) {
      setTimeout(() => this.mostrarModalWelcome(), 0);
    }
  }
  
  mostrarModalWelcome(){
    if (this.authService.showModal) {
      this.modalWelcomeService.openModal({
        title: '👋 Bem-vindo!',
        size: 'md' 
      });
      this.authService.showModal = false;
    }
  }

  abrirModalFinalizar(servico: any): void {
    this.servicoSelecionado = servico;
    this.codigo = Array(6).fill('');

    this.modalGenericoService.openModal(
      {
        title: 'Finalizar Serviço',
        description: '',
        size: 'md',                 
        confirmTextoBotao: 'Finalizar Serviço',
        confirmButtonClass: 'btn-success',
        cancelTextoBotao: 'Cancelar',
        showFooter: true
      },
      () => this.confirmarFinalizacao(),
      this.finalizarServicoTpl
    );

    setTimeout(() => {
      const first = document
      .querySelector('.codigo-container input.codigo-input') as HTMLInputElement | null;
      first?.focus();
    }, 0);

  }

  confirmarFinalizacao(): boolean {
    const code = this.codigo.join('');
    const isValid = this.codigo.every(c => !!c) && code.length === 6;

    if (!isValid) return false;

    return true; 
  }

  private getCodeInputs(target: EventTarget | null): HTMLInputElement[] {
    const el = target as HTMLElement | null;
    const container = el?.closest('.codigo-container') as HTMLElement | null;
    if (!container) return [];
    return Array.from(container.querySelectorAll('input.codigo-input')) as HTMLInputElement[];
  }

  onCodeKeydown(index: number, event: KeyboardEvent): void {
    const inputEl = event.target as HTMLInputElement;
    const inputs = this.getCodeInputs(event.target);
    const key = event.key;

    // deixa Tab e Shift+Tab
    if (key === 'Tab') return;

    // navegação
    if (key === 'ArrowLeft') {
      event.preventDefault();
      inputs[index - 1]?.focus();
      return;
    }
    if (key === 'ArrowRight') {
      event.preventDefault();
      inputs[index + 1]?.focus();
      return;
    }

    // apagar
    if (key === 'Backspace') {
      event.preventDefault();

      if (this.codigo[index]) {
        this.codigo[index] = '';
        inputEl.value = '';
        return;
      }

      if (index > 0) {
        const prev = inputs[index - 1];
        this.codigo[index - 1] = '';
        if (prev) {
          prev.value = '';
          prev.focus();
        }
      }
      return;
    }

    if (key === 'Delete') {
      event.preventDefault();
      this.codigo[index] = '';
      inputEl.value = '';
      return;
    }

    if (key.length === 1) {
      const ch = key.toUpperCase();
      if (!/^[A-Z0-9]$/.test(ch)) {
        event.preventDefault();
        return;
      }

      event.preventDefault(); 
      this.codigo[index] = ch;
      inputEl.value = ch;
      // avança
      if (index < this.codigo.length - 1) {
        inputs[index + 1]?.focus();
      }
      return;
    }
  }

  onCodePaste(index: number, event: ClipboardEvent): void {
    event.preventDefault();

    const text = event.clipboardData?.getData('text') ?? '';
    const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!cleaned) return;

    const inputs = this.getCodeInputs(event.target);

    for (let off = 0; off < this.codigo.length - index && off < cleaned.length; off++) {
      const ch = cleaned[off];
      this.codigo[index + off] = ch;

      const el = inputs[index + off];
      if (el) el.value = ch;
    }

    const nextIndex = Math.min(index + cleaned.length, this.codigo.length - 1);
    inputs[nextIndex]?.focus();
  }

  
  trackByIndex(index: number): number {
    return index;
  }

  selectAll(event: FocusEvent): void {
    const el = event.target as HTMLInputElement;
    el.select();
  }


  renderChartGrafico() {
    const options = {
      chart: {
        type: 'donut',
        height: 350,
        width: '100%',
      },
      title: {
        text: 'Gráfico',
        align: 'left',
      },
      series: [33, 22, 18, 10, 17],            // % aproximados de cada fatia
      labels: ['Item', 'Item', 'Item', 'Item', 'Item'],
      theme: {
        palette: 'palette8',
      },
      legend: {
        show: true,
        position: 'bottom',          // coloca a legenda embaixo
        horizontalAlign: 'center',   // centraliza
      },
      responsive: [
        {
          breakpoint: 980,
          options: {
            chart: {
              width: 250,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  
  const chart = new ApexCharts(
    document.querySelector('#chart-grafico'),
    options
    )
    chart.render();
  }
  
  renderCharServicosPorMes() {
    const options = {
      series: [
        { name: 'Serviços', data: [5, 8, 6, 10, 12, 9, 15, 11, 14, 18, 20, 16] },
      ],
      chart: {
        type: 'bar',
        height: 350,
        width: '100%',
        toolbar: { show: false }
      },
      colors:['#1E944B'],
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' },
      title: { text: 'Serviços por mês', align: 'left' },
      xaxis: {
        categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
      },
      legend: {
        show: false
      }
    };

    const chart = new ApexCharts(
      document.querySelector('#chart-crescimento-mensal'),
      options
    );
    chart.render();

  }
  
  private updateDateTime() {
    const now = new Date();
    // formata HH:mm em pt-BR
    this.currentTime = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });


    // aqui geramos “segunda-feira, 27/05” já em pt-BR
    this.currentDate = now.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit'
    });

    this.cdr.detectChanges();
  }

  getWeatherForRussas(): void {
    this.climaService.fetchWeatherForRussas().subscribe((data) => {
      this.weatherData = data;
      this.updateWeatherInfo();
    });
  }

  getWeatherForCurrentLocation(): void {
    this.climaService.fetchWeatherForCurrentLocation().subscribe(
      (data) => {
        this.weatherData = data;
        this.updateWeatherInfo();
      },
      (error) => {
        console.error('Error getting location', error);
        this.getWeatherForRussas();
      }
    );
  }

  getWeatherForLocation(lat: number, lon: number): void {
    this.climaService.fetchWeather(lat, lon).subscribe((data) => {
      this.weatherData = data;
      this.updateWeatherInfo();
    });
  }
  
  updateWeatherInfo(): void {
    if (this.weatherData) {
      this.weatherDescription = this.weatherData.weather[0].description;
      this.temperature = Math.round(this.weatherData.main.temp);
      this.iconUrl = `http://openweathermap.org/img/wn/${this.weatherData.weather[0].icon}.png`;
      this.windSpeed = this.weatherData.wind.speed;
      this.cdr.detectChanges();
    }
  }

  getInitials(nome: string): string {
    const n = (nome ?? '').trim();
    if (!n) return '';
    const parts = n.split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    return (first).toUpperCase();
  }

  getAvatarColor(nome: string): string {
    return getAvatarColor(nome);
  }
  
}
