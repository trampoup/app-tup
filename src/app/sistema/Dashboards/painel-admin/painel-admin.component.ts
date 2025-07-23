import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/configs/services/auth.service';
import { ServicosService } from 'src/app/configs/services/servicos.service';
import * as ApexCharts from 'apexcharts';
import { TipoUsuarioDescricao } from 'src/app/login/tipo-usuario-descricao';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexTitleSubtitle,
  ApexLegend,
} from 'ng-apexcharts';
import { UsuarioPerfil } from '../usuario-perfil';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  legend: ApexLegend;        // <— adicione aqui
};


@Component({
  selector: 'app-painel-admin',
  templateUrl: './painel-admin.component.html',
  styleUrls: ['./painel-admin.component.css']
})
export class PainelAdminComponent implements OnInit {
  usuario: UsuarioPerfil | null = null;
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

  novosUsuarios = [ //PROVISORIO
    {
      photo: '/assets/imagens/imagens-de-exemplo/m-userphoto-exemplo.svg',
      nome: 'Maria Silva',
      cargo: 'Profissional',
      ingressou: new Date('2025-01-15')
    },
    {
      photo: '/assets/imagens/imagens-de-exemplo/p-userphoto-exemplo.svg',
      nome: 'Pedro Costa',
      cargo: 'Cliente',
      ingressou: new Date('2025-06-03')
    },
    {
      photo: '/assets/imagens/imagens-de-exemplo/p-userphoto-exemplo.svg',
      nome: 'Pedro Costa',
      cargo: 'Cliente',
      ingressou: new Date('2025-06-03')
    },
    {
      photo: '/assets/imagens/imagens-de-exemplo/j-userphoto-exemplo.svg',
      nome: 'Joana Mendes',
      cargo: 'Profissional',
      ingressou: new Date('2025-05-28')
    },
    {
      photo: '/assets/imagens/imagens-de-exemplo/j-userphoto-exemplo.svg',
      nome: 'Joana Mendes',
      cargo: 'Profissional',
      ingressou: new Date('2025-06-13')
    }
  ];


  constructor(
    private authService: AuthService,
    private apiService: ServicosService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.renderChartGrafico();
    this.getWeatherForCurrentLocation();
    this.renderCharCrescimentoMensal();

    this.authService.obterPerfilUsuario().subscribe(
      (usuario) => {
        this.usuario = usuario;
      }
    );

    this.updateDateTime();
    setInterval(() => this.updateDateTime(), 60_000);

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

  renderCharCrescimentoMensal() {
    const options = {
      series: [
        { name: 'Parametro', data: [5, 8, 6, 10, 12, 9, 15, 11, 14, 18, 20, 16] },
        { name: 'Parametro', data: [2, 4, 3, 5, 6, 4, 8, 6, 7, 9, 10, 8] }
      ],
      chart: {
        type: 'line',
        height: 350,
        width: '100%',
        toolbar: { show: false }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth' },
      title: { text: 'Crescimento Mensal', align: 'left' },
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
    this.apiService.fetchWeatherForRussas().subscribe((data) => {
      this.weatherData = data;
      console.log(this.weatherData);
      this.updateWeatherInfo();
    });
  }

  getWeatherForCurrentLocation(): void {
    this.apiService.fetchWeatherForCurrentLocation().subscribe(
      (data) => {
        this.weatherData = data;
        console.log(this.weatherData);
        this.updateWeatherInfo();
      },
      (error) => {
        console.error('Error getting location', error);
        this.getWeatherForRussas();
      }
    );
  }

  getWeatherForLocation(lat: number, lon: number): void {
    this.apiService.fetchWeather(lat, lon).subscribe((data) => {
      this.weatherData = data;
      console.log(this.weatherData);
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
