import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-cadastrar-site',
  templateUrl: './cadastrar-site.component.html',
  styleUrls: ['./cadastrar-site.component.css']
})
export class CadastrarSiteComponent implements OnInit {
  submited:boolean = false;
  isEditMode:boolean = false;
  projetoId: number | null = null;
  isLoading:boolean = false;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private formBuilder : FormBuilder
  ) { }

  ngOnInit(): void {
  }

  siteForm = this.formBuilder.group(
    {
      bio: new FormControl('', [Validators.required]),
      skills: new FormControl('', [Validators.required]),
      experiencia:new FormControl('', [Validators.required]),
      
    }
  );

  onSubmit(){

  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const tecla = event.key;
    if (!/[0-9\.]/.test(tecla)) {
      event.preventDefault();
    }
  }

}
