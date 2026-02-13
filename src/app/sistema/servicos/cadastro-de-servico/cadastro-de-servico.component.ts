import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CATEGORIAS, Setor } from 'src/app/cadastro/categorias-enum';
import { ServicosService } from 'src/app/configs/services/servicos.service';
import { Servico } from '../Servico';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-cadastro-de-servico',
  templateUrl: './cadastro-de-servico.component.html',
  styleUrls: ['./cadastro-de-servico.component.css']
})
export class CadastroDeServicoComponent implements OnInit {
  submited:boolean = false;
  isLoading:boolean = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  isEditMode:boolean = false;
  servicoId: number | string | null = null;

  selectedImages: { [key: string]: File | null } = {};

  banner: File | null = null;
  selectedBanner: { [key: string]: File | null } = {};
  bannerPreview: string | ArrayBuffer | null = null;

  categoriasKeys: Setor[] = Object.keys(CATEGORIAS) as Setor[];
  
  constructor(
    private servicoService:ServicosService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.verificarModoEdicao();
  }

  verificarModoEdicao(): void{
    this.servicoId = this.route.snapshot.paramMap.get('id');
    if (!this.servicoId) { return; }
    this.isEditMode = true;

    this.servicoService.obterPorId(this.servicoId).subscribe({
      next: (servico: Servico) => {
        this.servicoForm.patchValue({
          nome: servico.nome,
          valor: servico.valor ?? null,
          descricao: servico.descricao ?? '',

        });

        this.bannerPreview = servico.bannerUrl ?? null;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Erro ao carregar cupom';
      }
    });
  }
  servicoForm = new FormGroup({
    nome: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)] }),
    descricao: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(250)] }),
    valor: new FormControl<number|null>(null),
    banner: new FormControl<File | null>(null)
  });

  allowOnlyNumbers(event: KeyboardEvent) {
    const tecla = event.key;
    if (!/[0-9\.]/.test(tecla)) {
      event.preventDefault();
    }
  }

  onImageSelected(image: File | null, tipo: string) {
    this.selectedImages[tipo] = image;
    this.servicoForm.get(tipo)?.setValue(image);
  }

  onSubmit(){
    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;
    this.submited = true;

    if (this.servicoForm.invalid) {
      this.isLoading = false;
      this.servicoForm.markAllAsTouched();          // força exibir erros nos campos
      this.errorMessage = 'Por favor, preencha os dados corretamente.';
      return;
    }

    const servico: Servico = {
      id: Number(this.servicoId!),
      nome: this.servicoForm.value.nome!,
      descricao: this.servicoForm.value.descricao!,
      valor: this.servicoForm.value.valor!,
    }
    const banner = this.selectedImages['banner'] ?? null;
    const request$ = this.isEditMode && this.servicoId
    ? this.servicoService.atualizar(servico, banner)
    : this.servicoService.cadastrar(servico, banner);

    request$.subscribe({
      next:() =>{
        this.isLoading = false;
        this.submited = false;
        this.successMessage = this.isEditMode && this.servicoId ? "Serviço atualizado com sucesso!" : "Serviço cadastrado com sucesso!"
        this.errorMessage = null;
        this.servicoForm.reset();
        this.selectedImages = {};
        this.selectedBanner = {};
        this.banner = null;
        this.bannerPreview = null;
      },
      error: err =>{
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Erro ao salvar serviço';
        this.successMessage = null;
      }
    })
  }
}
