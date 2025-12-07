import { ValueObject } from '../value-objects/ValueObject';

/**
 * Value Object para representar um ISBN (International Standard Book Number)
 * Validação básica de formato ISBN-10 e ISBN-13
 */
export class ISBN extends ValueObject {
  private readonly value: string;

  constructor(value: string) {
    super();
    this.validate(value);
    this.value = value.replace(/[^0-9X]/g, '').toUpperCase();
  }

  private validate(value: string): void {
    const cleanValue = value.replace(/[^0-9X]/g, '').toUpperCase();

    if (!cleanValue.match(/^(?:\d{9}[\dX]|\d{13})$/)) {
      throw new Error(`ISBN inválido: ${value}. Use ISBN-10 ou ISBN-13`);
    }
  }

  equals(other: ValueObject): boolean {
    if (!(other instanceof ISBN)) {
      return false;
    }
    return this.value === other.value;
  }

  toPrimitive(): string {
    return this.value;
  }

  toString(): string {
    return this.value;
  }
}
