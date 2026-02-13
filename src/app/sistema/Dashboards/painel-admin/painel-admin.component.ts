import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/configs/services/auth.service';
import * as ApexCharts from 'apexcharts';
import { TipoUsuarioDescricao } from 'src/app/login/tipo-usuario-descricao';
import { ClimaService } from 'src/app/configs/services/clima.service';
import { listaEstados } from 'src/app/configs/services/cidade.service';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexTitleSubtitle,
  ApexLegend,
} from 'ng-apexcharts';
import { ModalWelcomeService } from 'src/app/configs/services/modal-welcome.service';
import { UsuarioDadosDTO } from '../../cupons/UsuarioDadosDTO';
import { UsuarioService } from 'src/app/configs/services/usuario.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  legend: ApexLegend;        
};

export interface AdminNovoUsuarioDTO {
  id: number;
  nome: string;
  tipoUsuario: 'ADMIN' | 'PROFISSIONAL' | 'CLIENTE';
  createdAt: any;
}

export interface AdminCrescimentoMensalDTO {
  ano: number;
  quantidadePorMes: number[]; 
}

export interface AdminUsuariosPorEstadoDTO {
  estados: string[];
  quantidades: number[];
}


@Component({
  selector: 'app-painel-admin',
  templateUrl: './painel-admin.component.html',
  styleUrls: ['./painel-admin.component.css']
})
export class PainelAdminComponent implements OnInit {
  usuario: UsuarioDadosDTO | null = null;
  weatherDescription: string = 'Carregando...'; //nublado, etc..
  temperature: number = 0; //temperatura
  iconUrl: string = ''; //imagem de acordo com o clima.
  windSpeed: number = 0; //velocidade do vento
  weatherData: any = {}; //.name é a cidade
  currentTime: string = '';
  currentDate: string = '';
  quantidadeTotalServicos: number = 120;
  quantidadeProfissionaisAtivos: number = 80;
  quantidadeServicos: number = 61;

  tipoUsuarioDescricao = TipoUsuarioDescricao;

  novosUsuarios: any[] = [];
  placeholderFoto = '/assets/imagens/foto-perfil-generico.png';
  private chartUsuariosPorEstado: any;

  constructor(
    private authService: AuthService,
    private climaService: ClimaService,
    private modalWelcomeService: ModalWelcomeService,
    private cdr: ChangeDetectorRef,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.carregarNovosUsuarios()
    // this.renderChartGrafico();
    this.renderChartUsuariosPorEstado();
    this.getWeatherForCurrentLocation();
    this.renderCharCrescimentoMensal();

    this.authService.obterPerfilUsuario().subscribe(
      (usuario) => {
        this.usuario = usuario;
      }
    );

    this.usuarioService.obterCardsInicioAdmin().subscribe({
      next: (cards) => {
        this.quantidadeTotalServicos = cards.quantidadeTotalServicos;
        this.quantidadeProfissionaisAtivos = cards.quantidadeProfissionaisAtivos;
        this.quantidadeServicos = cards.quantidadeServicos; 
      },
      error: (err) => console.error('Erro ao carregar cards do admin', err)
    });

    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 60_000);
    
    this.mostrarModalWelcome();
  }


  private cargoPorTipo(tipo: string) {
    if (tipo === 'PROFISSIONAL') return 'Profissional';
    if (tipo === 'CLIENTE') return 'Cliente';
    if (tipo === 'ADMIN') return 'Admin';
    return 'Usuário';
  }

  carregarNovosUsuarios() {
    this.usuarioService.obterNovosUsuariosAdmin().subscribe((lista) => {
      const parsed = (lista || []).map(u => ({
        photo: this.placeholderFoto,
        nome: u.nome,
        cargo: this.cargoPorTipo(u.tipoUsuario),
        ingressou: this.parseCreatedAt(u.createdAt)
      }));

      this.novosUsuarios = parsed;
    });
  }

  private parseCreatedAt(value: any): Date | null {
    if (value == null) return null;

    // ISO string
    if (typeof value === 'string') {
      const d = new Date(value);
      return isNaN(d.getTime()) ? null : d;
    }

    // number: pode ser segundos ou ms
    if (typeof value === 'number') {
      const ms = value < 1e12 ? value * 1000 : value;
      const d = new Date(ms);
      return isNaN(d.getTime()) ? null : d;
    }

    // array [yyyy,MM,dd,HH,mm,ss,nano]
    if (Array.isArray(value)) {
      const [y, m, d, hh = 0, mm = 0, ss = 0, nano = 0] = value;
      const ms = Math.floor(nano / 1e6);
      return new Date(Date.UTC(y, (m - 1), d, hh, mm, ss, ms));
    }

    return null;
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

  private estadoNomePorSigla = new Map(
    listaEstados.map(e => [e.sigla.toUpperCase(), e.nome])
  );

  private estadoLabel(raw: string): string {
    const v = (raw || '').trim();
    if (!v) return '—';

    const upper = v.toUpperCase();
    if (upper.length <= 2 && this.estadoNomePorSigla.has(upper)) {
      return this.estadoNomePorSigla.get(upper)!;
    }

    return v;
  }


  private renderChartUsuariosPorEstado(): void {
    this.usuarioService.obterUsuariosPorEstadoAdmin().subscribe({
      next: (res) => {
        const labelsRaw = (res?.estados || []).map(e => this.estadoLabel(e));
        const seriesRaw = (res?.quantidades || []).map(n => Number(n || 0));

        // opcional: top 8 + "Outros" (pra não lotar o donut)
        const max = 8;
        let labels = labelsRaw;
        let series = seriesRaw;

        if (labelsRaw.length > max) {
          const topLabels = labelsRaw.slice(0, max);
          const topSeries = seriesRaw.slice(0, max);
          const outros = seriesRaw.slice(max).reduce((a, b) => a + b, 0);

          labels = outros > 0 ? [...topLabels, 'Outros'] : topLabels;
          series = outros > 0 ? [...topSeries, outros] : topSeries;
        }

        if (this.chartUsuariosPorEstado) {
          this.chartUsuariosPorEstado.destroy();
        }

        const options: any = {
          chart: {
            type: 'donut',
            height: 350,
            width: '100%',
          },
          title: {
            text: 'Usuários por Estado',
            align: 'left',
          },
          series: series.length ? series : [1],
          labels: labels.length ? labels : ['Sem dados'],
          theme: { palette: 'palette8' },
          legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
          },
          responsive: [
            {
              breakpoint: 980,
              options: {
                chart: { width: 250 },
                legend: { position: 'bottom' },
              },
            },
          ],
        };

        this.chartUsuariosPorEstado = new ApexCharts(
          document.querySelector('#chart-grafico'),
          options
        );
        this.chartUsuariosPorEstado.render();
      },
      error: (err) => console.error('Erro ao carregar usuários por estado', err)
    });
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
      series: [33, 22, 18, 10, 17],           
      labels: ['Item', 'Item', 'Item', 'Item', 'Item'],
      theme: {
        palette: 'palette8',
      },
      legend: {
        show: true,
        position: 'bottom',          
        horizontalAlign: 'center',  
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

  renderCharCrescimentoMensal() {
    this.usuarioService.obterCrescimentoMensalUsuarios().subscribe((res) => {
      const options = {
        series: [
          { name: 'Usuários', data: res.quantidadePorMes }
        ],
        chart: {
          type: 'line',
          height: 350,
          width: '100%',
          toolbar: { show: false }
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
        title: { text: `Crescimento Mensal (${res.ano})`, align: 'left' },
        xaxis: {
          categories: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
        },
        legend: { show: false }
      };

      const chart = new ApexCharts(
        document.querySelector('#chart-crescimento-mensal'),
        options
      );
      chart.render();
    });
  }



  private updateDateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });


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

}
