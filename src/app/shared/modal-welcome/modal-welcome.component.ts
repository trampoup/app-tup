import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal-welcome',
  templateUrl: './modal-welcome.component.html',
  styleUrls: ['./modal-welcome.component.css']
})
export class ModalWelcomeComponent{
  @Input() title: string = '👋 Bem-vindo!';
  @Input() item: any;
  @Input() deletarTextoBotao: string = 'Comece a usar';
  @Input() size: string = 'xl:max-w-7xl';

  @Output() closeModal = new EventEmitter<void>();

  onModalClose() {
    this.closeModal.emit();
  }

}
