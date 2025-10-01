import { Injectable } from '@angular/core';

export interface MapboxStaticOptions {
  width: number;
  height: number;
  zoom?: number;
  bearing?: number;
  pitch?: number;
  style?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapboxService {

  private readonly BASE_URL = 'https://api.mapbox.com/styles/v1/mapbox';
  
  // Estilos disponíveis sem necessidade de API key (para uso básico)
  private readonly STYLES = {
    streets: 'streets-v11',
    outdoors: 'outdoors-v11',
    light: 'light-v10',
    dark: 'dark-v10',
    satellite: 'satellite-v9'
  };

  generateStaticMapUrl(lng: number, lat: number, options: MapboxStaticOptions = {
    width: 600,
    height: 400,
    zoom: 10
  }): string {
    const style = options.style || 'streets-v11';
    const { width, height, zoom = 10, bearing = 0, pitch = 0 } = options;
    
    // Para uso sem API key, vamos usar um template público
    // Nota: Para produção, é recomendado obter uma API key gratuita do Mapbox
    return `https://api.mapbox.com/styles/v1/mapbox/${style}/static/${lng},${lat},${zoom},${bearing},${pitch}/${width}x${height}?access_token=pk.eyJ1IjoiZGllZ29yaWJlaXJvIiwiYSI6ImNtZzdhZzFyYzBlajUyaXB1a3E2cnljeW8ifQ.BOh8NjGSiy0RsjMC27s4Nw`;
  }

  // Método para obter coordenadas aproximadas baseado em estado e cidade
  getCoordinatesForLocation(estado: string, cidade: string): { lng: number; lat: number } {
    // Coordenadas aproximadas das capitais brasileiras
    const coordinatesMap: { [key: string]: { lng: number; lat: number } } = {
      // Região Norte
      'AM': { lng: -60.0217, lat: -3.1190 }, // Manaus
      'PA': { lng: -48.5042, lat: -1.4558 }, // Belém
      'AC': { lng: -67.8100, lat: -9.9747 }, // Rio Branco
      
      // Região Nordeste
      'CE': { lng: -38.5247, lat: -3.7172 }, // Fortaleza
      'PE': { lng: -34.8811, lat: -8.0539 }, // Recife
      'BA': { lng: -38.5108, lat: -12.9711 }, // Salvador
      
      // Região Centro-Oeste
      'DF': { lng: -47.9292, lat: -15.7801 }, // Brasília
      'GO': { lng: -49.2539, lat: -16.6799 }, // Goiânia
      'MT': { lng: -56.0969, lat: -15.6010 }, // Cuiabá
      
      // Região Sudeste
      'SP': { lng: -46.6333, lat: -23.5505 }, // São Paulo
      'RJ': { lng: -43.1729, lat: -22.9068 }, // Rio de Janeiro
      'MG': { lng: -43.9378, lat: -19.9208 }, // Belo Horizonte
      'ES': { lng: -40.3080, lat: -20.3155 }, // Vitória
      
      // Região Sul
      'RS': { lng: -51.2300, lat: -30.0331 }, // Porto Alegre
      'SC': { lng: -48.5492, lat: -27.5969 }, // Florianópolis
      'PR': { lng: -49.2733, lat: -25.4284 }  // Curitiba
    };

    // Retorna coordenadas do estado ou coordenadas padrão do Brasil
    return coordinatesMap[estado.toUpperCase()] || { lng: -47.9292, lat: -15.7801 }; // Brasília como padrão
  }

  // Método auxiliar para gerar mapa baseado na localização
  generateMapFromLocalizacao(estado: string, cidade: string, options?: MapboxStaticOptions): string {
    const coords = this.getCoordinatesForLocation(estado, cidade);
    return this.generateStaticMapUrl(coords.lng, coords.lat, options);
  }
}