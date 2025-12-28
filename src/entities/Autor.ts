import { Entity } from './Entity';
import { Nome } from '../value-objects/Nome';
import { generateUUID } from '../utils/uuid';
import { AutorInvalidoError } from '../errors/DomainErrors';
import { AutorInterface } from '../interfaces/autor.interface';

/**
 * Entidade Autor
 * Representa um autor de livros no sistema Minhoteca
 */
export class Autor extends Entity {
  protected name: Nome;
  protected defaultPictureUrl?: string;
  protected mobilePictureUrl?: string;
  protected externalUrl?: string;
  protected countryName?: string;
  protected countryPortugueseName?: string;
  protected isoAlpha3?: string;
  protected countryId?: number;
  protected flag?: string;
  protected totalBooks: number = 0;
  protected reviewPending: boolean = false;

  private constructor(id: string, props: AutorInterface) {
    super(id);
    this.name = new Nome(props.name);
    this.defaultPictureUrl = props.defaultPictureUrl;
    this.mobilePictureUrl = props.mobilePictureUrl;
    this.externalUrl = props.externalUrl;
    this.countryName = props.countryName;
    this.countryPortugueseName = props.countryPortugueseName;
    this.isoAlpha3 = props.isoAlpha3;
    this.countryId = props.countryId;
    this.flag = props.flag;
    this.totalBooks = props.totalBooks ?? 0;
    this.reviewPending = props.reviewPending ?? false;
  }

  /**
   * Factory method para criar um novo Autor
   */
  static create(props: AutorInterface, id?: string): Autor {
    const autorId = id || generateUUID();
    return new Autor(autorId, props);
  }

  /**
   * Factory method para reconstruir um Autor a partir de dados persistidos
   */
  static reconstitute(id: string, props: AutorInterface): Autor {
    if (!id.trim()) {
      throw new AutorInvalidoError('ID do autor não informado ou inválido');
    }
    return new Autor(id, props);
  }

  getName(): string {
    return this.name.toString();
  }

  getDefaultPictureUrl(): string | undefined {
    return this.defaultPictureUrl;
  }

  getMobilePictureUrl(): string | undefined {
    return this.mobilePictureUrl;
  }

  getCountryName(): string | undefined {
    return this.countryName;
  }

  getExternalUrl(): string | undefined {
    return this.externalUrl;
  }

  getCountryPortugueseName(): string | undefined {
    return this.countryPortugueseName;
  }

  getIsoAlpha3(): string | undefined {
    return this.isoAlpha3;
  }

  getCountryId(): number | undefined {
    return this.countryId;
  }

  getFlag(): string | undefined {
    return this.flag;
  }

  getTotalBooks(): number | undefined {
    return this.totalBooks;
  }

  getReviewPending(): boolean {
    return this.reviewPending;
  }

  update(props: Partial<AutorInterface>): void {
    if (Object.prototype.hasOwnProperty.call(props, 'name') && !props.name) {
      throw new AutorInvalidoError('Nome do autor é obrigatório');
    }
    this.name = props.name ? new Nome(props.name) : this.name;
    this.defaultPictureUrl = props.defaultPictureUrl ?? this.defaultPictureUrl;
    this.mobilePictureUrl = props.mobilePictureUrl ?? this.mobilePictureUrl;
    this.countryName = props.countryName ?? this.countryName;
  }

  toJSONString(): string {
    return JSON.stringify({
      id: this.id,
      name: this.name.toString(),
      defaultPictureUrl: this.defaultPictureUrl,
      mobilePictureUrl: this.mobilePictureUrl,
      externalUrl: this.externalUrl,
      countryName: this.countryName,
      countryPortugueseName: this.countryPortugueseName,
      isoAlpha3: this.isoAlpha3,
      countryId: this.countryId,
      flag: this.flag,
      totalBooks: this.totalBooks,
      reviewPending: this.reviewPending,
    });
  }
}
