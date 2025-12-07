// Value Objects
export { ValueObject } from './value-objects/ValueObject';
export { ISBN } from './value-objects/ISBN';
export { Email } from './value-objects/Email';
export { Nome } from './value-objects/Nome';
export { Data } from './value-objects/Data';

// Entities
export { Entity } from './entities/Entity';
export { Autor, type AutorProps } from './entities/Autor';
export { Editora, type EditoraProps } from './entities/Editora';
export { Livro, StatusLivro, type LivroProps } from './entities/Livro';

// DTOs
export type { AutorDTO, CriarAutorDTO, AtualizarAutorDTO } from './dtos/AutorDTO';
export type { EditoraDTO, CriarEditoraDTO, AtualizarEditoraDTO } from './dtos/EditoraDTO';
export type { LivroDTO, CriarLivroDTO, AtualizarLivroDTO } from './dtos/LivroDTO';

// Adapters
export { AutorAdapter } from './adapters/AutorAdapter';
export { EditoraAdapter } from './adapters/EditoraAdapter';
export { LivroAdapter } from './adapters/LivroAdapter';

// Errors
export {
  DomainError,
  LivroInvalidoError,
  AutorInvalidoError,
  EditoraInvalidaError
} from './errors/DomainErrors';
