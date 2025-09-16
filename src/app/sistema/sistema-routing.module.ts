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
import { CadastroDeServicoComponent } from './servicos/cadastro-de-servico/cadastro-de-servico.component';
import { ListaDeServicosComponent } from './servicos/lista-de-servicos/lista-de-servicos.component';
import { ConversaComClienteComponent } from './bate-papo/profissional/conversa-com-cliente/conversa-com-cliente.component';
import { ListaDeConversaComOsClientesComponent } from './bate-papo/profissional/lista-de-conversa-com-os-clientes/lista-de-conversa-com-os-clientes.component';
import { ConversaComProfissionalComponent } from './bate-papo/cliente/conversa-com-profissional/conversa-com-profissional.component';
import { ListaDeConversaComOsProfissionaisComponent } from './bate-papo/cliente/lista-de-conversa-com-os-profissionais/lista-de-conversa-com-os-profissionais.component';
import { VisualizacaoDeFavoritosComponent } from './favoritos/visualizacao-de-favoritos/visualizacao-de-favoritos.component';
import { InicioAdminComponent } from './inicios/inicio-admin/inicio-admin.component';
import { InicioProfissionalComponent } from './inicios/inicio-profissional/inicio-profissional.component';
import { InicioClienteComponent } from './inicios/inicio-cliente/inicio-cliente.component';
import { LocalizacaoComponent } from './localizacao/localizacao.component';
import { GameficacaoComponent } from './gameficacao/gameficacao.component';
import { MiniSiteComponent } from './mini-site/mini-site.component';
import { CadastrarSiteComponent } from './mini-site/cadastrar-site/cadastrar-site.component';
import { MeuMiniSiteComponent } from './mini-site/meu-mini-site/meu-mini-site.component';
import { ComunidadesComponent } from './comunidades/comunidades/comunidades.component';
import { MinhasComunidadesComponent } from './comunidades/minhas-comunidades/minhas-comunidades.component';
import { AuthGuard } from '../configs/security/auth.guard';
import { CadastroComunidadeComponent } from './comunidades/cadastro-comunidade/cadastro-comunidade.component';
import { VisualizarComunidadeComponent } from './comunidades/visualizar-comunidade/visualizar-comunidade.component';

const routes: Routes = [
  {  path: 'usuario', 
    component: LayoutComponent,
    // canActivate: [AuthGuard],        // <<<<< protege TODOS os filhos
    children: [
       //inicios
       { path: 'inicio-admin', component: InicioAdminComponent},
       { path: 'inicio-profissional', component: InicioProfissionalComponent},
       { path: 'inicio-cliente', component: InicioClienteComponent},
       //dashboards
      { path: 'painel-principal-admin', component: PainelAdminComponent},
      { path: 'painel-principal-profissional', component: PainelProfissionalComponent},
      { path: 'painel-principal-cliente', component: PainelClienteComponent},

      //localizacao
      {path: 'localizacao', component: LocalizacaoComponent},

      // gameficacao
      {path:'gameficacao', component: GameficacaoComponent},

      //comunidade
      {path: 'comunidades', component: ComunidadesComponent},
      {path: 'cadastro-de-comunidade', component: CadastroComunidadeComponent},
      {path: 'minhas-comunidades', component: MinhasComunidadesComponent},
      {path: 'visualizar-comunidade', component: VisualizarComunidadeComponent},
      {path: 'visualizar-comunidade/:id', component: VisualizarComunidadeComponent},


      // cupons
      { path: 'cadastro-de-cupom', component: CadastroCuponsComponent},
      { path: 'cadastro-de-cupom/:id', component: CadastroCuponsComponent },
      { path: 'visualizacao-de-cupons', component: ListaDeCuponsComponent},
      
      // servicos
      { path: 'cadastro-de-servico', component: CadastroDeServicoComponent},
      { path: 'lista-de-servicos', component: ListaDeServicosComponent},

      // mini site
      { path: 'perfil-profissional', component: MiniSiteComponent},
      { path: 'meu-perfil-profissional', component: MeuMiniSiteComponent},
      { path: 'cadastro-de-site', component: CadastrarSiteComponent},

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
