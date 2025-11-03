import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-modal-generico',
  templateUrl: './modal-generico.component.html',
  styleUrls: ['./modal-generico.component.css']
})
export class ModalGenericoComponent implements OnInit {
  @Input() title: string = 'Cadastro';
  @Input() description: string = '';
  @Input() size: string = 'xl:max-w-7xl';
  @Input() confirmTextoBotao: string = 'Salvar';
  @Input() cancelTextoBotao: string = 'Cancelar';
  @Input() contentTemplate?: TemplateRef<any>;

  @Input() showFooter: boolean = true;           
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  
  constructor() {}

  ngOnInit(): void {}

  onModalClose() {
    this.closeModal.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }

}
