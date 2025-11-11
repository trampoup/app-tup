import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-esqueci-senha',
  templateUrl: './esqueci-senha.component.html',
  styleUrls: ['./esqueci-senha.component.css']
})
export class EsqueciSenhaComponent {
  submited = false;
  isLoading = false;

  sent = false;
  emailEnviado = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  constructor(private fb: FormBuilder) {}

  onSubmit() {
    this.submited = true;
    if (this.form.invalid) return;

    this.isLoading = true;
    setTimeout(() => {
      this.emailEnviado = (this.form.value.email || '').trim();
      this.sent = true;
      this.isLoading = false;
    }, 500);
  }

  reenviar() {
    // poderia mostrar um toast/feedback visual, por enquanto só um pequeno "pulse"
    this.sent = true; 
  }

}
