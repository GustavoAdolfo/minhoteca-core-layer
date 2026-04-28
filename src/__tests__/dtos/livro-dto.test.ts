import { LivroDTO } from '../../dtos';
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
});
