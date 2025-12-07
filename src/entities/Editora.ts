import { Entity } from './Entity';
import { Nome } from '../value-objects/Nome';
import { Email } from '../value-objects/Email';
import { generateUUID } from '../utils/uuid';

/**
 * Interface com as propriedades de uma Editora
 */
export interface EditoraProps {
  nome: Nome;
  email?: Email;
  website?: string;
  pais?: string;
}

/**
 * Entidade Editora
 * Representa uma editora no sistema Minhoteca
 */
export class Editora extends Entity<EditoraProps> {
  private constructor(id: string, props: EditoraProps) {
    super(id, props);
  }

  /**
   * Factory method para criar uma nova Editora
   */
  static create(props: EditoraProps, id?: string): Editora {
    const editoraId = id || generateUUID();
    return new Editora(editoraId, props);
  }

  /**
   * Factory method para reconstruir uma Editora a partir de dados persistidos
   */
  static reconstitute(id: string, props: EditoraProps): Editora {
    return new Editora(id, props);
  }

  /**
   * Gera um ID único para nova Editora (UUID v4)
   */
  private static generateId(): string {
    return generateUUID();
  }

  getNome(): Nome {
    return this.props.nome;
  }

  getEmail(): Email | undefined {
    return this.props.email;
  }

  getWebsite(): string | undefined {
    return this.props.website;
  }

  getPais(): string | undefined {
    return this.props.pais;
  }

  /**
   * Atualiza os dados da editora
   */
  update(props: Partial<EditoraProps>): void {
    this.props = { ...this.props, ...props };
  }

  toString(): string {
    return `Editora(id: ${this.id}, nome: ${this.props.nome.toString()})`;
  }
}
