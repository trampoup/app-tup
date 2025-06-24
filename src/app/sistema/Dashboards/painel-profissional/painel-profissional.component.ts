import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/configs/services/auth.service';
import { ServicosService } from 'src/app/configs/services/servicos.service';
import { TipoUsuario } from 'src/app/login/tipo-usuario.enum';
import { Usuario } from 'src/app/login/usuario';

@Component({
  selector: 'app-painel-profissional',
  templateUrl: './painel-profissional.component.html',
  styleUrls: ['./painel-profissional.component.css']
})
export class PainelProfissionalComponent implements OnInit {
  usuario: Usuario | null = null;
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


  historicoServicos = [ //PROVISORIO
    {
      tipo:'Limpeza',
      photo: '/assets/imagens/imagens-de-exemplo/m-userphoto-exemplo.svg',
      nome: 'Maria Silva',
      status: 'Concluido',
      ingressou: new Date('2025-01-15')
    },
    {
      tipo:'Limpeza',
      photo: '/assets/imagens/imagens-de-exemplo/p-userphoto-exemplo.svg',
      nome: 'Pedro Costa',
      status: 'Concluido',
      ingressou: new Date('2025-06-03')
    },
    {
      tipo:'Limpeza',
      photo: '/assets/imagens/imagens-de-exemplo/p-userphoto-exemplo.svg',
      nome: 'Pedro Costa',
      status: 'Concluido',
      ingressou: new Date('2025-06-03')
    },
    {
      tipo:'Limpeza',
      photo: '/assets/imagens/imagens-de-exemplo/j-userphoto-exemplo.svg',
      nome: 'Joana Mendes',
      status: 'Concluido',
      ingressou: new Date('2025-05-28')
    },
    {
      tipo:'Limpeza',
      photo: '/assets/imagens/imagens-de-exemplo/j-userphoto-exemplo.svg',
      nome: 'Joana Mendes',
      status: 'Concluido',
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
      this.renderCharServicosPorMes();

      this.usuario = {
        nome : 'João Silva',
        tipoUsuario:TipoUsuario.PROFISSIONAL
      }


  
      // this.authService.obterPerfilUsuario().subscribe(
      //   (u) => {
      //     this.usuario = u
      //   },
      //   (err) => console.error(err)
      // );
  
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
