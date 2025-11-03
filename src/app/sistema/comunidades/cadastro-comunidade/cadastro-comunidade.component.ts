import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Setor, CATEGORIAS } from 'src/app/cadastro/categorias-enum';
import { ComunidadeCadastroDTO } from '../ComunidadeCadastroDTO';
import { ComunidadeService } from 'src/app/configs/services/comunidade.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  removeBanner:boolean = false;

  selectedImages: { [key: string]: File | null } = {};

  banner: File | null = null;
  selectedBanner: { [key: string]: File | null } = {};
  bannerPreview: string | ArrayBuffer | null = null;

  categoriasKeys: Setor[] = Object.keys(CATEGORIAS) as Setor[];
  

  constructor(
    private comunidadeService:ComunidadeService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.comunidadeId = Number(idParam);
      this.carregarDadosEdicao(this.comunidadeId);
    }
  }

  
  
  comunidadeForm = new FormGroup({
    nome: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)] }),
    setor: new FormControl<Setor | ''>('', { validators: [Validators.required] }),
    descricao: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10), Validators.maxLength(250)] }),
    banner: new FormControl<File | null>(null)
  });


  private carregarDadosEdicao(id: number) {
    this.isLoading = true;
    this.comunidadeService.obterComunidadePorIdComBanner(id).subscribe({
      next: (c) => {
        // Preenche o form com os valores atuais
        this.comunidadeForm.patchValue({
          nome: c.nome,
          setor: c.setor,
          descricao: c.descricao,
          banner: null // importantíssimo: evita sobrescrever se usuário não trocar
        });

        // Mostra preview do banner atual (se existir)
        this.bannerPreview = c.bannerUrl || null;

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar comunidade para edição:', err);
        this.errorMessage = 'Não foi possível carregar a comunidade.';
        this.isLoading = false;
      }
    });
  }

  onFileRemoved() {
    this.comunidadeForm.get('banner')?.setValue(null);
    this.selectedImages['banner'] = null;
    this.bannerPreview = null;

    // Se estiver editando e o usuário removeu, sinaliza para o backend apagar
    if (this.isEditMode) {
      this.removeBanner = true;
    }
  }


  onImageSelected(image: File | null, tipo: string) {
    this.selectedImages[tipo] = image;
    this.comunidadeForm.get(tipo)?.setValue(image);
        // Atualiza preview ao trocar o arquivo
    if (image) {
      const reader = new FileReader();
      reader.onload = () => (this.bannerPreview = reader.result);
      reader.readAsDataURL(image);
      this.removeBanner = false;
    }
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

    const request$ = this.isEditMode && this.comunidadeId
      ? this.comunidadeService.editarComunidade(this.comunidadeId, formData, this.removeBanner)
      : this.comunidadeService.cadastrarComunidade(formData);

    request$.subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = this.isEditMode ? 'Comunidade atualizada com sucesso!' : 'Comunidade cadastrada com sucesso!';

        if (!this.isEditMode) {
          this.comunidadeForm.reset({ nome: '', setor: '', descricao: '', banner: null });
          this.submited = false;
          this.selectedImages = {};
          this.bannerPreview = null;
        } else {
          // Atualiza preview e campos com a resposta (caso backend retorne DTO atualizado)
          if ((response as any)?.temBanner && !(bannerFile || this.removeBanner)) {
            // Manteve o banner antigo — deixa a preview como está
          } else if (bannerFile) {
            // Já está atualizado no preview via FileReader
          } else if (this.removeBanner) {
            this.bannerPreview = null;
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'Erro ao cadastrar comunidade. Tente novamente mais tarde.';
        console.error('Erro ao cadastrar comunidade:', error);
      }
    });

  }

}
