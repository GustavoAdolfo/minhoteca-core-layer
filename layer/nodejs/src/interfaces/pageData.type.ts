import { AutorDTO, PaisDTO, LivroDTO, EditoraDTO } from '../dtos';

export interface PageDataType {
  PageData?: AutorDTO[] | LivroDTO[] | PaisDTO[] | EditoraDTO[];
  Items: number;
  TotalItems: number;
  TotalPage: number;
  Page: number;
  NextPage?: string;
  PreviousPage?: string;
  Code: number;
  Message?: string;
}
