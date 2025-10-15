import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Setor, CATEGORIAS } from 'src/app/cadastro/categorias-enum';
import { ComunidadeCadastroDTO } from '../ComunidadeCadastroDTO';
import { ComunidadeService } from 'src/app/configs/services/comunidade.service';

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

  categoriasKeys: Setor[] = Object.keys(CATEGORIAS) as Setor[];
  

  constructor(
    private comunidadeService:ComunidadeService
  ) { }

  ngOnInit(): void {
  }

  comunidadeForm = new FormGroup({
    nome: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)] }),
    setor: new FormControl<Setor | ''>('', { validators: [Validators.required] }),
    descricao: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10), Validators.maxLength(250)] }),
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
      this.comunidadeForm.markAllAsTouched();          // força exibir erros nos campos
      this.errorMessage = 'Por favor, preencha os dados corretamente.';
      return;
    }

    const comunidade:ComunidadeCadastroDTO = {
      nome: this.comunidadeForm.value.nome!,
      setor: this.comunidadeForm.value.setor!,
      descricao: this.comunidadeForm.value.descricao!,
    };

    const formData = new FormData();
    formData.append(
      'comunidade',
      new Blob([JSON.stringify(comunidade)], { type: 'application/json' })
    );

    // arquivo no campo "banner"
    const bannerFile = this.comunidadeForm.value.banner;
    if (bannerFile) {
      formData.append('banner', bannerFile);
    }
    
    console.log('Comunidade a ser enviada:', comunidade);

    this.comunidadeService.cadastrarComunidade(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Comunidade cadastrada com sucesso!';
        this.comunidadeForm.reset(
          {
            nome: '',
            setor: '',  
            descricao: '',
            banner: null
          }
        );
        this.submited = false;
        this.selectedImages = {};
        this.bannerPreview = null;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'Erro ao cadastrar comunidade. Tente novamente mais tarde.';
        console.error('Erro ao cadastrar comunidade:', error);
      }
    });

  }

}
