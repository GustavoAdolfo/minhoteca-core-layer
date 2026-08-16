import { Entity } from './Entity';
import { EmprestimoInterface } from '../interfaces';
import { generateUUID } from '../utils/uuid';

/**
 * Entidade Emprestimo
 * Representa um empréstimo no sistema Minhoteca
 */
export class Emprestimo extends Entity {
  livroId: string;
  usuarioId: string;
  solicitacaoDataHora: string;
  emprestimoDataHora?: string;
  prazoDias?: number;
  previsaoDevolucaoDataHora?: string;
  devolucaoDataHora?: string;
  renovacaoDataHora?: string;
  situacao: string;
  observacao?: string;

  private constructor(id: string, props: EmprestimoInterface) {
    super(id);
    this.livroId = props.livroId;
    this.usuarioId = props.usuarioId;
    this.solicitacaoDataHora = props.solicitacaoDataHora;
    this.emprestimoDataHora = props.emprestimoDataHora;
    this.prazoDias = props.prazoDias;
    this.previsaoDevolucaoDataHora = props.previsaoDevolucaoDataHora;
    this.devolucaoDataHora = props.devolucaoDataHora;
    this.renovacaoDataHora = props.renovacaoDataHora;
    this.situacao = props.situacao;
    this.observacao = props.observacao;
  }

  /**
   * Factory method para criar um novo Emprestimo
   */
  static create(props: EmprestimoInterface, id?: string): Emprestimo {
    const emprestimoId = id || generateUUID().replaceAll('-', '');
    return new Emprestimo(emprestimoId, props);
  }

  /**
   * Factory method para reconstruir um Emprestimo a partir de dados persistidos
   */
  static reconstitute(id: string, props: EmprestimoInterface): Emprestimo {
    if (!id.trim()) {
      throw new Error('ID do empréstimo não informado ou inválido');
    }
    return new Emprestimo(id, props);
  }

  getId(): string {
    return this.id;
  }

  getLivroId(): string {
    return this.livroId;
  }

  getUsuarioId(): string {
    return this.usuarioId;
  }

  getSolicitacaoDataHora(): string {
    return this.solicitacaoDataHora;
  }

  getEmprestimoDataHora(): string | undefined {
    return this.emprestimoDataHora;
  }

  getPrazoDias(): number | undefined {
    return this.prazoDias;
  }

  getPrevisaoDevolucaoDataHora(): string | undefined {
    return this.previsaoDevolucaoDataHora;
  }

  getDevolucaoDataHora(): string | undefined {
    return this.devolucaoDataHora;
  }

  getRenovacaoDataHora(): string | undefined {
    return this.renovacaoDataHora;
  }

  getSituacao(): string {
    return this.situacao;
  }

  getObservacao(): string | undefined {
    return this.observacao;
  }

  update(props: Partial<EmprestimoInterface>): void {
    this.livroId = props.livroId ? props.livroId : this.livroId;
    this.usuarioId = props.usuarioId ? props.usuarioId : this.usuarioId;
    this.solicitacaoDataHora = props.solicitacaoDataHora
      ? props.solicitacaoDataHora
      : this.solicitacaoDataHora;
    this.emprestimoDataHora = props.emprestimoDataHora
      ? props.emprestimoDataHora
      : this.emprestimoDataHora;
    this.prazoDias = props.prazoDias ? props.prazoDias : this.prazoDias;
    this.previsaoDevolucaoDataHora = props.previsaoDevolucaoDataHora
      ? props.previsaoDevolucaoDataHora
      : this.previsaoDevolucaoDataHora;
    this.devolucaoDataHora = props.devolucaoDataHora
      ? props.devolucaoDataHora
      : this.devolucaoDataHora;
    this.renovacaoDataHora = props.renovacaoDataHora
      ? props.renovacaoDataHora
      : this.renovacaoDataHora;
    this.situacao = props.situacao ? props.situacao : this.situacao;
    this.observacao = props.observacao ? props.observacao : this.observacao;
  }

  toJSONString(): string {
    return JSON.stringify({
      id: this.getId(),
      livroId: this.livroId,
      usuarioId: this.usuarioId,
      solicitacaoDataHora: this.solicitacaoDataHora,
      emprestimoDataHora: this.emprestimoDataHora,
      prazoDias: this.prazoDias,
      previsaoDevolucaoDataHora: this.previsaoDevolucaoDataHora,
      devolucaoDataHora: this.devolucaoDataHora,
      renovacaoDataHora: this.renovacaoDataHora,
      situacao: this.situacao,
      observacao: this.observacao,
    });
  }

  equals(entity: Entity): boolean {
    if (!(entity instanceof Emprestimo)) {
      return false;
    }
    return (
      this.livroId === entity.livroId &&
      this.usuarioId === entity.usuarioId &&
      this.solicitacaoDataHora === entity.solicitacaoDataHora &&
      this.emprestimoDataHora === entity.emprestimoDataHora &&
      this.prazoDias === entity.prazoDias &&
      this.previsaoDevolucaoDataHora === entity.previsaoDevolucaoDataHora &&
      this.devolucaoDataHora === entity.devolucaoDataHora &&
      this.renovacaoDataHora === entity.renovacaoDataHora &&
      this.situacao === entity.situacao &&
      this.observacao === entity.observacao
    );
  }
}
