import { ListaClassificacaoTipo } from '../enums';
import { ListaClassificacaoProps } from '../interfaces';

/**
 * Entidade ListaClassificacao
 * Representa uma lista de classificações de usuários no sistema Minhoteca
 */
export class ListaClassificacao {
  tipo: ListaClassificacaoTipo;
  idUsuario: string;
  dataInclusao: Date;
  dataRemocao: Date | null;
  motivoInclusao: string;
  motivoRemocao: string | null;
  observacoes: string | null;
  dataObservacoes: Date | null;

  private constructor(props: ListaClassificacaoProps) {
    this.tipo = props.tipo;
    this.idUsuario = props.idUsuario;
    this.dataInclusao = props.dataInclusao;
    this.dataRemocao = props.dataRemocao;
    this.motivoInclusao = props.motivoInclusao;
    this.motivoRemocao = props.motivoRemocao;
    this.observacoes = props.observacoes;
    this.dataObservacoes = props.dataObservacoes;
  }

  public static create(props: ListaClassificacaoProps): ListaClassificacao {
    return new ListaClassificacao(props);
  }

  public registrarRemocao(motivoRemocao: string): void {
    this.motivoRemocao = motivoRemocao;
    this.dataRemocao = new Date();
  }

  public registrarInclusao(motivoInclusao: string): void {
    this.motivoInclusao = motivoInclusao;
    this.dataInclusao = new Date();
    this.motivoRemocao = null;
    this.dataRemocao = null;
  }

  public atualizarObservacoes(observacoes: string): void {
    this.observacoes = observacoes;
    this.dataObservacoes = new Date();
  }
}
