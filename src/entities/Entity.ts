/**
 * Classe base abstrata para todas as Entidades
 * Entidades têm identidade única, são mutáveis e encapsulam lógica de negócio
 */
export abstract class Entity<T> {
  protected readonly id: string;
  protected props: T;

  constructor(id: string, props: T) {
    this.id = id;
    this.props = props;
  }

  getId(): string {
    return this.id;
  }

  getProps(): T {
    return this.props;
  }

  /**
   * Compara se duas entidades são iguais pelo ID
   */
  equals(entity: Entity<T>): boolean {
    return this.id === entity.getId();
  }

  /**
   * Retorna uma representação legível da entidade
   */
  abstract toString(): string;
}
