/**
 * Classe base abstrata para Value Objects
 * Value Objects são objetos imutáveis que representam um conceito com valor por si só
 */
export abstract class ValueObject {
  /**
   * Compara este valor com outro
   */
  abstract equals(other: ValueObject): boolean;

  /**
   * Retorna a representação primitiva do valor
   */
  abstract toPrimitive(): string | number | boolean | Record<string, unknown>;

  /**
   * Retorna string com representação legível do valor
   */
  abstract toString(): string;
}
