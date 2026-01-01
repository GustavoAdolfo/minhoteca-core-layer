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
  protected nomePaisPortugues?: string;
  protected isoAlpha3?: string;
  protected idPais?: number;
  protected bandeira?: string;
  protected totalLivros: number = 0;
  protected revisar: boolean = false;

  private constructor(id: string, props: AutorInterface) {
    super(id);
    this.nome = new Nome(props.nome);
    this.imagemPadrao = props.imagemPadrao;
    this.imagemDispositivos = props.imagemDispositivos;
    this.urlReferencia = props.urlReferencia;
    this.nomePais = props.nomePais;
    this.nomePaisPortugues = props.nomePaisPortugues;
    this.isoAlpha3 = props.isoAlpha3;
    this.idPais = props.idPais;
    this.bandeira = props.bandeira;
    this.totalLivros = props.totalLivros ?? 0;
    this.revisar = props.revisar ?? false;
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

  getNomePaisPortugues(): string | undefined {
    return this.nomePaisPortugues;
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
    this.nomePais = props.nomePais ?? this.nomePais;
  }

  toJSONString(): string {
    return JSON.stringify({
      id: this.id,
      nome: this.nome.toString(),
      imagemPadrao: this.imagemPadrao,
      imagemDispositivos: this.imagemDispositivos,
      urlReferencia: this.urlReferencia,
      nomePais: this.nomePais,
      nomePaisPortugues: this.nomePaisPortugues,
      isoAlpha3: this.isoAlpha3,
      idPais: this.idPais,
      bandeira: this.bandeira,
      totalLivros: this.totalLivros,
      revisar: this.revisar,
    });
  }
}
