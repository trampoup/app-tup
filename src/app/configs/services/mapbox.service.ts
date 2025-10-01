import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

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
  

  constructor(private http: HttpClient) { }

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
    zoom: 8
  }): string {
    const style = options.style || 'streets-v11';
    const { width, height, zoom = 8, bearing = 0, pitch = 0 } = options;
    
    // Para uso sem API key, vamos usar um template público
    // Nota: Para produção, é recomendado obter uma API key gratuita do Mapbox
    return `https://api.mapbox.com/styles/v1/mapbox/${style}/static/${lng},${lat},${zoom},${bearing},${pitch}/${width}x${height}?access_token=pk.eyJ1IjoiZGllZ29yaWJlaXJvIiwiYSI6ImNtZzdhZzFyYzBlajUyaXB1a3E2cnljeW8ifQ.BOh8NjGSiy0RsjMC27s4Nw`;
  }



    // Fallback para coordenadas do estado
   getStateCoordinates(estado: string): { lng: number; lat: number } {
    const coordinatesMap: { [key: string]: { lng: number; lat: number } } = {
      // Região Norte
      'AC': { lng: -67.8100, lat: -9.9747 }, // Rio Branco
      'AP': { lng: -51.0667, lat: 0.0344 },  // Macapá
      'AM': { lng: -60.0217, lat: -3.1190 }, // Manaus
      'PA': { lng: -48.5042, lat: -1.4558 }, // Belém
      'RO': { lng: -63.8349, lat: -8.7612 }, // Porto Velho
      'RR': { lng: -61.2552, lat: 2.8193 },  // Boa Vista
      'TO': { lng: -48.3315, lat: -10.2491 }, // Palmas
      
      // Região Nordeste
      'AL': { lng: -35.7353, lat: -9.6658 }, // Maceió
      'BA': { lng: -38.5108, lat: -12.9711 }, // Salvador
      'CE': { lng: -38.5247, lat: -3.7172 }, // Fortaleza
      'MA': { lng: -44.3026, lat: -2.5307 }, // São Luís
      'PB': { lng: -34.8631, lat: -7.1195 }, // João Pessoa
      'PE': { lng: -34.8811, lat: -8.0539 }, // Recife
      'PI': { lng: -42.8039, lat: -5.0892 }, // Teresina
      'RN': { lng: -35.2094, lat: -5.7945 }, // Natal
      'SE': { lng: -37.0717, lat: -10.9472 }, // Aracaju
      
      // Região Centro-Oeste
      'DF': { lng: -47.9292, lat: -15.7801 }, // Brasília
      'GO': { lng: -49.2539, lat: -16.6799 }, // Goiânia
      'MT': { lng: -56.0969, lat: -15.6010 }, // Cuiabá
      'MS': { lng: -54.6463, lat: -20.4428 }, // Campo Grande
      
      // Região Sudeste
      'ES': { lng: -40.3080, lat: -20.3155 }, // Vitória
      'MG': { lng: -43.9378, lat: -19.9208 }, // Belo Horizonte
      'RJ': { lng: -43.1729, lat: -22.9068 }, // Rio de Janeiro
      'SP': { lng: -46.6333, lat: -23.5505 }, // São Paulo
      
      // Região Sul
      'PR': { lng: -49.2733, lat: -25.4284 }, // Curitiba
      'RS': { lng: -51.2300, lat: -30.0331 }, // Porto Alegre
      'SC': { lng: -48.5492, lat: -27.5969 }  // Florianópolis
    };

    return coordinatesMap[estado.toUpperCase()] || { lng: -47.9292, lat: -15.7801 }; // Brasília como padrão
  }

    // Método melhorado para obter coordenadas usando Nominatim (OpenStreetMap)
  getCoordinatesForCity(cidade: string, estado: string): Observable<{ lng: number; lat: number }> {
    const query = `${cidade}, ${estado}, Brasil`;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    
    return this.http.get<any[]>(url).pipe(
      map(results => {
        if (results && results.length > 0) {
          return {
            lng: parseFloat(results[0].lon),
            lat: parseFloat(results[0].lat)
          };
        } else {
          // Fallback para coordenadas do estado se a cidade não for encontrada
          return this.getStateCoordinates(estado);
        }
      }),
      catchError(() => {
        // Em caso de erro, retorna coordenadas do estado
        return [this.getStateCoordinates(estado)];
      })
    );
  }

  // Método auxiliar para gerar mapa baseado na localização
  generateMapFromLocalizacao(estado: string, cidade: string, options?: MapboxStaticOptions): Observable<string> {
    return this.getCoordinatesForCity(cidade, estado).pipe(
      map(coords => {
        return this.generateStaticMapUrl(coords.lng, coords.lat, options);
      })
    );
  }
}