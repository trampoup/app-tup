import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormControlDirective, FormsModule, Validators } from '@angular/forms';
import { CuponsService } from 'src/app/configs/services/cupons.service';
import { Cupom } from '../cupom';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-cadastro-cupons',
  templateUrl: './cadastro-cupons.component.html',
  styleUrls: ['./cadastro-cupons.component.css']
})
export class CadastroCuponsComponent implements OnInit {
  cupomId:string | null = null;
  isLoading : boolean = false;
  successMessage:string | null = null;
  errorMessage:string | null = null;
  isEditMode = false;
  submited : boolean = false;

  constructor(
    private cuponsService:CuponsService,
    private form:FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.verificarModoEdicao();
  }

  verificarModoEdicao(): void{
    this.cupomId = this.route.snapshot.paramMap.get('id');
    if (!this.cupomId) { return; }
    this.isEditMode = true;

    this.cuponsService.obterCupomPorId(this.cupomId).subscribe({
      next: (cupom: Cupom) => {
        this.cupomForm.patchValue({
          titulo: cupom.titulo,
          qtdCupom: cupom.qtdCupom ?? null,
          valor: cupom.valor ?? null,
          descricao: cupom.descricao,
          dataDeInicio: cupom.dataDeInicio,
          dataDeTermino: cupom.dataDeTermino
        });
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'Erro ao carregar cupom';
      }
    });
  }


  allowOnlyNumbers(event: KeyboardEvent) {
    const tecla = event.key;
    if (!/[0-9\.]/.test(tecla)) {
      event.preventDefault();
    }
  }


  cupomForm = this.form.group({
    titulo: new FormControl<string>('', {validators : [Validators.required]}),
    qtdCupom: new FormControl<number | null>(null, {validators:[Validators.required, Validators.min(0)]}),
    valor: new FormControl<number | null>(null, {validators:[Validators.required, Validators.min(0)]}),
    descricao: new FormControl('', {validators:[Validators.required]}),
    dataDeInicio: new FormControl('', {validators:[Validators.required]}),
    dataDeTermino: new FormControl('', {validators:[Validators.required]})
  })

  onSubmit():void{
    this.submited = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.isLoading = true;

    if (this.cupomForm.invalid) {
      this.cupomForm.markAllAsTouched();
      this.isLoading = false;
      this.errorMessage = "Preencha os dados corretamente!"
      return;
    }

    const cupom: Cupom = {
      titulo:       this.cupomForm.value.titulo!,
      qtdCupom:     this.cupomForm.value.qtdCupom!,
      valor:        this.cupomForm.value.valor!,
      descricao:    this.cupomForm.value.descricao!,
      dataDeInicio: this.cupomForm.value.dataDeInicio!,
      dataDeTermino:this.cupomForm.value.dataDeTermino!,
    };

    const request$ = this.isEditMode && this.cupomId
    ? this.cuponsService.atualizarCupom(this.cupomId,cupom)
    : this.cuponsService.cadastrarCupom(cupom);

    request$.subscribe({
      next:() =>{
        this.submited = false;
        this.isLoading = false;
        this.successMessage = this.isEditMode && this.cupomId ? "Cupom atualizado com sucesso!" : "Cupom cadastrado com sucesso!"
        this.errorMessage = null;
        this.cupomForm.reset();
      },
      error: err =>{
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Erro ao salvar cupom';
        this.successMessage = null;
      }
    })
  }

}
