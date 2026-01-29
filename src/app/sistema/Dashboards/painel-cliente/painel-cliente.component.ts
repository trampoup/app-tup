import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/configs/services/auth.service';
import { ClimaService } from 'src/app/configs/services/clima.service';
import { ModalWelcomeService } from 'src/app/configs/services/modal-welcome.service';
import { UsuarioDadosDTO } from '../../cupons/UsuarioDadosDTO';
import { ModalGenericoService } from 'src/app/configs/services/modal-generico.service';
import { StatusServico } from '../../servicos/StatusServico';
import { getAvatarColor } from 'src/app/shared/avatar/avatar-color.utils';

@Component({
  selector: 'app-painel-cliente',
  templateUrl: './painel-cliente.component.html',
  styleUrls: ['./painel-cliente.component.css']
})
export class PainelClienteComponent implements OnInit {
  @ViewChild('avaliacaoTemplate', { static: true }) avaliacaoTemplate!: TemplateRef<any>;

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
  avaliacaoEstrelas = 0;
  starHover = 0;
  avaliacaoTitulo = '';
  avaliacaoTexto = '';
  avaliacaoErro = '';
  servicoSelecionado: any = null;



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
    // this.renderChartGrafico();
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
        // description: 'Aqui vai a mensagem que você quiser...',
        size: 'md'     // sm | md | lg | full  (ajuste para as classes que você definiu no CSS)
      });
      this.authService.showModal = false;
    }
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
  abrirModalAvaliarProfissional(servico: any): void {
    this.servicoSelecionado = servico;

    this.avaliacaoEstrelas = 0;
    this.starHover = 0;
    this.avaliacaoTitulo = '';
    this.avaliacaoTexto = '';
    this.avaliacaoErro = '';

    this.modalGenericoService.openModal(
      {
        title: 'Avaliar Profissional',
        description: '',
        size: 'md',
        confirmTextoBotao: 'Enviar avaliação',
        cancelTextoBotao: 'Cancelar',
        showFooter: true,
        confirmButtonClass: 'btn-success',
      },
      () => this.confirmarAvaliacao(),
      this.avaliacaoTemplate
    );
  }

  confirmarAvaliacao(): boolean {
    if (!this.avaliacaoEstrelas) {
      this.avaliacaoErro = 'Selecione a quantidade de estrelas.';
      return false;
    }
    if (!this.avaliacaoTitulo.trim()) {
      this.avaliacaoErro = 'Digite um título para a avaliação.';
      return false;
    }
    if (!this.avaliacaoTexto.trim()) {
      this.avaliacaoErro = 'Escreva sua avaliação.';
      return false;
    }

    this.avaliacaoErro = '';

    return true;
  }

  setAvaliacaoEstrelas(star: number): void {
    this.avaliacaoEstrelas = star;
    this.avaliacaoErro = '';
  }

  onStarHover(star: number): void {
    this.starHover = star;
  }

  onStarLeave(): void {
    this.starHover = 0;
  }

  getInitials(nome: string): string {
    const n = (nome ?? '').trim();
    if (!n) return '';
    const parts = n.split(/\s+/);
    const first = parts[0]?.[0] ?? '';
    return first.toUpperCase();
  }

  getAvatarColor(nome: string): string {
    return getAvatarColor(nome);
  }
 


}

