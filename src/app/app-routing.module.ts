import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { EsqueciSenhaComponent } from './esqueci-senha/esqueci-senha.component';
import { LayoutComponent } from './layout/layout.component';
import { PainelAdminComponent } from './sistema/Dashboards/painel-admin/painel-admin.component';
import { CadastroComponent } from './cadastro/cadastro.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent},
  { path: 'recuperacao-de-senha', component: EsqueciSenhaComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '', component: LayoutComponent, children: [
    { path : 'usuario/painel-principal-admin', component: PainelAdminComponent },
    { path: '', redirectTo: 'usuario/painel-principal-admin', pathMatch: 'full' }
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
