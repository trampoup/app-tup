import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalWelcomeService } from './configs/services/modal-welcome.service';
import { ModalDeleteService } from './configs/services/modal-delete.service';
import { ModalGenericoService } from './configs/services/modal-generico.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app-trampo';

  @ViewChild('modalDelete', { read: ViewContainerRef, static: true })
  modalDeleteOutlet!: ViewContainerRef;
  @ViewChild('modalWelcome', { read: ViewContainerRef, static: true })
  modalWelcomeOutlet!: ViewContainerRef;
  @ViewChild('modalGenerico', { read: ViewContainerRef, static: true })
  modalGenericoOutlet!: ViewContainerRef;

  constructor(
    private modalWelcomeService:ModalWelcomeService,
    private modalDeleteService: ModalDeleteService,
    private modalGenericoService: ModalGenericoService
  ){}

  ngAfterViewInit(): void {
    this.modalWelcomeService.registerOutlet(this.modalWelcomeOutlet);
    this.modalDeleteService.registerOutlet(this.modalDeleteOutlet);
    this.modalGenericoService.registerOutlet(this.modalGenericoOutlet);
  }
}
