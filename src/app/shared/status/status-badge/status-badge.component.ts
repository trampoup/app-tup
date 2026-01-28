import { Component, Input, OnInit } from '@angular/core';
import { StatusServico } from 'src/app/sistema/servicos/StatusServico';
import { getStatusLabel, getStatusClass } from '../status-servico.utils';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.css']
})
export class StatusBadgeComponent {
  @Input() status!: StatusServico;

  get label(): string {
    return getStatusLabel(this.status);
  }

  get statusClass(): string {
    return getStatusClass(this.status);
  }
}
