import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/configs/services/auth.service';
import { Servico } from '../Servico';
import { Router } from '@angular/router';
import { ModalDeleteService } from 'src/app/configs/services/modal-delete.service';
import { ServicosService } from 'src/app/configs/services/servicos.service';
import { TipoUsuario } from 'src/app/login/tipo-usuario.enum';
import { UsuarioService } from 'src/app/configs/services/usuario.service';
import { UsuarioSiteDTO } from '../../mini-site/cadastrar-site/usuario-site-dto';
import { categoriasDescricoes } from 'src/app/cadastro/categorias-descricoes-enum';
import { Setor } from 'src/app/cadastro/categorias-enum';
import { UsuarioMidiasService } from 'src/app/configs/services/usuario-midias.service';

@Component({
  selector: 'app-lista-de-servicos',
  templateUrl: './lista-de-servicos.component.html',
  styleUrls: ['./lista-de-servicos.component.css']
})
export class ListaDeServicosComponent implements OnInit {
  isLoading: boolean = false;
  TipoUsuario = TipoUsuario;
  successMessage: string | null = '';
  errorMessage: string | null = '';
  mensagemBusca: string | null = '';

  //Serviços para a visão do profissional
  servicos: Servico[] = [];
  servicosPaginados: Servico[] = [];
  selectedServico: Servico | null = null;

  itensPorPagina: number = 5;
  paginaAtual: number = 1;
  totalItens: number = 0;
  totalPaginas: number = 0;

  //Profissionais para visão do cliente
  profissionais: UsuarioSiteDTO[] = [];
  profissionaisPaginados: UsuarioSiteDTO[] = [];
  selectedProfissional: UsuarioSiteDTO | null = null;

  paginaAtualProfissionais: number = 1;
  itensPorPaginaProfissionais: number = 12;
  totalItensProfissionais: number = 0;
  totalPaginasProfissionais: number = 0;

  categoriasDescricoes = categoriasDescricoes;

  // Filtro por setor (visão do cliente)
  setores: Setor[] = [];
  selectedSetor: Setor | 'TODOS' = 'TODOS';
  profissionaisFiltrados: UsuarioSiteDTO[] = [];
  fotoPerfilMap: Record<number, string | null> = {};
  placeholderFoto = '/assets/imagens/foto-perfil-generico.png';

  constructor(private authService : AuthService,
    private router:Router,
    private modalDeleteService : ModalDeleteService,
    private servicoService: ServicosService,
    private usuarioService: UsuarioService,
    private usuarioMidiasService: UsuarioMidiasService
  ) { }

  ngOnInit(): void {
    if (this.obterRoleUsuario() === TipoUsuario.CLIENTE) {
      this.carregarTodosProfissionais();
    }else{ //se for prof, carrega os serviços dele
      this.carregarMeusServicos();
    }

    // Lista de setores a partir do mapa de descrições já usado na tabela
    this.setores = Object.keys(this.categoriasDescricoes) as Setor[];
  
  }

  obterFotoPerfil(id: number){
    return this.usuarioMidiasService.getMidiaDoUsuario("foto_perfil", id);
  }

  getRotaInicial():string{
    return this.authService.getRotaInicial();
  }

  obterRoleUsuario():TipoUsuario{
    return this.authService.getRoleUsuario();
  }

  visualizarProfissional(id: number){
    this.router.navigate(['/usuario/perfil-profissional', id]);
  }

  editarServico(id: number){
    this.router.navigate(['/usuario/cadastro-de-servico', id]);
  }

  openModalDeletar(servico: Servico){
    this.selectedServico = servico;
    this.modalDeleteService.openModal({
      title: 'Deletar Serviço',
      description: `Você tem certeza que deseja deletar o serviço <strong>${servico.nome}</strong>?`,
      item: servico,
      deletarTextoBotao: 'Deletar',
    }, () => {
      this.deletarLocalizacao(servico);
    });
  }


  deletarLocalizacao(servico: Servico){
    this.servicoService.deletar(servico.id!).subscribe({
      next: () => {
        this.successMessage = "Serviço deletado com sucesso!";
        setTimeout(() => this.successMessage = null, 2000);
        this.errorMessage = null;
        this.servicos = this.servicos.filter(serv => serv.id !== servico.id);

        this.totalItens = this.servicos.length; 
        this.totalPaginas = Math.ceil(this.servicos.length / this.itensPorPagina);
        this.atualizarPaginacao();
      },
      error: err => {
        console.error('Erro ao deletar serviço', err);
        this.errorMessage = "Erro ao deletar serviço!";
        setTimeout(() => this.errorMessage = null, 2000);
      }});
  }

  carregarTodosProfissionais(){
    this.usuarioService.obterTodosProfissionais().subscribe({
      next: (profissionais) => {
        this.profissionais = profissionais ?? [];
        this.profissionaisFiltrados = [...this.profissionais]; // base para paginação
        this.isLoading = false;
        this.totalItensProfissionais = this.profissionais.length; 
        this.totalPaginasProfissionais = Math.ceil(
          this.profissionais.length / this.itensPorPaginaProfissionais
        );
        this.atualizarPaginacaoProfissionais();
      },
      error: err => {
        console.error('Erro ao obter serviços', err);
        this.errorMessage = "Erro ao obter serviços!";
        setTimeout(() => this.errorMessage = null, 2000);
      }
    })
  }

  private carregarFotosPerfisPaginados(): void {
    const idsPagina = this.profissionaisPaginados
      .map(p => p.id)
      .filter((id): id is number => typeof id === 'number');

    // Filtra apenas ids que ainda não estão no map (evita chamadas desnecessárias)
    const faltando = idsPagina.filter(id => !(id in this.fotoPerfilMap));

    if (faltando.length === 0) return;

    this.usuarioMidiasService.getFotosPerfilDaPagina(faltando /*, true se precisar withCredentials */)
      .subscribe((mapa) => {
        this.fotoPerfilMap = { ...this.fotoPerfilMap, ...mapa };
      });
  }

  carregarMeusServicos(){
    this.servicoService.obterMeusServicos().subscribe({
      next: (servicos) => {
        this.servicos = servicos ?? [];
        this.isLoading = false;
        this.totalItens = this.servicos.length; 
        this.totalPaginas = Math.ceil(
          this.servicos.length / this.itensPorPagina
        );
        this.atualizarPaginacao();
      },
      error: err => {
        console.error('Erro ao obter serviços', err);
        this.errorMessage = "Erro ao obter serviços!";
        setTimeout(() => this.errorMessage = null, 2000);
      }
    })
  }

  onSetorChange(valor: string) {
    if (valor === 'TODOS') {
      this.selectedSetor = 'TODOS';
      this.profissionaisFiltrados = [...this.profissionais];
    } else {
      this.selectedSetor = valor as Setor;
      this.profissionaisFiltrados = this.profissionais.filter(
        p => p.setor === this.selectedSetor
      );
    }

    // Mensagem quando não houver resultados com o filtro
    if (this.profissionaisFiltrados.length === 0 && this.selectedSetor !== 'TODOS') {
      this.mensagemBusca = `Nenhum profissional encontrado para o setor "${this.categoriasDescricoes[this.selectedSetor]}".`;
    } else {
      this.mensagemBusca = null;
    }

    this.totalItensProfissionais = this.profissionaisFiltrados.length;
    this.totalPaginasProfissionais = Math.ceil(
      this.totalItensProfissionais / this.itensPorPaginaProfissionais
    );
    this.paginaAtualProfissionais = 1;
    this.atualizarPaginacaoProfissionais();
  }



  onPaginaMudou(novaPagina: number) {
      this.paginaAtual = novaPagina;
      this.atualizarPaginacao();
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.servicosPaginados = this.servicos.slice(inicio, fim);
  }

  onPaginaMudouProfissionais(novaPagina: number) {
    this.paginaAtualProfissionais = novaPagina;
    this.atualizarPaginacaoProfissionais();
  }


  atualizarPaginacaoProfissionais(): void {
    const inicio = (this.paginaAtualProfissionais - 1) * this.itensPorPaginaProfissionais;
    const fim = inicio + this.itensPorPaginaProfissionais;
    this.profissionaisPaginados = this.profissionaisFiltrados.slice(inicio, fim);
    this.carregarFotosPerfisPaginados();
  }




}
