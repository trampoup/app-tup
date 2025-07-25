import { ComponentRef, Injectable, ViewContainerRef } from '@angular/core';
import { ModalWelcomeComponent } from 'src/app/shared/modal-welcome/modal-welcome.component';

@Injectable({
  providedIn: 'root'
})
export class ModalWelcomeService {
  private outlet!: ViewContainerRef;
  private modalRef!: ComponentRef<ModalWelcomeComponent>;
  
  registerOutlet(outlet: ViewContainerRef): void {
    this.outlet = outlet;
  }
  openModal(
    config?: Partial<ModalWelcomeComponent>,
    onWelcome?: () => void
  ): void {
    if (!this.outlet) throw new Error('Outlet não registrado!');
    this.outlet.clear();

    this.modalRef = this.outlet.createComponent(ModalWelcomeComponent);

    if (config) {
      Object.assign(this.modalRef.instance, config);
    }

    this.modalRef.instance.closeModal.subscribe(() => {
      this.closeModal();
    });

  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.destroy();
    }
  }
}
