import { Livro } from '../../../layer/nodejs/src/entities/Livro';
import { StatusLivro } from '../../../layer/nodejs/src/enums';
import { Nome } from '../../../layer/nodejs/src/value-objects/Nome';
import { ISBN } from '../../../layer/nodejs/src/value-objects/ISBN';
import { LivroInvalidoError } from '../../../layer/nodejs/src/errors/DomainErrors';
import { LivroInterface } from '../../../layer/nodejs/src/interfaces/livro.interface';
import { Entity } from '../../../layer/nodejs/src/entities/Entity';

describe('Livro Entity', () => {
  const criarLivroProps = () =>
    ({
      titulo: new Nome('O Alquimista'),
      isbn: new ISBN('978-8506084405'),
      autorId: 'autor-123',
      editoraId: 'editora-123',
      anoPublicacao: 1988,
      revisar: false,
      status: StatusLivro.DISPONIVEL,
    }) as unknown as LivroInterface;

  it('deve criar um novo livro', () => {
    const props = criarLivroProps();
    const livro = Livro.create(props);

    expect(livro.getId()).toBeDefined();
    expect(livro.getTitulo()?.toString()).toBe('O Alquimista');
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

    expect(livro.disponivel()).toBe(true);

    livro.emprestar();
    expect(livro.disponivel()).toBe(false);
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
      atualizadoEm: new Date(),
    };

    const livro = Livro.reconstitute(id, props);

    expect(livro.getId()).toBe('livro-123');
    expect(livro.getTitulo()?.toString()).toBe('O Alquimista');
  });

  it('deve atualizar timestamp ao fazer operações', () => {
    const props = criarLivroProps();
    const livro = Livro.create(props);
    const atualizadoEm = livro.atualizadoEm;

    // Aguarda um pouco para garantir que o timestamp mude
    setTimeout(() => {
      livro.emprestar();
      expect(livro.atualizadoEm.getTime()).toBeGreaterThanOrEqual(atualizadoEm.getTime());
    }, 10);
  });

  it('deve retornar representação em string', () => {
    const props = criarLivroProps();
    const livro = Livro.create(props);
    const str = livro.toJSONString();
    const content = JSON.parse(str);

    expect(content).toHaveProperty('id', livro.getId());
    expect(content).toHaveProperty('titulo', 'O Alquimista');
    expect(content).toHaveProperty('isbn', '9788506084405');
    expect(content).toHaveProperty('autorId', 'autor-123');
    expect(content).toHaveProperty('editoraId', 'editora-123');
    expect(content).toHaveProperty('anoPublicacao', 1988);
    expect(content).toHaveProperty('status', StatusLivro.DISPONIVEL);
  });

  it('deve lançar erro ao criar livro sem título', () => {
    expect(() => {
      Livro.create({ ...criarLivroProps(), titulo: undefined });
    }).toThrow('Título é obrigatório e não pode ser vazio ou nulo');
  });

  it('deve criar livro sem informar parâmetros que assumem valor padrão', () => {
    const livro = Livro.create({
      titulo: new Nome('Dom Casmurro'),
      isbn: new ISBN('978-8501110338'),
      autorId: 'autor-456',
      editoraId: 'editora-456',
      anoPublicacao: 1899,
    } as unknown as LivroInterface);

    expect(livro.getStatus()).toBe(StatusLivro.REVISAO);
    expect(livro.getLocalizacao()).toBeUndefined();
    expect(livro.getRevisar()).toBe(true);
    expect(livro.getIdioma()).toBeUndefined();
    expect(livro.getImagemCapaUrl()).toBeUndefined();
    expect(livro.getImagemCapaMiniUrl()).toBeUndefined();
    expect(livro.getPaginas()).toBe(0);
    expect(livro.getSinopse()).toBeUndefined();
    expect(livro.getSubtitulo()).toBeUndefined();
    expect(livro.getTitulo()).toBe('Dom Casmurro');
  });

  it('deve criar livro com ISBN como string', () => {
    const livro = Livro.create({
      titulo: new Nome('1984'),
      isbn: '978-0451524935' as unknown as ISBN,
      autorId: 'autor-789',
      editoraId: 'editora-789',
      anoPublicacao: 1949,
    } as unknown as LivroInterface);

    expect(livro.getISBN()).toBe('9780451524935');
  });

  it('deve criar livro com ISBN como objeto ISBN', () => {
    const isbnObj = new ISBN('978-0451524935');
    const livro = Livro.create({
      titulo: new Nome('Brave New World'),
      isbn: isbnObj,
      autorId: 'autor-abc',
      editoraId: 'editora-abc',
      anoPublicacao: 1932,
    } as unknown as LivroInterface);

    expect(livro.getISBN()).toBe('9780451524935');
    expect(livro.isbn.equals(isbnObj)).toBe(true);
  });

  it('deve criar livro com ISBN como objeto com propriedade value', () => {
    const livro = Livro.create({
      titulo: new Nome('The Great Gatsby'),
      isbn: {
        value: '978-0743273565',
      } as unknown as ISBN,
      autorId: 'autor-def',
      editoraId: 'editora-def',
      anoPublicacao: 1925,
    } as unknown as LivroInterface);

    expect(livro.getISBN()).toBe('9780743273565');
  });

  it('deve criar livro com ISBN não definido (sem propriedade isbn)', () => {
    const props = {
      titulo: new Nome('O Cortiço'),
      autorId: 'autor-ghi',
      editoraId: 'editora-ghi',
      anoPublicacao: 1890,
    };

    expect(() => {
      Livro.create(props as unknown as LivroInterface);
    }).toThrow();
  });

  it('deve lançar erro ao criar livro com ISBN objeto vazio (sem propriedade value)', () => {
    expect(() => {
      Livro.create({
        titulo: new Nome('Memórias Póstumas de Brás Cubas'),
        isbn: {} as unknown as ISBN,
        autorId: 'autor-jkl',
        editoraId: 'editora-jkl',
        anoPublicacao: 1881,
      } as unknown as LivroInterface);
    }).toThrow('ISBN inválido');
  });

  it('deve retornar desigualdade para entidades de tipos diferentes', () => {
    const props = criarLivroProps();
    const livro = Livro.create(props);
    const outroObjeto = { id: livro.getId() };
    expect(livro.equals(outroObjeto as unknown as Entity)).toBe(false);
  });

  it('deve retornar igualdade para a instâncias com mesmos valores', () => {
    const props = criarLivroProps();
    const livro1 = Livro.create(props);
    const livro2 = Livro.create(props);
    expect(livro1.equals(livro2)).toBe(true);
  });

  it('deve retornar estado de revisão', () => {
    const props = criarLivroProps();
    const livro = Livro.create({ ...props, revisar: true, status: StatusLivro.REVISAO });

    expect(livro.getStatus()).toBe(StatusLivro.REVISAO);
    expect(livro.sobRevisao()).toBe(true);

    const livro2 = Livro.create({ ...props, revisar: true, status: StatusLivro.DANIFICADO });
    expect(livro2.getStatus()).toBe(StatusLivro.DANIFICADO);
    expect(livro2.sobRevisao()).toBe(true);
  });

  it('deve retornar estado de marcado para revisão', () => {
    const props = criarLivroProps();
    const livro = Livro.create(props);
    livro.marcarParaRevisao();
    expect(livro.getStatus()).toBe(StatusLivro.REVISAO);
    expect(livro.sobRevisao()).toBe(true);
  });

  it('deve retornar estado de desmarcado para revisão', () => {
    const props = criarLivroProps();
    const livro = Livro.create(props);
    livro.marcarParaRevisao();
    livro.removerDaRevisao();

    expect(livro.getStatus()).toBe(StatusLivro.DISPONIVEL);
  });

  describe('Timestamps initialization (criadoEm and atualizadoEm)', () => {
    it('deve criar livro com criadoEm como new Date() quando não fornecido', () => {
      const props = criarLivroProps();
      const beforeCreate = new Date();
      const livro = Livro.create(props);
      const afterCreate = new Date();

      const criadoEm = new Date(livro.getCriadoEm());
      expect(criadoEm.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(criadoEm.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });

    it('deve criar livro com atualizadoEm como new Date() quando não fornecido', () => {
      const props = criarLivroProps();
      const beforeCreate = new Date();
      const livro = Livro.create(props);
      const afterCreate = new Date();

      const atualizadoEm = new Date(livro.getAtualizadoEm());
      expect(atualizadoEm.getTime()).toBeGreaterThanOrEqual(beforeCreate.getTime());
      expect(atualizadoEm.getTime()).toBeLessThanOrEqual(afterCreate.getTime());
    });

    it('deve reconstruir livro com criadoEm fornecido', () => {
      const id = 'livro-123';
      const dataEspecifica = new Date('2025-01-15T10:30:00Z');
      const props = {
        ...criarLivroProps(),
        criadoEm: dataEspecifica,
        atualizadoEm: new Date(),
      };

      const livro = Livro.reconstitute(id, props);

      expect(livro.getCriadoEm()).toBe(dataEspecifica.toISOString());
    });

    it('deve reconstruir livro com atualizadoEm fornecido', () => {
      const id = 'livro-456';
      const dataEspecifica = new Date('2025-02-20T14:45:00Z');
      const props = {
        ...criarLivroProps(),
        criadoEm: new Date(),
        atualizadoEm: dataEspecifica,
      };

      const livro = Livro.reconstitute(id, props);

      expect(livro.getAtualizadoEm()).toBe(dataEspecifica.toISOString());
    });

    it('deve reconstruir livro com ambos os timestamps fornecidos', () => {
      const id = 'livro-789';
      const criadoEmData = new Date('2025-01-10T08:00:00Z');
      const atualizadoEmData = new Date('2025-03-15T16:20:00Z');
      const props = {
        ...criarLivroProps(),
        criadoEm: criadoEmData,
        atualizadoEm: atualizadoEmData,
      };

      const livro = Livro.reconstitute(id, props);

      expect(livro.getCriadoEm()).toBe(criadoEmData.toISOString());
      expect(livro.getAtualizadoEm()).toBe(atualizadoEmData.toISOString());
    });

    it('deve reconstruir livro com criadoEm undefined usando new Date()', () => {
      const id = 'livro-undefined-1';
      const beforeReconstituye = new Date();
      const props = {
        ...criarLivroProps(),
        criadoEm: undefined,
        atualizadoEm: new Date(),
      } as unknown as LivroInterface;

      const livro = Livro.reconstitute(id, props);
      const afterReconstituye = new Date();

      const criadoEm = new Date(livro.getCriadoEm());
      expect(criadoEm.getTime()).toBeGreaterThanOrEqual(beforeReconstituye.getTime());
      expect(criadoEm.getTime()).toBeLessThanOrEqual(afterReconstituye.getTime());
    });

    it('deve reconstruir livro com atualizadoEm undefined usando new Date()', () => {
      const id = 'livro-undefined-2';
      const beforeReconstituye = new Date();
      const props = {
        ...criarLivroProps(),
        criadoEm: new Date(),
        atualizadoEm: undefined,
      } as unknown as LivroInterface;

      const livro = Livro.reconstitute(id, props);
      const afterReconstituye = new Date();

      const atualizadoEm = new Date(livro.getAtualizadoEm());
      expect(atualizadoEm.getTime()).toBeGreaterThanOrEqual(beforeReconstituye.getTime());
      expect(atualizadoEm.getTime()).toBeLessThanOrEqual(afterReconstituye.getTime());
    });
  });
});
