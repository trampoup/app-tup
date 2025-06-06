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
import { ConversaComClienteComponent } from './bate-papo/profissional/conversa-com-cliente/conversa-com-cliente.component';
import { ListaDeConversaComOsClientesComponent } from './bate-papo/profissional/lista-de-conversa-com-os-clientes/lista-de-conversa-com-os-clientes.component';
import { ConversaComProfissionalComponent } from './bate-papo/cliente/conversa-com-profissional/conversa-com-profissional.component';
import { ListaDeConversaComOsProfissionaisComponent } from './bate-papo/cliente/lista-de-conversa-com-os-profissionais/lista-de-conversa-com-os-profissionais.component';
import { VisualizacaoDeFavoritosComponent } from './favoritos/visualizacao-de-favoritos/visualizacao-de-favoritos.component';
import { EditarCuponsComponent } from './cupons/editar-cupons/editar-cupons.component';

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
      { path:'editar-cupom', component: EditarCuponsComponent},
      
      // servicos
      { path: 'cadastro-de-servico', component: CadastroDeServicoComponent},
      { path: 'lista-de-servicos', component: ListaDeServicosComponent},

      // mini site
      { path: 'cadastro-de-site', component: CadastroSiteComponent},
      { path: 'visualizacao-do-site', component: VisualizarSiteComponent},

       // Bate Papo com o Cliente
       { path: 'conversa-com-o-profissional', component: ConversaComProfissionalComponent},
       { path: 'lista-de-conversas-com-os-profissionais', component: ListaDeConversaComOsProfissionaisComponent},

        // Bate Papo com o profissional 
        { path: 'conversa-com-cliente', component: ConversaComClienteComponent},
        { path: 'lista-de-conversa-como-os-clientes', component: ListaDeConversaComOsClientesComponent},

         // Notificacoes do Cliente
         { path: 'notificacao-do-cliente', component: ConversaComProfissionalComponent},
         { path: 'lista-de-notificacoes-cliente', component: ListaDeConversaComOsProfissionaisComponent},
  
          // Notificacoes do profissional 
          { path: 'notificacao-do-profissional', component: ConversaComClienteComponent},
          { path: 'lista-de-notificacoes-profissional', component: ListaDeConversaComOsClientesComponent},

          // Visualizar profissionais favoritos
          { path:'visualizacao-de-profissionais-favoritos', component: VisualizacaoDeFavoritosComponent},

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
