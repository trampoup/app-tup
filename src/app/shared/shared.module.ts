import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {KeyToLabelPipe} from './pipes/key-to-label.pipe';
import { ModalWelcomeComponent } from './modal-welcome/modal-welcome.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ModalDeleteComponent } from './modal-delete/modal-delete.component';
import { InputImgComponent } from './input-img/input-img.component';
import { InputVideoComponent } from './input-video/input-video.component'; 


@NgModule({
  declarations: [
    KeyToLabelPipe,
    ModalWelcomeComponent,
    PaginationComponent,
    ModalDeleteComponent,
    InputImgComponent,
    InputVideoComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    KeyToLabelPipe,
    CommonModule,
    PaginationComponent,
    InputImgComponent,
    InputVideoComponent
  ]
})
export class SharedModule { }
