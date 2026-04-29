import { ValueObject } from '../value-objects/ValueObject';

/**
 * Value Object para representar um Email
 * Validação básica de formato de email
 */
export class Email extends ValueObject {
  private readonly value: string;

  constructor(value: string | { value: string }) {
    super();
    this.validate(value);
    this.value =
      typeof value === 'string' ? value.toLowerCase().trim() : value?.value.toLowerCase().trim();
  }

  private validate(value: string | { value: string }): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/m;
    const trimmed = typeof value === 'string' ? value.trim() : value?.value.trim();
    if (!emailRegex.test(trimmed)) {
      throw new Error(`Email inválido: ${trimmed}`);
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

  toJSON(): string {
    return this.toPrimitive();
  }
}
