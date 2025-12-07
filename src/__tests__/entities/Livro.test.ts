import { Livro, StatusLivro } from '../../entities/Livro';
import { Nome } from '../../value-objects/Nome';
import { ISBN } from '../../value-objects/ISBN';
import { Data } from '../../value-objects/Data';
import { LivroInvalidoError } from '../../errors/DomainErrors';

describe('Livro Entity', () => {
  const criarLivroProps = () => ({
    titulo: new Nome('O Alquimista'),
    isbn: new ISBN('978-8506084405'),
    autorId: 'autor-123',
    editoraId: 'editora-123',
    anoPublicacao: 1988,
    dataAquisicao: new Data('2023-01-15'),
    status: StatusLivro.DISPONIVEL
  });

  it('deve criar um novo livro', () => {
    const props = criarLivroProps();
    const livro = Livro.create(props);

    expect(livro.getId()).toBeDefined();
    expect(livro.getTitulo().toString()).toBe('O Alquimista');
    expect(livro.getISBN().toString()).toBe('9788506084405');
    expect(livro.getStatus()).toBe(StatusLivro.DISPONIVEL);
  });

  it('deve validar ano de publicação', () => {
    const props = { ...criarLivroProps(), anoPublicacao: 999 };
    expect(() => Livro.create(props)).toThrow(LivroInvalidoError);
  });

  it('deve validar ano de publicação futuro', () => {
    const props = { ...criarLivroProps(), anoPublicacao: new Date().getFullYear() + 1 };
    expect(() => Livro.create(props)).toThrow(LivroInvalidoError);
  });

  it('deve emprestar um livro disponível', () => {
    const props = criarLivroProps();
    const livro = Livro.create(props);

    livro.emprestar();

    expect(livro.getStatus()).toBe(StatusLivro.EMPRESTADO);
  });

  it('não deve emprestar um livro já emprestado', () => {
    const props = criarLivroProps();
    const livro = Livro.create(props);

    livro.emprestar();
    expect(() => livro.emprestar()).toThrow(LivroInvalidoError);
  });

  it('deve devolver um livro emprestado', () => {
    const props = criarLivroProps();
    const livro = Livro.create(props);

    livro.emprestar();
    livro.devolver();

    expect(livro.getStatus()).toBe(StatusLivro.DISPONIVEL);
  });

  it('não deve devolver um livro que não está emprestado', () => {
    const props = criarLivroProps();
    const livro = Livro.create(props);

    expect(() => livro.devolver()).toThrow(LivroInvalidoError);
  });

  it('deve marcar livro como danificado', () => {
    const props = criarLivroProps();
    const livro = Livro.create(props);

    livro.marcarComoDanificado();

    expect(livro.getStatus()).toBe(StatusLivro.DANIFICADO);
  });

  it('deve descartar um livro', () => {
    const props = criarLivroProps();
    const livro = Livro.create(props);

    livro.descartar();

    expect(livro.getStatus()).toBe(StatusLivro.DESCARTADO);
  });

  it('deve verificar se livro está disponível', () => {
    const props = criarLivroProps();
    const livro = Livro.create(props);

    expect(livro.estaDisponivel()).toBe(true);

    livro.emprestar();
    expect(livro.estaDisponivel()).toBe(false);
  });

  it('deve atualizar localização do livro', () => {
    const props = criarLivroProps();
    const livro = Livro.create(props);

    livro.atualizarLocalizacao('Prateleira A-3');

    expect(livro.getLocalizacao()).toBe('Prateleira A-3');
  });

  it('deve reconstruir um livro existente', () => {
    const id = 'livro-123';
    const props = {
      ...criarLivroProps(),
      criadoEm: new Date(),
      atualizadoEm: new Date()
    };

    const livro = Livro.reconstitute(id, props);

    expect(livro.getId()).toBe('livro-123');
    expect(livro.getTitulo().toString()).toBe('O Alquimista');
  });

  it('deve atualizar timestamp ao fazer operações', () => {
    const props = criarLivroProps();
    const livro = Livro.create(props);
    const propsAntes = livro.getProps();

    // Aguarda um pouco para garantir que o timestamp mude
    setTimeout(() => {
      livro.emprestar();
      const propsDepois = livro.getProps();
      expect(propsDepois.atualizadoEm.getTime()).toBeGreaterThanOrEqual(
        propsAntes.atualizadoEm.getTime()
      );
    }, 10);
  });

  it('deve retornar representação em string', () => {
    const props = criarLivroProps();
    const livro = Livro.create(props);
    const str = livro.toString();

    expect(str).toContain('O Alquimista');
    expect(str).toContain('9788506084405');
    expect(str).toContain('Livro');
  });
});
