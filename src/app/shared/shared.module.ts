import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {KeyToLabelPipe} from './pipes/key-to-label.pipe'; 


@NgModule({
  declarations: [
    KeyToLabelPipe
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
