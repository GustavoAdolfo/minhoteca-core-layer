import { ValueObject } from '../value-objects/ValueObject';

/**
 * Value Object para representar um Nome
 * Garante que nomes sigam regras de negócio (não vazios, comprimento mínimo)
 */
export class Nome extends ValueObject {
  private readonly value: string;
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 255;

  constructor(value: object | string | undefined) {
    super();
    if (value === undefined) {
      throw new Error('Nome é obrigatório');
    }
    this.validate(value);
    this.value =
      value && typeof value === 'object'
        ? String(Object.getOwnPropertyDescriptor(value, 'value')?.value?.trim() ?? '')
        : (value as string)?.trim();
  }

  private validate(value: object | string): void {
    if (value && typeof value === 'object') {
      value = String(Object.getOwnPropertyDescriptor(value, 'value')?.value ?? '');
    }

    if (!value || value.trim().length === 0) {
      throw new Error('Nome é obrigatório');
    }

    const trimmed = value?.trim();

    if (trimmed.length < Nome.MIN_LENGTH) {
      throw new Error(`Nome deve ter no mínimo ${Nome.MIN_LENGTH} caracteres`);
    }

    if (trimmed.length > Nome.MAX_LENGTH) {
      throw new Error(`Nome não pode exceder ${Nome.MAX_LENGTH} caracteres`);
    }
  }

  equals(other: ValueObject): boolean {
    if (!(other instanceof Nome)) {
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
