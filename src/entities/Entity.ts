/**
 * Classe base abstrata para todas as Entidades
 * Entidades têm identidade única, são mutáveis e encapsulam lógica de negócio
 */
export abstract class Entity {
  protected readonly id: string;

  constructor(id: string) {
    this.id = id;
  }

  getId(): string {
    return this.id;
  }

  /**
   * Compara se duas entidades são iguais
   */
  abstract equals(entity: Entity): boolean;

  /**
   * Retorna uma representação legível da entidade
   */
  abstract toJSONString(): string;
}
