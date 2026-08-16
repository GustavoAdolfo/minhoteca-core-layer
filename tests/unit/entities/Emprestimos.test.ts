import { Entity } from '../../../layer/nodejs/src/entities/Entity';
import { Emprestimo } from '../../../layer/nodejs/src/entities/Emprestimo';
import { EmprestimoInterface } from '../../../layer/nodejs/src/interfaces/emprestimo.interface';

const defaultProps = (): EmprestimoInterface => ({
  livroId: 'livro-123',
  usuarioId: 'usuario-456',
  solicitacaoDataHora: '2026-08-01T10:00:00.000Z',
  emprestimoDataHora: '2026-08-01T10:30:00.000Z',
  prazoDias: 14,
  previsaoDevolucaoDataHora: '2026-08-15T10:30:00.000Z',
  devolucaoDataHora: undefined,
  renovacaoDataHora: undefined,
  situacao: 'ATIVO',
  observacao: 'Empréstimo normal',
});

describe('Emprestimo Entity', () => {
  it('deve criar um novo empréstimo', () => {
    const props = defaultProps();

    const emprestimo = Emprestimo.create(props);

    expect(emprestimo.getId()).toBeDefined();
    expect(emprestimo.getLivroId()).toBe(props.livroId);
    expect(emprestimo.getUsuarioId()).toBe(props.usuarioId);
    expect(emprestimo.getSolicitacaoDataHora()).toBe(props.solicitacaoDataHora);
    expect(emprestimo.getEmprestimoDataHora()).toBe(props.emprestimoDataHora);
    expect(emprestimo.getPrazoDias()).toBe(props.prazoDias);
    expect(emprestimo.getPrevisaoDevolucaoDataHora()).toBe(props.previsaoDevolucaoDataHora);
    expect(emprestimo.getSituacao()).toBe(props.situacao);
    expect(emprestimo.getObservacao()).toBe(props.observacao);
  });

  it('deve reconstruir um empréstimo existente', () => {
    const id = 'emprestimo-123';
    const props = defaultProps();

    const emprestimo = Emprestimo.reconstitute(id, props);

    expect(emprestimo.getId()).toBe(id);
    expect(emprestimo.getLivroId()).toBe(props.livroId);
    expect(emprestimo.getUsuarioId()).toBe(props.usuarioId);
  });

  it('deve atualizar campos do empréstimo', () => {
    const emprestimo = Emprestimo.create(defaultProps());

    emprestimo.update({
      situacao: 'DEVOLVIDO',
      devolucaoDataHora: '2026-08-10T12:00:00.000Z',
      observacao: 'Devolvido no prazo',
      prazoDias: 21,
    });

    expect(emprestimo.getSituacao()).toBe('DEVOLVIDO');
    expect(emprestimo.getDevolucaoDataHora()).toBe('2026-08-10T12:00:00.000Z');
    expect(emprestimo.getObservacao()).toBe('Devolvido no prazo');
    expect(emprestimo.getPrazoDias()).toBe(21);
  });

  it('deve manter os valores antigos ao atualizar com campos vazios', () => {
    const emprestimo = Emprestimo.create(defaultProps());

    emprestimo.update({
      observacao: undefined,
      situacao: '',
    } as Partial<EmprestimoInterface>);

    expect(emprestimo.getObservacao()).toBe(defaultProps().observacao);
    expect(emprestimo.getSituacao()).toBe(defaultProps().situacao);
  });

  it('deve retornar igualdade quando dois empréstimos têm os mesmos valores', () => {
    const props = defaultProps();
    const emprestimo1 = Emprestimo.create(props);
    const emprestimo2 = Emprestimo.reconstitute('emprestimo-999', props);

    expect(emprestimo1.equals(emprestimo2)).toBe(true);
  });

  it('deve retornar desigualdade quando campos diferem', () => {
    const emprestimo1 = Emprestimo.create(defaultProps());
    const emprestimo2 = Emprestimo.create({
      ...defaultProps(),
      situacao: 'ATRASADO',
      observacao: 'Atrasado',
    });

    expect(emprestimo1.equals(emprestimo2)).toBe(false);
  });

  it('deve retornar falso ao comparar com entidade de tipo diferente', () => {
    const emprestimo = Emprestimo.create(defaultProps());
    const outroObjeto = { livroId: 'livro-999' };

    expect(emprestimo.equals(outroObjeto as unknown as Entity)).toBe(false);
  });

  it('deve serializar para JSON', () => {
    const emprestimo = Emprestimo.create(defaultProps());

    const json = JSON.parse(emprestimo.toJSONString());

    expect(json).toHaveProperty('id', emprestimo.getId());
    expect(json).toHaveProperty('livroId', defaultProps().livroId);
    expect(json).toHaveProperty('usuarioId', defaultProps().usuarioId);
    expect(json).toHaveProperty('solicitacaoDataHora', defaultProps().solicitacaoDataHora);
    expect(json).toHaveProperty('emprestimoDataHora', defaultProps().emprestimoDataHora);
    expect(json).toHaveProperty('prazoDias', defaultProps().prazoDias);
    expect(json).toHaveProperty(
      'previsaoDevolucaoDataHora',
      defaultProps().previsaoDevolucaoDataHora
    );
    expect(json).toHaveProperty('situacao', defaultProps().situacao);
    expect(json).toHaveProperty('observacao', defaultProps().observacao);
  });

  it('deve lançar erro ao reconstituir com id vazio', () => {
    expect(() => {
      Emprestimo.reconstitute('', defaultProps());
    }).toThrow('ID do empréstimo não informado ou inválido');
  });
});
