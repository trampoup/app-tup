import { Pipe, PipeTransform } from '@angular/core';
import { CategoriaKey } from 'src/app/cadastro/categorias-enum';

const CATEGORIA_LABELS: Record<CategoriaKey,string> = {
  SERVICOS_TECNICOS:             'Serviços Técnicos',
  SERVICOS_DOMESTICOS:           'Serviços Domésticos',
  SERVICOS_MANUTENCAO:           'Serviços de Manutenção',
  BELEZA_E_ESTETICA:             'Beleza e Estética',
  SERVICOS_DE_TRANSPORTE:        'Serviços de Transporte',
  EDUCACAO_AULAS_PARTICULARES:   'Educação e Aulas Particulares',
  EVENTOS:                       'Eventos',
  SERVICOS_ADMINISTRATIVOS_E_ONLINE:      'Serviços Administrativos e Online'
};

//pipe para converter a chave da categoria em um rótulo legível
@Pipe({name: 'keyToLabel'})
export class KeyToLabelPipe implements PipeTransform {
  transform(value: CategoriaKey): string {
    return CATEGORIA_LABELS[value] || value;
  }

}
