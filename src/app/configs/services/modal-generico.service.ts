import { ComponentRef, Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { ModalGenericoComponent } from 'src/app/shared/modal-generico/modal-generico.component';

@Injectable({
  providedIn: 'root'
})
export class ModalGenericoService {
  private outlet!: ViewContainerRef;
  private modalRef!: ComponentRef<ModalGenericoComponent>;

  registerOutlet(outlet: ViewContainerRef): void {
    this.outlet = outlet;
  }

  openModal(
    config?: Partial<ModalGenericoComponent>,
    onConfirm?: () => boolean | void,
    contentTemplate?: TemplateRef<any>
  ): void {
    if (!this.outlet) throw new Error('Outlet não registrado!');
    this.outlet.clear();

    this.modalRef = this.outlet.createComponent(ModalGenericoComponent);

    if (config) {
      Object.assign(this.modalRef.instance, config);
    }

    if (contentTemplate) {
      this.modalRef.instance.contentTemplate = contentTemplate;
    }

    this.modalRef.instance.closeModal.subscribe(() => {
      this.closeModal();
    });

    this.modalRef.instance.confirm.subscribe(() => {
      const shouldClose = onConfirm ? onConfirm() : true;
      // Só fecha se não for explicitamente false
      if (shouldClose !== false) this.closeModal();
    });
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.destroy();
    }
  }
}
