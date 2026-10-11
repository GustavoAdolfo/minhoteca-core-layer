import { ListaClassificacao } from '../../../layer/nodejs/src/entities/ListaClassificacao';
import { ListaClassificacaoTipo } from '../../../layer/nodejs/src/enums';
import { ListaClassificacaoProps } from '../../../layer/nodejs/src/interfaces';

const createProps = (
  overrides: Partial<ListaClassificacaoProps> = {}
): ListaClassificacaoProps => ({
  tipo: ListaClassificacaoTipo.LARANJA,
  idUsuario: 'usuario-123',
  dataInclusao: new Date('2025-01-01T10:00:00.000Z'),
  dataRemocao: null,
  motivoInclusao: 'Motivo da inclusão',
  motivoRemocao: null,
  observacoes: null,
  dataObservacoes: null,
  ...overrides,
});

describe('ListaClassificacao', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it.each(Object.values(ListaClassificacaoTipo))(
    'cria uma classificação do tipo %s preservando suas propriedades',
    (tipo) => {
      const props = createProps({ tipo });

      const listaClassificacao = ListaClassificacao.create(props);

      expect(listaClassificacao).toEqual(props);
      expect(listaClassificacao).toBeInstanceOf(ListaClassificacao);
    }
  );

  it('registra a inclusão e atualiza a data sem modificar outros dados', () => {
    const now = new Date('2025-04-01T10:00:00.000Z');
    jest.useFakeTimers().setSystemTime(now);
    const props = createProps();
    const listaClassificacao = ListaClassificacao.create(props);

    listaClassificacao.registrarInclusao('Novo motivo de inclusão');

    expect(listaClassificacao.motivoInclusao).toBe('Novo motivo de inclusão');
    expect(listaClassificacao.dataInclusao).toEqual(now);
    expect(listaClassificacao).toMatchObject({
      tipo: props.tipo,
      idUsuario: props.idUsuario,
      dataRemocao: null,
      motivoRemocao: null,
      observacoes: props.observacoes,
      dataObservacoes: props.dataObservacoes,
    });
  });

  it('registra a remoção e atualiza a data sem modificar outros dados', () => {
    const now = new Date('2025-04-02T10:00:00.000Z');
    jest.useFakeTimers().setSystemTime(now);
    const props = createProps();
    const listaClassificacao = ListaClassificacao.create(props);

    listaClassificacao.registrarRemocao('Novo motivo de remoção');

    expect(listaClassificacao.motivoRemocao).toBe('Novo motivo de remoção');
    expect(listaClassificacao.dataRemocao).toEqual(now);
    expect(listaClassificacao).toMatchObject({
      tipo: props.tipo,
      idUsuario: props.idUsuario,
      dataInclusao: props.dataInclusao,
      motivoInclusao: props.motivoInclusao,
      observacoes: props.observacoes,
      dataObservacoes: props.dataObservacoes,
    });
  });

  it('atualiza as observações e sua data sem modificar outros dados', () => {
    const now = new Date('2025-04-03T10:00:00.000Z');
    jest.useFakeTimers().setSystemTime(now);
    const props = createProps();
    const listaClassificacao = ListaClassificacao.create(props);

    listaClassificacao.atualizarObservacoes('Observações atualizadas');

    expect(listaClassificacao.observacoes).toBe('Observações atualizadas');
    expect(listaClassificacao.dataObservacoes).toEqual(now);
    expect(listaClassificacao).toMatchObject({
      tipo: props.tipo,
      idUsuario: props.idUsuario,
      dataInclusao: props.dataInclusao,
      dataRemocao: props.dataRemocao,
      motivoInclusao: props.motivoInclusao,
      motivoRemocao: props.motivoRemocao,
    });
  });

  it('permite remover e reinserir uma classificação, limpando os dados da remoção', () => {
    const removalDate = new Date('2025-04-04T10:00:00.000Z');
    const inclusionDate = new Date('2025-04-05T10:00:00.000Z');
    jest.useFakeTimers().setSystemTime(removalDate);
    const listaClassificacao = ListaClassificacao.create(createProps());

    listaClassificacao.registrarRemocao('Motivo de remoção');
    jest.setSystemTime(inclusionDate);
    listaClassificacao.registrarInclusao('Motivo de reinclusão');

    expect(listaClassificacao.motivoRemocao).toBeNull();
    expect(listaClassificacao.dataRemocao).toBeNull();
    expect(listaClassificacao.motivoInclusao).toBe('Motivo de reinclusão');
    expect(listaClassificacao.dataInclusao).toEqual(inclusionDate);
  });
});
