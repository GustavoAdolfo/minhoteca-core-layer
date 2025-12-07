import { Entity } from './Entity';
import { Nome } from '../value-objects/Nome';
import { Data } from '../value-objects/Data';
import { generateUUID } from '../utils/uuid';
import { AutorInvalidoError } from '../errors/DomainErrors';

/**
 * Interface com as propriedades de um Autor
 */
export interface AutorProps {
  nome: Nome;
  biografia?: string;
  dataNascimento?: Data;
  pais?: string;
}

/**
 * Entidade Autor
 * Representa um autor de livros no sistema Minhoteca
 */
export class Autor extends Entity<AutorProps> {
  private constructor(id: string, props: AutorProps) {
    super(id, props);
  }

  /**
   * Factory method para criar um novo Autor
   */
  static create(props: AutorProps, id?: string): Autor {
    if (!props.nome) {
      throw new AutorInvalidoError('Nome do autor é obrigatório');
    }
    const autorId = id || generateUUID();
    return new Autor(autorId, props);
  }

  /**
   * Factory method para reconstruir um Autor a partir de dados persistidos
   */
  static reconstitute(id: string, props: AutorProps): Autor {
    if (!props.nome) {
      throw new AutorInvalidoError('Nome do autor é obrigatório');
    }
    return new Autor(id, props);
  }

  /**
   * Gera um ID único para novo Autor (UUID v4)
   */
  private static generateId(): string {
    return generateUUID();
  }

  getNome(): Nome {
    return this.props.nome;
  }

  getBiografia(): string | undefined {
    return this.props.biografia;
  }

  getDataNascimento(): Data | undefined {
    return this.props.dataNascimento;
  }

  getPais(): string | undefined {
    return this.props.pais;
  }

  /**
   * Atualiza os dados do autor
   */
  update(props: Partial<AutorProps>): void {
    if (Object.prototype.hasOwnProperty.call(props, 'nome') && !props.nome) {
      throw new AutorInvalidoError('Nome do autor é obrigatório');
    }
    this.props = { ...this.props, ...props };
  }

  toString(): string {
    return `Autor(id: ${this.id}, nome: ${this.props.nome.toString()})`;
  }
}
