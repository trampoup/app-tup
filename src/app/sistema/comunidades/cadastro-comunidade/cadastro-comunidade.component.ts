import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CategoriaKey, CATEGORIAS } from 'src/app/cadastro/categorias-enum';

@Component({
  selector: 'app-cadastro-comunidade',
  templateUrl: './cadastro-comunidade.component.html',
  styleUrls: ['./cadastro-comunidade.component.css']
})
export class CadastroComunidadeComponent implements OnInit {
  submited:boolean = false;
  isLoading:boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isEditMode:boolean = false;
  comunidadeId: number | null = null;

  selectedImages: { [key: string]: File | null } = {};

  banner: File | null = null;
  selectedBanner: { [key: string]: File | null } = {};
  bannerPreview: string | ArrayBuffer | null = null;

  categoriasKeys: CategoriaKey[] = Object.keys(CATEGORIAS) as CategoriaKey[];
  

  constructor() { }

  ngOnInit(): void {
  }

  comunidadeForm = new FormGroup({
    nome: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)] }),
    setor: new FormControl<CategoriaKey | null>(null, { validators: [Validators.required] }),
    descricao: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10), Validators.maxLength(500)] }),
    banner: new FormControl<File | null>(null)
  });

  onImageSelected(image: File | null, tipo: string) {
    this.selectedImages[tipo] = image;
    this.comunidadeForm.get(tipo)?.setValue(image);
    console.log(`Imagem de ${tipo} selecionada:`, image);
  }

  onSubmit() {
    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;
    this.submited = true;

    if (this.comunidadeForm.invalid) {
      this.isLoading = false;
      return;
    }
  }

}
