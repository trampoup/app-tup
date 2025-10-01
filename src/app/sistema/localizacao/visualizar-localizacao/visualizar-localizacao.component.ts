import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { LocalizacaoService } from 'src/app/configs/services/localizacao.service';
import { Localizacao } from '../localizacao';
import { ActivatedRoute } from '@angular/router';
import { MapboxService } from 'src/app/configs/services/mapbox.service';

@Component({
  selector: 'app-visualizar-localizacao',
  templateUrl: './visualizar-localizacao.component.html',
  styleUrls: ['./visualizar-localizacao.component.css']
})
export class VisualizarLocalizacaoComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading: boolean = false;
  localizacaoId: number | string | null = null;
  selectedLocalizacao: Localizacao | null = null;
  mapImageUrl: string | null = null;
  
  // Dimensões dinâmicas do mapa
  mapWidth: number = 800;
  mapHeight: number = 500;

  constructor(
    private localizacaoService: LocalizacaoService,
    private router: ActivatedRoute,
    private mapboxService: MapboxService
  ) { }

  ngOnInit(): void {
    this.carregarLocalizacao();
    this.calculateMapDimensions();
  }

  ngAfterViewInit(): void {
    // Recalcula dimensões após a view ser inicializada
    setTimeout(() => {
      this.calculateMapDimensions();
      if (this.selectedLocalizacao) {
        this.generateStaticMap();
      }
    }, 100);
  }

  @HostListener('window:resize')
  onResize() {
    this.calculateMapDimensions();
    if (this.mapImageUrl && this.selectedLocalizacao) {
      this.generateStaticMap();
    }
  }

  ngOnDestroy(): void {
    // Cleanup se necessário
  }

  private calculateMapDimensions(): void {
    // Calcula dimensões baseadas na janela, mas mantém proporção
    const windowWidth = window.innerWidth;
    
    if (windowWidth < 768) {
      // Mobile
      this.mapWidth = windowWidth - 60;
      this.mapHeight = 300;
    } else if (windowWidth < 1024) {
      // Tablet
      this.mapWidth = 600;
      this.mapHeight = 400;
    } else {
      // Desktop - mapa maior
      this.mapWidth = 800;
      this.mapHeight = 500;
    }
  }

  carregarLocalizacao() {
    this.isLoading = true;
    this.localizacaoId = this.router.snapshot.paramMap.get('id');
    if (!this.localizacaoId) { 
      this.isLoading = false;
      return;
     }

    this.localizacaoService.obterPorId(this.localizacaoId).subscribe({
      next: (localizacao: Localizacao) => {
        this.selectedLocalizacao = localizacao;
        console.log(this.selectedLocalizacao);
        this.isLoading = false;

        // Gera o mapa estático baseado na localização
        this.generateStaticMap();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro ao carregar localizacao:', err);
      }
    });
  }

  private generateStaticMap(): void {
    if (!this.selectedLocalizacao?.estado || !this.selectedLocalizacao?.cidade) {
      // Mapa padrão do Brasil se não tiver estado/cidade
      this.mapImageUrl = this.mapboxService.generateStaticMapUrl(-47.9292, -15.7801, {
        width: this.mapWidth,
        height: this.mapHeight,
        zoom: 4
      });
      return;
    }

    // Gera mapa baseado no estado e cidade com geocoding preciso
    this.isLoading = true;
    this.mapboxService.generateMapFromLocalizacao(
      this.selectedLocalizacao.estado,
      this.selectedLocalizacao.cidade,
      {
        width: this.mapWidth,
        height: this.mapHeight,
        zoom: 12,
        style: 'streets-v11'
      }
    ).subscribe({
      next: (url: string) => {
        this.mapImageUrl = url;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Erro ao gerar mapa:', err);
        // Fallback para coordenadas do estado
        this.mapImageUrl = this.mapboxService.generateStaticMapUrl(
          this.mapboxService.getStateCoordinates(this.selectedLocalizacao!.estado!).lng,
          this.mapboxService.getStateCoordinates(this.selectedLocalizacao!.estado!).lat,
          {
            width: this.mapWidth,
            height: this.mapHeight,
            zoom: 12,
            style: 'streets-v11'
          }
        );
      }
    });
  }

  // Método para recarregar o mapa com estilo diferente
  changeMapStyle(style: string): void {
    if (!this.selectedLocalizacao?.estado || !this.selectedLocalizacao?.cidade) return;

    this.mapboxService.generateMapFromLocalizacao(
      this.selectedLocalizacao.estado,
      this.selectedLocalizacao.cidade,
      {
        width: this.mapWidth,
        height: this.mapHeight,
        zoom: 12,
        style: style
      }
    ).subscribe({
      next: (url: string) => {
        this.mapImageUrl = url;
      },
      error: (err) => {
        console.error('Erro ao mudar estilo do mapa:', err);
      }
    });
  }
}