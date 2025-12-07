import { ValueObject } from '../value-objects/ValueObject';

/**
 * Value Object para representar um Email
 * Validação básica de formato de email
 */
export class Email extends ValueObject {
  private readonly value: string;

  constructor(value: string) {
    super();
    this.validate(value);
    this.value = value.toLowerCase().trim();
  }

  private validate(value: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmed = value.trim();
    if (!emailRegex.test(trimmed)) {
      throw new Error(`Email inválido: ${value}`);
    }
  }

  equals(other: ValueObject): boolean {
    if (!(other instanceof Email)) {
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
