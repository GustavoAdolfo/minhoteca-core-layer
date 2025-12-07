/**
 * DTO para representar um Autor em APIs
 * DTOs são usados na transferência de dados entre camadas sem expor entidades internas
 */
export interface AutorDTO {
  id: string;
  nome: string;
  biografia?: string;
  email?: string;
  dataNascimento?: string;
  nacionalidade?: string;
}

/**
 * DTO para criar um novo Autor
 */
export interface CriarAutorDTO {
  nome: string;
  biografia?: string;
  email?: string;
  dataNascimento?: string;
  nacionalidade?: string;
}

/**
 * DTO para atualizar um Autor
 */
export interface AtualizarAutorDTO {
  nome?: string;
  biografia?: string;
  email?: string;
  dataNascimento?: string;
  nacionalidade?: string;
}
