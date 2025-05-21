import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '../layout/layout.component';
import { PainelAdminComponent } from './Dashboards/painel-admin/painel-admin.component';
import { PainelProfissionalComponent } from './Dashboards/painel-profissional/painel-profissional.component';
import { PainelClienteComponent } from './Dashboards/painel-cliente/painel-cliente.component';
import { CadastroCuponsComponent } from './cupons/cadastro-cupons/cadastro-cupons.component';
import { ListaDeCuponsComponent } from './cupons/lista-de-cupons/lista-de-cupons.component';
import { MeuPerfilAdminComponent } from './meu-perfil/meu-perfil-admin/meu-perfil-admin.component';
import { MeuPerfilProfissionalComponent } from './meu-perfil/meu-perfil-profissional/meu-perfil-profissional.component';
import { MeuPerfilClienteComponent } from './meu-perfil/meu-perfil-cliente/meu-perfil-cliente.component';
import { VisualizarSiteComponent } from './mini-site/visualizar-site/visualizar-site.component';
import { CadastroSiteComponent } from './mini-site/cadastro-site/cadastro-site.component';
import { CadastroDeServicoComponent } from './servicos/cadastro-de-servico/cadastro-de-servico.component';
import { ListaDeServicosComponent } from './servicos/lista-de-servicos/lista-de-servicos.component';

const routes: Routes = [
  {  path: 'usuario', 
    component: LayoutComponent,
    children: [
       //dashboards
      { path: 'painel-principal-admin', component: PainelAdminComponent},
      { path: 'painel-principal-profissional', component: PainelProfissionalComponent},
      { path: 'painel-principal-cliente', component: PainelClienteComponent},

      // cupons
      { path: 'cadastro-de-cupom', component: CadastroCuponsComponent},
      { path: 'visualizacao-de-cupons', component: ListaDeCuponsComponent},
      
      // servicos
      { path: 'cadastro-de-servico', component: CadastroDeServicoComponent},
      { path: 'lista-de-servicos', component: ListaDeServicosComponent},

      // mini site
      { path: 'cadastro-de-site', component: CadastroSiteComponent},
      { path: 'visualizacao-do-site', component: VisualizarSiteComponent},

      // meu perfil com roles
      { path: 'meu-perfil-admin', component: MeuPerfilAdminComponent},
      { path: 'meu-perfil-profissional', component: MeuPerfilProfissionalComponent},
      { path: 'meu-perfil-cliente', component: MeuPerfilClienteComponent},
    ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SistemaRoutingModule { }
