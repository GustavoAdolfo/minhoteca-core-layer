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
  protected nome: Nome;
  protected imagemPadrao?: string;
  protected imagemDispositivos?: string;
  protected urlReferencia?: string;
  protected nomePais?: string;
  protected isoAlpha3?: string;
  protected idPais?: number;
  protected bandeira?: string;
  protected totalLivros: number | undefined;
  protected revisar: boolean = false;

  private constructor(id: string, props: AutorInterface) {
    super(id);
    this.nome = new Nome(props.nome);
    this.imagemPadrao = props.imagemPadrao;
    this.imagemDispositivos = props.imagemDispositivos;
    this.urlReferencia = props.urlReferencia;
    this.idPais = props.idPais ?? Object.getOwnPropertyDescriptor(props, 'pais')?.value?.isoNumeric;
    this.nomePais =
      Object.getOwnPropertyDescriptor(props, 'pais')?.value?.nomePortugues ??
      Object.getOwnPropertyDescriptor(props, 'pais')?.value?.nome ??
      Object.getOwnPropertyDescriptor(props, 'nomePais')?.value;
    this.isoAlpha3 =
      Object.getOwnPropertyDescriptor(props, 'pais')?.value?.isoAlpha3 ??
      Object.getOwnPropertyDescriptor(props, 'isoAlpha3')?.value;
    this.bandeira =
      Object.getOwnPropertyDescriptor(props, 'pais')?.value?.bandeira ??
      Object.getOwnPropertyDescriptor(props, 'bandeira')?.value;
    this.totalLivros = props.totalLivros;
    this.revisar = props.revisar ?? false;
  }

  /**
   * Factory method para criar um novo Autor
   */
  static create(props: AutorInterface, id?: string): Autor {
    const autorId = id || generateUUID().replaceAll('-', '');
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

  getId(): string {
    return this.id;
  }

  getNome(): string {
    return this.nome.toString();
  }

  getImagemPadrao(): string | undefined {
    return this.imagemPadrao;
  }

  getImagemDispositivos(): string | undefined {
    return this.imagemDispositivos;
  }

  getNomePais(): string | undefined {
    return this.nomePais;
  }

  getUrlReferencia(): string | undefined {
    return this.urlReferencia;
  }

  getIsoAlpha3(): string | undefined {
    return this.isoAlpha3;
  }

  getIdPais(): number | undefined {
    return this.idPais;
  }

  getBandeira(): string | undefined {
    return this.bandeira;
  }

  getTotalLivros(): number | undefined {
    return this.totalLivros;
  }

  getRevisar(): boolean {
    return this.revisar;
  }

  update(props: Partial<AutorInterface>): void {
    if (Object.prototype.hasOwnProperty.call(props, 'nome') && !props.nome) {
      throw new AutorInvalidoError('Nome do autor é obrigatório');
    }
    this.nome = props.nome ? new Nome(props.nome) : this.nome;
    this.imagemPadrao = props.imagemPadrao ?? this.imagemPadrao;
    this.imagemDispositivos = props.imagemDispositivos ?? this.imagemDispositivos;
    this.nomePais =
      Object.getOwnPropertyDescriptor(props, 'pais')?.value?.nomePortugues ??
      Object.getOwnPropertyDescriptor(props, 'pais')?.value?.nome ??
      this.nomePais;
    this.isoAlpha3 =
      Object.getOwnPropertyDescriptor(props, 'pais')?.value?.isoAlpha3 ?? this.isoAlpha3;
    this.idPais = Object.getOwnPropertyDescriptor(props, 'pais')?.value?.isoNumeric ?? this.idPais;
    this.bandeira =
      Object.getOwnPropertyDescriptor(props, 'pais')?.value?.bandeira ?? this.bandeira;
    this.urlReferencia = props.urlReferencia ?? this.urlReferencia;
    this.totalLivros = props.totalLivros ?? this.totalLivros;
    this.revisar = props.revisar ?? this.revisar;
  }

  toJSONString(): string {
    return JSON.stringify({
      id: this.id,
      nome: this.nome.toString(),
      imagemPadrao: this.imagemPadrao,
      imagemDispositivos: this.imagemDispositivos,
      urlReferencia: this.urlReferencia,
      nomePais: this.nomePais,
      isoAlpha3: this.isoAlpha3,
      idPais: this.idPais,
      bandeira: this.bandeira,
      totalLivros: this.totalLivros,
      revisar: this.revisar,
    });
  }

  equals(entity: Entity): boolean {
    if (!(entity instanceof Autor)) {
      return false;
    }
    return (
      this.nome.equals(entity.nome) &&
      this.totalLivros === entity.totalLivros &&
      this.revisar === entity.revisar &&
      this.imagemPadrao === entity.imagemPadrao &&
      this.imagemDispositivos === entity.imagemDispositivos &&
      this.urlReferencia === entity.urlReferencia &&
      this.nomePais === entity.nomePais &&
      this.isoAlpha3 === entity.isoAlpha3 &&
      this.idPais === entity.idPais &&
      this.bandeira === entity.bandeira
    );
  }
}
