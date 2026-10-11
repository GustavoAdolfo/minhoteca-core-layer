import { ListaClassificacaoTipo } from '../enums';

export interface ListaClassificacaoProps {
  tipo: ListaClassificacaoTipo;
  idUsuario: string;
  dataInclusao: Date;
  dataRemocao?: Date | null;
  motivoInclusao: string;
  motivoRemocao?: string | null;
  observacoes?: string | null;
  dataObservacoes?: Date | null;
}
