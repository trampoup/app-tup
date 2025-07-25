import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalWelcomeService } from './configs/services/modal-welcome.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app-trampo';


  @ViewChild('modalWelcome', { read: ViewContainerRef, static: true })
  modalWelcomeOutlet!: ViewContainerRef;

  constructor(
    private modalWelcomeService:ModalWelcomeService
  ){}

  ngAfterViewInit(): void {
    this.modalWelcomeService.registerOutlet(this.modalWelcomeOutlet);
  }
}
