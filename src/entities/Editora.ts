import { Entity } from './Entity';
import { Nome } from '../value-objects/Nome';
import { Email } from '../value-objects/Email';
import { generateUUID } from '../utils/uuid';
import { EditoraInterface } from '../interfaces/editora.interface';

/**
 * Entidade Editora
 * Representa uma editora no sistema Minhoteca
 */
export class Editora extends Entity {
  nome: Nome;
  email: Email | undefined;
  website: string | undefined;
  pais: string | undefined;
  logoUrl: string | undefined;

  private constructor(id: string, props: EditoraInterface) {
    super(id);
    this.nome = new Nome(props.nome);
    this.email = props?.email ? new Email(props.email) : undefined;
    this.website = props.website;
    this.pais = props.pais;
    this.logoUrl = props.logoUrl;
  }

  /**
   * Factory method para criar uma nova Editora
   */
  static create(props: EditoraInterface, id?: string): Editora {
    const editoraId = id || generateUUID().replaceAll('-', '');
    return new Editora(editoraId, props);
  }

  /**
   * Factory method para reconstruir uma Editora a partir de dados persistidos
   */
  static reconstitute(id: string, props: EditoraInterface): Editora {
    return new Editora(id, props);
  }

  getNome(): string {
    return this.nome.toPrimitive();
  }

  getEmail(): string | undefined {
    return this.email?.toPrimitive() ?? undefined;
  }

  getWebsite(): string | undefined {
    return this.website;
  }

  getPais(): string | undefined {
    return this.pais;
  }

  getLogoUrl(): string | undefined {
    return this.logoUrl;
  }

  removeEmail(): void {
    this.email = undefined;
  }

  update(props: Partial<EditoraInterface>): void {
    this.nome = props.nome ? new Nome(props.nome) : this.nome;
    this.email = props.email ? new Email(props.email) : this.email;
    this.website = props.website ? props.website : this.website;
    this.pais = props.pais ? props.pais : this.pais;
    this.logoUrl = props.logoUrl ? props.logoUrl : this.logoUrl;
  }

  toJSONString(): string {
    return JSON.stringify({
      id: this.id,
      nome: this.nome.toString(),
      email: this.email ? this.email.toString() : undefined,
      website: this.website,
      pais: this.pais,
      logoUrl: this.logoUrl,
    });
  }

  equals(entity: Entity): boolean {
    if (!(entity instanceof Editora)) {
      return false;
    }
    return (
      this.nome.equals(entity.nome) &&
      ((this.email && entity.email && this.email.equals(entity.email)) ||
        (!this.email && !entity.email)) &&
      this.website === entity.website &&
      this.pais === entity.pais &&
      this.logoUrl === entity.logoUrl
    );
  }
}
