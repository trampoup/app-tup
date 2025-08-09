import { Component, OnInit } from '@angular/core';
import { TipoUsuario } from '../login/tipo-usuario.enum';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CidadesService,listaEstados } from '../configs/services/cidade.service';
import { UsuarioCadastroDTO } from './usuario-cadastro-dto';
import { UsuarioService } from '../configs/services/usuario.service';
import { AuthService } from '../configs/services/auth.service';
import { switchMap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginDTO } from '../login/LoginDTO';
import { ApiResponse } from '../configs/services/api-response-dto';
import { CATEGORIAS, CategoriaKey, Subcategoria } from './categorias-enum';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.css']
})
export class CadastroComponent implements OnInit {
  step:number = 0; //variavel para mudar as telas
  roleUsuario = TipoUsuario;
  //variavel para ajudar a saber e mostrar a tela de cadastro de acordo com a role.
  selectedRole : TipoUsuario | null = null; 

  public listaCidades: any[] = [];
  submited = false;
  isLoading = false;

  successMessage: string | null = null;
  errorMessage: string | null = null;

  protected readonly listaEstados = listaEstados;

  categoriasKeys: CategoriaKey[] = Object.keys(CATEGORIAS) as CategoriaKey[];
  //subCategoriasSelecionadas: Subcategoria[] = [];
  

  profissionalForm = this.formBuilder.group({
    id: new FormControl<string | null>(null),
    nome: new FormControl('', { validators: [Validators.required] }),
    email: new FormControl('', { validators: [Validators.required, Validators.email] }),
    senha: new FormControl('', { validators: [Validators.required] }),
    confirmarSenha: new FormControl('', { validators: [Validators.required] }),
    telefone: new FormControl('', { validators: [Validators.required] }),
    estado: new FormControl('', { validators: [Validators.required] }),
    cidade: new FormControl('', { validators: [Validators.required] }),
    cnpj: new FormControl(''),
    endereco: new FormControl(''),
    cpf: new FormControl('', { validators: [Validators.required] }),
    setor: new FormControl(''),
    termos: new FormControl(false, { validators: Validators.requiredTrue })
  });

  selectedCategories: CategoriaKey[] = []; //pagina de card de categorias

  passwordFieldType = 'password';
  confirmPasswordFieldType = 'password';

  constructor(
    private formBuilder: FormBuilder,
    private serviceLocalidade: CidadesService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router
  ) {}


  ngOnInit(): void {
    // this.step = 2; //TESTE DA PAGE DA CATEGORIAS
    // this.selectedRole = this.roleUsuario.CLIENTE; 
  }

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordFieldType =
      this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
  }

  selectRole(role: TipoUsuario) {
    this.selectedRole = role;
  }

  next(){
    if (this.step < 2) {      
      this.step++;
    }else{
      const rotaInicial = this.authService.getRotaDashboard(); //ja redireciona para a rota inicial
      this.router.navigate([rotaInicial]);
    }
  }

  onEstadoChange(event: Event) {
    const estadoSigla = (event.target as HTMLSelectElement).value;
    this.obterCidadePorEstado(estadoSigla);
  }

  obterCidadePorEstado(estadoSigla: string) {
    if (estadoSigla) {
      this.serviceLocalidade.getCidadesByEstado(estadoSigla)
        .subscribe(data => this.listaCidades = data);
    } else {
      this.listaCidades = [];
    }
  }

  //para as subcategorias
  // categoriasKeys = Object.keys(CATEGORIAS) as CategoriaKey[];

  // onCatChange(evt: Event) {
  //   const cat = (evt.target as HTMLSelectElement).value as CategoriaKey;
  //   this.subCategoriasSelecionadas = CATEGORIAS[cat];
  // }

  onSubmitProfissional() {
    this.submited = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.isLoading = true;

    if (this.profissionalForm.value.senha !== this.profissionalForm.value.confirmarSenha) {
      this.isLoading = false;
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    if (this.profissionalForm.invalid) {
      this.isLoading = false;
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    // normaliza espaços
    const emailCtrl = this.profissionalForm.get('email');
    emailCtrl?.setValue((emailCtrl?.value || '').trim());


    const profissionalCadastro: UsuarioCadastroDTO = {
      id: this.profissionalForm.value.id ?? '',
      nome: this.profissionalForm.value.nome ?? '',
      sobrenome: '',
      email: this.profissionalForm.value.email ?? '', 
      senha: this.profissionalForm.value.senha  ?? '',
      telefone: this.profissionalForm.value.telefone ?? '',
      cpf: this.profissionalForm.value.cpf ?? '',
      cnpj: this.profissionalForm.value.cnpj ?? '',
      endereco: this.profissionalForm.value.endereco ?? '',
      cidade: this.profissionalForm.value.cidade ?? '',
      estado: this.profissionalForm.value.estado ?? '',
      setor: this.profissionalForm.value.setor ?? '',
      tipoUsuario: TipoUsuario.PROFISSIONAL // Define o tipo de usuário como profissional
    }

    this.usuarioService.cadastrarUsuario(profissionalCadastro)
      .pipe(switchMap((created: ApiResponse<UsuarioCadastroDTO>) => {
        this.authService.showModal=true;
        // Após o cadastro, realiza o login do profissional
        return this.authService.login({
          email: created.response.email,
          senha: profissionalCadastro.senha
        });
      }))
      .subscribe({
        next: (response) => {
          console.log('Cadastro realizado com sucesso:', response);
          this.errorMessage = null;
          this.isLoading = false;
          this.submited = false;
          this.successMessage = 'Cadastro realizado com sucesso!';
          this.profissionalForm.reset();

          this.authService.setRoleUsuario(TipoUsuario.PROFISSIONAL);
          const rotaInicial = this.authService.getRotaDashboard(); //cadastra e ja redireciona para a rota inicial
          this.router.navigate([rotaInicial]);
          
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 409) {
            // marca erro no campo email
            this.profissionalForm.get('email')?.setErrors({ emailTaken: true });
            this.errorMessage = error?.error?.message || 'E-mail já cadastrado.';
          } else {
            this.errorMessage = 'Erro ao cadastrar profissional. Por favor, tente novamente.';
          }
          console.error('Erro ao cadastrar profissional:', error);
        }
      });
  }


  clienteForm = this.formBuilder.group({
    id: new FormControl<string | null>(null),
    nome: new FormControl('', { validators: [Validators.required] }),
    sobrenome: new FormControl('', { validators: [Validators.required] }),
    email: new FormControl('', { validators: [Validators.required, Validators.email] }),
    senha: new FormControl('', { validators: [Validators.required] }),
    confirmarSenha: new FormControl('', { validators: [Validators.required] }),
    telefone: new FormControl('', { validators: [Validators.required] }),
    estado: new FormControl('', { validators: [Validators.required] }),
    cidade: new FormControl('', { validators: [Validators.required] }),
    cnpj: new FormControl(''),
    endereco: new FormControl(''),
    cpf: new FormControl('', { validators: [Validators.required] }),
    setor: new FormControl(''),
    termos: new FormControl(false, { validators: Validators.requiredTrue })
  });


  onSubmitCliente() {
    this.submited = true;
    this.errorMessage = null;
    this.successMessage = null;
    this.isLoading = true;

    if (this.clienteForm.value.senha !== this.clienteForm.value.confirmarSenha) {
      this.isLoading = false;
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    if (this.clienteForm.invalid) {
      this.isLoading = false;
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
      return;
    }

    // normaliza espaços
    const emailCtrl = this.clienteForm.get('email');
    emailCtrl?.setValue((emailCtrl?.value || '').trim());


    const clienteCadastro: UsuarioCadastroDTO = {
      id: this.clienteForm.value.id ?? '',
      nome: this.clienteForm.value.nome ?? '',
      sobrenome: this.clienteForm.value.sobrenome ?? '',
      email: this.clienteForm.value.email ?? '', 
      senha: this.clienteForm.value.senha  ?? '',
      telefone: this.clienteForm.value.telefone ?? '',
      cpf: this.clienteForm.value.cpf ?? '',
      cnpj: this.clienteForm.value.cnpj ?? '',
      endereco: this.clienteForm.value.endereco ?? '',
      cidade: this.clienteForm.value.cidade ?? '',
      estado: this.clienteForm.value.estado ?? '',
      setor: this.clienteForm.value.setor ?? '',
      tipoUsuario: TipoUsuario.CLIENTE // Define o tipo de usuário como cliente
    }

    console.log('Cliente Cadastro:', clienteCadastro);
    
    this.usuarioService.cadastrarUsuario(clienteCadastro)
      .pipe(switchMap((created: ApiResponse<UsuarioCadastroDTO>) => {
        this.authService.isCadastro = true; //pra a mensagem de boa-vindas ser exibida somente na primeira vez que o cliente entrar.
        // Após o cadastro, realiza o login do profissional
        return this.authService.login({
          email: created.response.email,
          senha: clienteCadastro.senha
        });
      }))
      .subscribe({
        next: (response) => {
          console.log('Cadastro realizado com sucesso:', response);
          this.errorMessage = null;
          this.isLoading = false;
          this.submited = false;
          this.successMessage = 'Cadastro realizado com sucesso!';
      
          this.authService.setRoleUsuario(TipoUsuario.CLIENTE);
          this.step++;
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 409) {
            this.clienteForm.get('email')?.setErrors({ emailTaken: true });
            this.errorMessage = error?.error?.message || 'E-mail já cadastrado.';
          } else {
            this.errorMessage = 'Erro ao cadastrar cliente. Por favor, tente novamente.';
          }
          console.error('Erro ao cadastrar cliente:', error);
        }
    });
  }



  /** alterna seleção/deseleção */
  toggleCategory(cat: CategoriaKey) {
    const idx = this.selectedCategories.indexOf(cat);
    if (idx >= 0) {
      this.selectedCategories.splice(idx, 1);
    } else {
      this.selectedCategories.push(cat);
    }
  }


  /** helper para template */
  isCategorySelected(cat: CategoriaKey): boolean {
    return this.selectedCategories.includes(cat);
  }


}
