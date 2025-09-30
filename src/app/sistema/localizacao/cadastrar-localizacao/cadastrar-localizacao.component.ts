import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CidadesService, listaEstados } from 'src/app/configs/services/cidade.service';
import { TipoComplemento } from './TipoComplemento.enum';

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


  constructor(
    private form:FormBuilder,
    private route: ActivatedRoute,
    private cidadesService: CidadesService
  ) { }

  ngOnInit(): void {
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
  }

}
