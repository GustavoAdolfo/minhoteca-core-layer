import { ListaClassificacaoTipo } from '../enums';

export interface ListaClassificacaoProps {
  tipo: ListaClassificacaoTipo;
  idUsuario: string;
  dataInclusao: Date;
  dataRemocao: Date;
  motivoInclusao: string;
  motivoRemocao: string;
  observacoes: string;
  dataObservacoes: Date;
}
