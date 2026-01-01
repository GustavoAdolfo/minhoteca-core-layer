import { StatusLivro } from '../enums';
import { ISBN } from '../value-objects/ISBN';

export interface LivroInterface {
  id: string;
  titulo: string;
  isbn: ISBN;
  autorId: string;
  editoraId: string;
  anoPublicacao: number;
  sinopse?: string;
  status: StatusLivro;
  localizacao?: string;
  revisar?: boolean;
  criadoEm?: Date;
  atualizadoEm?: Date;
}
