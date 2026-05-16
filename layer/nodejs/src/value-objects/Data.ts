import { ValueObject } from '../value-objects/ValueObject';

/**
 * Value Object para representar uma Data
 * Encapsula validações e formatações de datas
 */
export class Data extends ValueObject {
  private readonly value: Date;

  constructor(value: Date | string) {
    super();
    this.validate(value);
    this.value = typeof value === 'string' ? new Date(value) : value;
  }

  private validate(value: Date | string): void {
    let date: Date;

    if (typeof value === 'string') {
      date = new Date(value);
    } else {
      date = value;
    }

    if (isNaN(date.getTime())) {
      throw new Error(`Data inválida: ${value}`);
    }
  }

  equals(other: ValueObject): boolean {
    if (!(other instanceof Data)) {
      return false;
    }
    return this.value.getTime() === other.value.getTime();
  }

  toPrimitive(): string {
    return this.value.toISOString();
  }

  toString(): string {
    return this.value.toLocaleDateString('pt-BR');
  }

  /**
   * Retorna a data como objeto Date
   */
  asDate(): Date {
    return new Date(this.value);
  }

  /**
   * Verifica se a data é anterior a uma outra data
   */
  isBefore(other: Data): boolean {
    return this.value < other.value;
  }

  /**
   * Verifica se a data é posterior a uma outra data
   */
  isAfter(other: Data): boolean {
    return this.value > other.value;
  }
}
