import { AutorDTO, PaisDTO, LivroDTO, EditoraDTO } from '../dtos';

export interface PageDataType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PageData?: AutorDTO[] | LivroDTO[] | PaisDTO[] | EditoraDTO[] | any;
  Items: number;
  TotalItems: number;
  TotalPage: number;
  Page: number;
  NextPage?: string;
  PreviousPage?: string;
  Code: number;
  Message?: string;
}
