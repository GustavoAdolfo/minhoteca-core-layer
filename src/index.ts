// Value Objects
export { ValueObject } from './value-objects/ValueObject';
export { ISBN } from './value-objects/ISBN';
export { Email } from './value-objects/Email';
export { Nome } from './value-objects/Nome';
export { Data } from './value-objects/Data';

// Entities
export { Entity } from './entities/Entity';
export { Autor } from './entities/Autor';
export { Editora } from './entities/Editora';
export { Livro } from './entities/Livro';
export { Pais } from './entities/Pais';

// DTOs
export type { AutorDTO } from './dtos/AutorDTO';
export type { EditoraDTO } from './dtos/EditoraDTO';
export type { LivroDTO } from './dtos/LivroDTO';
export type { PaisDTO } from './dtos/PaisDTO';

// Adapters
export { AutorAdapter } from './adapters/AutorAdapter';
export { EditoraAdapter } from './adapters/EditoraAdapter';
export { LivroAdapter } from './adapters/LivroAdapter';
export { PaisAdapter } from './adapters/PaisAdapter';

// Errors
export {
  DomainError,
  LivroInvalidoError,
  AutorInvalidoError,
  EditoraInvalidaError,
} from './errors/DomainErrors';

export { StatusLivro } from './enums';

export {
  LivroInterface,
  AutorInterface,
  EditoraInterface,
  UseCaseInterface,
  PaisInterface,
} from './interfaces';
