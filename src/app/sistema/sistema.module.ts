import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SistemaRoutingModule } from './sistema-routing.module';
import { PainelAdminComponent } from './Dashboards/painel-admin/painel-admin.component';
import { PainelProfissionalComponent } from './Dashboards/painel-profissional/painel-profissional.component';
import { PainelClienteComponent } from './Dashboards/painel-cliente/painel-cliente.component';
import { CadastroCuponsComponent } from './cupons/cadastro-cupons/cadastro-cupons.component';
import { ListaDeCuponsComponent } from './cupons/lista-de-cupons/lista-de-cupons.component';
import { CadastroDeServicoComponent } from './servicos/cadastro-de-servico/cadastro-de-servico.component';
import { ListaDeServicosComponent } from './servicos/lista-de-servicos/lista-de-servicos.component';
import { MeuPerfilAdminComponent } from './meu-perfil/meu-perfil-admin/meu-perfil-admin.component';
import { MeuPerfilProfissionalComponent } from './meu-perfil/meu-perfil-profissional/meu-perfil-profissional.component';
import { MeuPerfilClienteComponent } from './meu-perfil/meu-perfil-cliente/meu-perfil-cliente.component';
import { CadastroSiteComponent } from './mini-site/cadastro-site/cadastro-site.component';
import { VisualizarSiteComponent } from './mini-site/visualizar-site/visualizar-site.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    PainelAdminComponent,
    PainelProfissionalComponent,
    PainelClienteComponent,
    CadastroCuponsComponent,
    ListaDeCuponsComponent,
    CadastroDeServicoComponent,
    ListaDeServicosComponent,
    MeuPerfilAdminComponent,
    MeuPerfilProfissionalComponent,
    MeuPerfilClienteComponent,
    CadastroSiteComponent,
    VisualizarSiteComponent
  ],
  imports:[
    CommonModule, 
    SistemaRoutingModule, 
    FormsModule, 
    ReactiveFormsModule,
    //NgxMaskModule.forRoot(),
    //DragDropModule
  ],
})
export class SistemaModule { }
