import { EmprestimoDTO } from '../../../layer/nodejs/src/dtos/EmprestimoDTO';

describe('EmprestimoDTO', () => {
  it('deve converter um objeto em EmprestimoDTO e preservar todos os campos', () => {
    const data = {
      id: 'emprestimo-123',
      livroId: 'livro-456',
      usuarioId: 'usuario-789',
      solicitacaoDataHora: '2026-08-01T10:00:00.000Z',
      emprestimoDataHora: '2026-08-01T10:30:00.000Z',
      prazoDias: 14,
      previsaoDevolucaoDataHora: '2026-08-15T10:30:00.000Z',
      devolucaoDataHora: '2026-08-10T12:00:00.000Z',
      renovacaoDataHora: '2026-08-08T10:00:00.000Z',
      situacao: 'EMPRESTADO',
      observacao: 'Empréstimo em andamento',
    };

    const dto = new EmprestimoDTO(data);

    expect(dto.id).toBe('emprestimo-123');
    expect(dto.livroId).toBe('livro-456');
    expect(dto.usuarioId).toBe('usuario-789');
    expect(dto.solicitacaoDataHora).toBe('2026-08-01T10:00:00.000Z');
    expect(dto.emprestimoDataHora).toBe('2026-08-01T10:30:00.000Z');
    expect(dto.prazoDias).toBe(14);
    expect(dto.previsaoDevolucaoDataHora).toBe('2026-08-15T10:30:00.000Z');
    expect(dto.devolucaoDataHora).toBe('2026-08-10T12:00:00.000Z');
    expect(dto.renovacaoDataHora).toBe('2026-08-08T10:00:00.000Z');
    expect(dto.situacao).toBe('EMPRESTADO');
    expect(dto.observacao).toBe('Empréstimo em andamento');
  });

  it('deve serializar o DTO para JSON com todos os campos', () => {
    const dto = new EmprestimoDTO({
      id: 'emprestimo-123',
      livroId: 'livro-456',
      usuarioId: 'usuario-789',
      solicitacaoDataHora: '2026-08-01T10:00:00.000Z',
      emprestimoDataHora: '2026-08-01T10:30:00.000Z',
      prazoDias: 14,
      previsaoDevolucaoDataHora: '2026-08-15T10:30:00.000Z',
      situacao: 'EMPRESTADO',
      observacao: 'Empréstimo em andamento',
    });

    const json = JSON.parse(dto.toJSONString());

    expect(json).toHaveProperty('id', 'emprestimo-123');
    expect(json).toHaveProperty('livroId', 'livro-456');
    expect(json).toHaveProperty('usuarioId', 'usuario-789');
    expect(json).toHaveProperty('solicitacaoDataHora', '2026-08-01T10:00:00.000Z');
    expect(json).toHaveProperty('emprestimoDataHora', '2026-08-01T10:30:00.000Z');
    expect(json).toHaveProperty('prazoDias', 14);
    expect(json).toHaveProperty('previsaoDevolucaoDataHora', '2026-08-15T10:30:00.000Z');
    expect(json).toHaveProperty('situacao', 'EMPRESTADO');
    expect(json).toHaveProperty('observacao', 'Empréstimo em andamento');
  });

  it('deve aceitar propriedades opcionais ausentes', () => {
    const dto = new EmprestimoDTO({
      livroId: 'livro-456',
      usuarioId: 'usuario-789',
      solicitacaoDataHora: '2026-08-01T10:00:00.000Z',
      situacao: 'PENDENTE',
    });

    expect(dto.id).toBeUndefined();
    expect(dto.emprestimoDataHora).toBeUndefined();
    expect(dto.prazoDias).toBeUndefined();
    expect(dto.previsaoDevolucaoDataHora).toBeUndefined();
    expect(dto.devolucaoDataHora).toBeUndefined();
    expect(dto.renovacaoDataHora).toBeUndefined();
    expect(dto.observacao).toBeUndefined();
    expect(dto.situacao).toBe('PENDENTE');
  });
});
