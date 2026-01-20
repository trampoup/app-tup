import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CidadesService, listaEstados } from 'src/app/configs/services/cidade.service';
import { TipoComplemento } from './TipoComplemento.enum';
import { Localizacao } from '../localizacao';
import { LocalizacaoService } from 'src/app/configs/services/localizacao.service';
import { TipoComplementoDescricoes } from './TipoComplementoDescricoes';

@Component({
  selector: 'app-cadastrar-localizacao',
  templateUrl: './cadastrar-localizacao.component.html',
  styleUrls: ['./cadastrar-localizacao.component.css']
})
export class CadastrarLocalizacaoComponent implements OnInit {
  localizacaoId:string | null = null;

  isLoading : boolean = false;
  successMessage:string | null = null;
  errorMessage:string | null = null;
  isEditMode = false;
  submited : boolean = false;

  listaCidades: any[] = [];
  protected readonly listaEstados = listaEstados;

  tipoComplemento : TipoComplemento[] = Object.values(TipoComplemento);
  protected readonly TipoComplemento = TipoComplemento;
  protected readonly TipoComplementoDescricoes = TipoComplementoDescricoes


  constructor(
    private form:FormBuilder,
    private route: ActivatedRoute,
    private localizacaoService: LocalizacaoService,
    private cidadesService: CidadesService
  ) { }

  ngOnInit(): void {
    this.verificarModoEdição();
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const tecla = event.key;
    if (!/[0-9\.]/.test(tecla)) {
      event.preventDefault();
    }
  }


  onEstadoChange(event: Event) {
    const estadoSigla = (event.target as HTMLSelectElement).value;
    this.obterCidadePorEstado(estadoSigla);
  }

  obterCidadePorEstado(estadoSigla: string) {
    if (estadoSigla) {
      this.cidadesService.getCidadesByEstado(estadoSigla)
        .subscribe(data => this.listaCidades = data);
    } else {
      this.listaCidades = [];
    }
  }

  verificarModoEdição() {
    this.localizacaoId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.localizacaoId;
    if(this.isEditMode){
      this.localizacaoService.obterPorId(this.localizacaoId!).subscribe({
        next: (localizacao: Localizacao) => {
          this.localizacaoForm.patchValue({
            estado: localizacao.estado,
            cidade: localizacao.cidade,
            bairro: localizacao.bairro,
            rua: localizacao.rua,
            numero: localizacao.numero,
            complemento: localizacao.complemento,
            cep: localizacao.cep
          });
          this.obterCidadePorEstado(localizacao.estado!);
        },
        error: (err) => {
          console.error('Erro ao carregar localizacao:', err);
        }
      });
    }
  }

  

  localizacaoForm = this.form.group({
    estado: new FormControl<string | null>('', Validators.required),
    cidade: new FormControl<string | null>('', Validators.required),
    bairro: new FormControl<string | null>('', Validators.required),
    rua: new FormControl<string | null>('', Validators.required),
    numero: new FormControl<string | null>('', Validators.required),
    complemento: new FormControl<TipoComplemento | null>(null, Validators.required),
    cep: new FormControl<string | null>('', Validators.required)
  });
  
  onSubmit(): void {
    this.submited = true;
    this.isLoading = true;
    this.successMessage = null;
    this.errorMessage = null;
    
    if(this.localizacaoForm.invalid){
      this.isLoading = false;
      this.localizacaoForm.markAllAsTouched();
      this.errorMessage = "Por favor, preencha os dados corretamente.";
      return;
    }

    const localizacao:Localizacao = {
      estado: this.localizacaoForm.value.estado!,
      cidade: this.localizacaoForm.value.cidade!,
      bairro: this.localizacaoForm.value.bairro!,
      rua: this.localizacaoForm.value.rua!,
      numero: this.localizacaoForm.value.numero!,
      complemento: this.localizacaoForm.value.complemento!,
      cep: this.localizacaoForm.value.cep!
    }

    const request$ = this.isEditMode && this.localizacaoId
    ? this.localizacaoService.atualizar(this.localizacaoId,localizacao)
    : this.localizacaoService.cadastrarLocalizacao(localizacao);

    request$.subscribe({
      next:() =>{
        this.submited = false;
        this.isLoading = false;
        this.successMessage = this.isEditMode && this.localizacaoId ? "Localização atualizada com sucesso!" : "Localização cadastrada com sucesso!"
        this.errorMessage = null;
        this.localizacaoForm.reset({
          estado: '',
          cidade: '',
          bairro: '',
          rua: '',
          numero: '',
          complemento: null,
          cep: ''
        });
        this.listaCidades = [];
      },
      error: err =>{
        this.isLoading = false;
        this.errorMessage = err?.error?.message || 'Erro ao salvar localização';
        this.successMessage = null;
      }
    })

  }

}
