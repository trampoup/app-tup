import { Component, OnInit } from '@angular/core';
import { LocalizacaoService } from 'src/app/configs/services/localizacao.service';
import { Localizacao } from '../localizacao';
import { ActivatedRoute } from '@angular/router';
import { MapboxService } from 'src/app/configs/services/mapbox.service';

@Component({
  selector: 'app-visualizar-localizacao',
  templateUrl: './visualizar-localizacao.component.html',
  styleUrls: ['./visualizar-localizacao.component.css']
})
export class VisualizarLocalizacaoComponent implements OnInit {
  isLoading: boolean = false;
  localizacaoId: number | string | null = null;

  selectedLocalizacao: Localizacao | null = null;

  mapImageUrl: string | null = null;


  constructor(
    private localizacaoService: LocalizacaoService,
    private router: ActivatedRoute,
    private mapboxService: MapboxService
  ) { }

  ngOnInit(): void {
    this.carregarLocalizacao();
  }

  carregarLocalizacao(){
    this.localizacaoId = this.router.snapshot.paramMap.get('id');
    if (!this.localizacaoId) { return; }
    this.isLoading = true;

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
        width: 600,
        height: 400,
        zoom: 4
      });
      return;
    }

    // Gera mapa baseado no estado e cidade
    this.mapImageUrl = this.mapboxService.generateMapFromLocalizacao(
      this.selectedLocalizacao.estado,
      this.selectedLocalizacao.cidade,
      {
        width: 600,
        height: 400,
        zoom: 10,
        style: 'streets-v11'
      }
    );
  }

  // Método para recarregar o mapa com estilo diferente (opcional)
  changeMapStyle(style: string): void {
    if (!this.selectedLocalizacao?.estado || !this.selectedLocalizacao?.cidade) return;

    this.mapImageUrl = this.mapboxService.generateMapFromLocalizacao(
      this.selectedLocalizacao.estado,
      this.selectedLocalizacao.cidade,
      {
        width: 600,
        height: 400,
        zoom: 10,
        style: style
      }
    );
  }


}
