  import { NgModule } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { NgApexchartsModule } from 'ng-apexcharts';

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
  import { ListaDeConversaComOsProfissionaisComponent } from './bate-papo/cliente/lista-de-conversa-com-os-profissionais/lista-de-conversa-com-os-profissionais.component';
  import { ListaDeConversaComOsClientesComponent } from './bate-papo/profissional/lista-de-conversa-com-os-clientes/lista-de-conversa-com-os-clientes.component';
  import { ConversaComClienteComponent } from './bate-papo/profissional/conversa-com-cliente/conversa-com-cliente.component';
  import { NotificacaoClienteComponent } from './notificacoes/cliente/notificacao-cliente/notificacao-cliente.component';
  import { VisualizacaoNotificacaoClienteComponent } from './notificacoes/cliente/visualizacao-notificacao-cliente/visualizacao-notificacao-cliente.component';
  import { VisualizacaoNotificacaoProfissionalComponent } from './notificacoes/profissional/visualizacao-notificacao-profissional/visualizacao-notificacao-profissional.component';
  import { NotificacaoProfissionalComponent } from './notificacoes/profissional/notificacao-profissional/notificacao-profissional.component';
  import { VisualizacaoDeFavoritosComponent } from './favoritos/visualizacao-de-favoritos/visualizacao-de-favoritos.component';
  import { InicioAdminComponent } from './inicios/inicio-admin/inicio-admin.component';
  import { InicioClienteComponent } from './inicios/inicio-cliente/inicio-cliente.component';
  import { InicioProfissionalComponent } from './inicios/inicio-profissional/inicio-profissional.component';
import { LocalizacaoComponent } from './localizacao/localizacao.component';
import { ComunidadeComponent } from './comunidade/comunidade.component';
import { MinhasComunidadesComponent } from './minhas-comunidades/minhas-comunidades.component';
import { GameficacaoComponent } from './gameficacao/gameficacao.component';


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
      VisualizarSiteComponent,
      ListaDeConversaComOsProfissionaisComponent,
      ListaDeConversaComOsClientesComponent,
      ConversaComClienteComponent,
      NotificacaoClienteComponent,
      VisualizacaoNotificacaoClienteComponent,
      VisualizacaoNotificacaoProfissionalComponent,
      NotificacaoProfissionalComponent,
      VisualizacaoDeFavoritosComponent,
      InicioAdminComponent,
      InicioClienteComponent,
      InicioProfissionalComponent,
      LocalizacaoComponent,
      ComunidadeComponent,
      MinhasComunidadesComponent,
      GameficacaoComponent
    ],
    imports:[
      CommonModule, 
      SistemaRoutingModule, 
      FormsModule, 
      ReactiveFormsModule,
      NgApexchartsModule
      //NgxMaskModule.forRoot(),
      //DragDropModule
    ],
  })
  export class SistemaModule { }
