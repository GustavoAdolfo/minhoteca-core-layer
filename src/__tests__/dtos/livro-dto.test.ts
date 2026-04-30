import { AutorDTO, EditoraDTO, LivroDTO } from '../../dtos';
import { StatusLivro } from '../../enums';

describe('LivroDTO', () => {
  it('deve converter LivroDTO para um json válido', () => {
    const livroDTO = new LivroDTO({
      titulo: 'Título do Livro',
      autorId: 'autor-123',
      id: 'asdf209384',
      isbn: '978-3-16-148410-0',
      editoraId: 'qqwersadfasd',
      anoPublicacao: 2020,
      sinopse: 'Uma breve sinopse do livro.',
      status: StatusLivro.DISPONIVEL,
      localizacao: 'Estante B-2',
      revisar: false,
      criadoEm: '2024-06-01T12:00:00Z',
      atualizadoEm: '2024-06-02T12:00:00Z',
    });

    const json = livroDTO.toJSONString();
    const content = JSON.parse(json);

    expect(content).toHaveProperty('id', 'asdf209384');
    expect(content).toHaveProperty('titulo', 'Título do Livro');
    expect(content).toHaveProperty('autorId', 'autor-123');
    expect(content).toHaveProperty('isbn', '978-3-16-148410-0');
    expect(content).toHaveProperty('editoraId', 'qqwersadfasd');
    expect(content).toHaveProperty('anoPublicacao', 2020);
    expect(content).toHaveProperty('status', StatusLivro.DISPONIVEL);
    expect(content).toHaveProperty('sinopse', 'Uma breve sinopse do livro.');
    expect(content).toHaveProperty('revisar', false);
  });

  it('deve lidar com propriedades opcionais ausentes', () => {
    const livroDTO = new LivroDTO({
      titulo: 'Título do Livro',
      autorId: 'autor-123',
      id: 'asdf209384',
      isbn: '978-3-16-148410-0',
      editoraId: 'qqwersadfasd',
      anoPublicacao: 2020,
      status: StatusLivro.DISPONIVEL,
    });

    const json = livroDTO.toJSONString();
    const content = JSON.parse(json);

    expect(content).toHaveProperty('id', 'asdf209384');
    expect(content).toHaveProperty('titulo', 'Título do Livro');
    expect(content).toHaveProperty('autorId', 'autor-123');
    expect(content).toHaveProperty('isbn', '978-3-16-148410-0');
    expect(content).toHaveProperty('editoraId', 'qqwersadfasd');
    expect(content).toHaveProperty('anoPublicacao', 2020);
    expect(content).toHaveProperty('status', StatusLivro.DISPONIVEL);
    expect(content).not.toHaveProperty('sinopse');
    expect(content).not.toHaveProperty('localizacao');
    expect(content).not.toHaveProperty('revisar');
  });

  it('deve converter um objeto genérico em um DTO válido', () => {
    const data = {
      titulo: 'Título do Livro',
      autorId: 'autor-123',
      id: 'asdf209384',
      isbn: '978-3-16-148410-0',
      editoraId: 'qqwersadfasd',
      anoPublicacao: 2020,
      status: StatusLivro.DISPONIVEL,
      autor: new AutorDTO({ id: 'autor-123', nome: 'Nome do Autor' }),
      editora: new EditoraDTO({ id: 'qqwersadfasd', nome: 'Nome da Editora' }),
    };

    const livroDTO = new LivroDTO(data);

    expect(livroDTO).toBeInstanceOf(LivroDTO);
    expect(livroDTO.id).toBe('asdf209384');
    expect(livroDTO.titulo).toBe('Título do Livro');
    expect(livroDTO.autorId).toBe('autor-123');
    expect(livroDTO.isbn).toBe('978-3-16-148410-0');
    expect(livroDTO.editoraId).toBe('qqwersadfasd');
    expect(livroDTO.anoPublicacao).toBe(2020);
    expect(livroDTO.status).toBe(StatusLivro.DISPONIVEL);
  });
});
