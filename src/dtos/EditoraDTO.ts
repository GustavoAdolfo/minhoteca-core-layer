/**
 * DTO para representar uma Editora em APIs
 */
export interface EditoraDTO {
  id: string;
  nome: string;
  email?: string;
  website?: string;
  pais?: string;
}

/**
 * DTO para criar uma nova Editora
 */
export interface CriarEditoraDTO {
  nome: string;
  email?: string;
  website?: string;
  pais?: string;
}

/**
 * DTO para atualizar uma Editora
 */
export interface AtualizarEditoraDTO {
  nome?: string;
  email?: string;
  website?: string;
  pais?: string;
}
