import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginDTO } from './LoginDTO';
import { AuthService } from '../configs/services/auth.service';
import { Usuario } from './usuario';
import { TipoUsuario } from './tipo-usuario.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {}
  errorMessage: string | null = null;
  submited:boolean = false;
  isLoading:boolean = false;
  
  passwordFieldType = 'password';

  loginForm = this.formBuilder.group({
    email: new FormControl('', { validators: [Validators.required]}),
    senha: new FormControl('', {validators: [Validators.required]}),
  });

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }


  protected onFormSubmitHandler(event: SubmitEvent) {
    event.preventDefault();
    this.submited = true;

    if(this.loginForm.invalid) return;

    this.isLoading = true;

    const email = this.loginForm.controls.email.value ?? '';
    const senha = this.loginForm.controls.senha.value ?? '';

    const dadosLogin:LoginDTO ={
      email: email,
      senha: senha
    }

    this.authService.login(dadosLogin).subscribe({
      next: (response: any) => {
        if (this.errorMessage) this.errorMessage = null;
        const access_token = response.access_token; //so para ver o token
        localStorage.setItem('access_token', access_token);

        const role = response.authorities.length > 0 ? response.authorities[0] : null;  

        localStorage.setItem('role', role ?? '');
        this.isLoading = false;
        switch(role) {
          case 'ROLE_ADMIN':
            this.router.navigate(['/usuario/painel-principal-admin']);
            this.authService.setRoleUsuario(TipoUsuario.ADMIN);
            break;
          case 'ROLE_PROFISSIONAL':
            this.router.navigate(['/usuario/painel-principal-profissional']);
            this.authService.setRoleUsuario(TipoUsuario.PROFISSIONAL);
            break;
          case 'ROLE_CLIENTE':
            this.router.navigate(['/usuario/painel-principal-cliente']);
            this.authService.setRoleUsuario(TipoUsuario.CLIENTE);
            break;
          default:
            this.router.navigate(['/usuario/painel-principal-cliente']); //so para testes
            break;
        }

      },
      error: (error) => {
        this.isLoading = false;
        const errorDesc = error?.error?.error_description || error?.error?.message;

        if (error.status === 400 && error?.error?.error === 'invalid_grant') {
          this.errorMessage = 'E-mail e/ou senha inválidos.';
        } else if (error.status === 401) {
          this.errorMessage = 'Não autorizado. Verifique suas credenciais.';
        } else {
          this.errorMessage = errorDesc || 'Não foi possível entrar. Tente novamente.';
        }


      }
    });


  }
  
  login() {
    const event = new Event('submit', { cancelable: true });
    this.onFormSubmitHandler(event as SubmitEvent);
  }
}
