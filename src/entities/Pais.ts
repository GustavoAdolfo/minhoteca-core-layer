import { Entity } from './Entity';
import { PaisInterface } from '../interfaces/pais.interface';

/**
 * Entidade Pais
 * Representa um país no sistema Minhoteca
 */
export class Pais extends Entity {
  nome: string;
  nomePortugues: string;
  bandeira?: string;
  isoAlpha3: string;
  isoAlpha2?: string;
  isoNumeric: number;

  pais: string | undefined;
  logoUrl: string | undefined;

  private constructor(props: PaisInterface) {
    super(props.isoNumeric.toString());
    this.nome = props.nome;
    this.nomePortugues = props.nomePortugues;
    this.bandeira = props.bandeira;
    this.isoAlpha3 = props.isoAlpha3;
    this.isoAlpha2 = props.isoAlpha2;
    this.isoNumeric = props.isoNumeric;
  }

  /**
   * Factory method para criar uma nova Pais
   */
  static create(props: PaisInterface): Pais {
    return new Pais(props);
  }

  /**
   * Factory method para reconstruir uma Pais a partir de dados persistidos
   */
  static reconstitute(props: PaisInterface): Pais {
    return new Pais(props);
  }

  getNome(): string {
    return this.nome;
  }

  getIsoNumeric(): number {
    return this.isoNumeric;
  }

  getIsoAlpha3(): string {
    return this.isoAlpha3;
  }

  getBandeira(): string | undefined {
    return this.bandeira;
  }

  getNomePortugues(): string {
    return this.nomePortugues;
  }

  getIsoAlpha2(): string | undefined {
    return this.isoAlpha2;
  }

  update(props: Partial<PaisInterface>): void {
    this.nome = props.nome ? props.nome : this.nome;
    this.nomePortugues = props.nomePortugues ? props.nomePortugues : this.nomePortugues;
    this.bandeira = props.bandeira ? props.bandeira : this.bandeira;
    this.isoAlpha3 = props.isoAlpha3 ? props.isoAlpha3 : this.isoAlpha3;
    this.isoAlpha2 = props.isoAlpha2 ? props.isoAlpha2 : this.isoAlpha2;
    this.isoNumeric = props.isoNumeric ? props.isoNumeric : this.isoNumeric;
  }

  toJSONString(): string {
    return JSON.stringify({
      id: this.getId(),
      isoNumeric: this.isoNumeric,
      nome: this.nome,
      nomePortugues: this.nomePortugues,
      bandeira: this.bandeira,
      isoAlpha3: this.isoAlpha3,
      isoAlpha2: this.isoAlpha2,
    });
  }

  equals(entity: Entity): boolean {
    if (!(entity instanceof Pais)) {
      return false;
    }
    return (
      this.nome === entity.nome &&
      this.nomePortugues === entity.nomePortugues &&
      this.bandeira === entity.bandeira &&
      this.isoAlpha3 === entity.isoAlpha3 &&
      this.isoAlpha2 === entity.isoAlpha2 &&
      this.isoNumeric === entity.isoNumeric
    );
  }
}
