import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalWelcomeService } from './configs/services/modal-welcome.service';
import { ModalDeleteService } from './configs/services/modal-delete.service';

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

  constructor(
    private modalWelcomeService:ModalWelcomeService,
    private modalDeleteService: ModalDeleteService
  ){}

  ngAfterViewInit(): void {
    this.modalWelcomeService.registerOutlet(this.modalWelcomeOutlet);
    this.modalDeleteService.registerOutlet(this.modalDeleteOutlet);
  }
}
