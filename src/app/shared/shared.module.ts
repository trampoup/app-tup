import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {KeyToLabelPipe} from './pipes/key-to-label.pipe';
import { ModalWelcomeComponent } from './modal-welcome/modal-welcome.component'; 


@NgModule({
  declarations: [
    KeyToLabelPipe,
    ModalWelcomeComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    KeyToLabelPipe,
    CommonModule
  ]
})
export class SharedModule { }
