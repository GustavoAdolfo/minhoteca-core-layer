import { LivroAdapter } from '../../adapters/LivroAdapter';
import { Livro, StatusLivro } from '../../entities/Livro';
import { Nome } from '../../value-objects/Nome';
import { ISBN } from '../../value-objects/ISBN';
import { CriarLivroDTO } from '../../dtos/LivroDTO';

describe('LivroAdapter', () => {
  const mockLivroProps = {
    titulo: new Nome('O Senhor dos Anéis'),
    isbn: new ISBN('978-0-545-01022-1'),
    autorId: 'autor-123',
    editoraId: 'editora-456',
    anoPublicacao: 1954,
    sinopse: 'Uma épica jornada pela Terra Média',
    status: StatusLivro.DISPONIVEL,
    localizacao: 'Estante A-10',
    criadoEm: new Date('2024-01-01T10:00:00Z'),
    atualizadoEm: new Date('2024-01-02T15:30:00Z'),
  };

  describe('toDTO', () => {
    it('deve converter Livro entity para LivroDTO', () => {
      const livro = Livro.create(mockLivroProps, 'livro-789');
      const dto = LivroAdapter.toDTO(livro);

      expect(dto).toMatchObject({
        id: 'livro-789',
        titulo: 'O Senhor dos Anéis',
        autorId: 'autor-123',
        editoraId: 'editora-456',
        anoPublicacao: 1954,
        descricao: 'Uma épica jornada pela Terra Média',
        status: StatusLivro.DISPONIVEL,
        localizacao: 'Estante A-10',
        isbn: '9780545010221',
      });
    });
  });

  describe('fromCreateDTO', () => {
    it('deve converter CriarLivroDTO para props de Livro', () => {
      const createDTO: CriarLivroDTO = {
        titulo: 'Harry Potter',
        isbn: '978-0-439-13959-5',
        autorId: 'autor-999',
        editoraId: 'editora-888',
        anoPublicacao: 1997,
        descricao: 'O menino que sobreviveu',
        localizacao: 'Estante B-05',
      };

      const props = LivroAdapter.fromCreateDTO(createDTO);

      expect(props.titulo.toString()).toBe('Harry Potter');
      expect(props.isbn.toString()).toBe('9780439139595');
      expect(props.autorId).toBe('autor-999');
      expect(props.editoraId).toBe('editora-888');
      expect(props.anoPublicacao).toBe(1997);
      expect(props.sinopse).toBe('O menino que sobreviveu');
      expect(props.status).toBe(StatusLivro.DISPONIVEL);
      expect(props.localizacao).toBe('Estante B-05');
    });

    it('deve usar status fornecido no DTO', () => {
      const createDTO: CriarLivroDTO = {
        titulo: 'Livro Emprestado',
        isbn: '978-1-234-56789-0',
        autorId: 'autor-111',
        editoraId: 'editora-222',
        anoPublicacao: 2020,
        descricao: 'Descrição',
        status: StatusLivro.EMPRESTADO,
        localizacao: 'Estante C-01',
      };

      const props = LivroAdapter.fromCreateDTO(createDTO);

      expect(props.status).toBe(StatusLivro.EMPRESTADO);
    });
  });

  describe('toDTOList', () => {
    it('deve converter lista de Livros para lista de DTOs', () => {
      const livros = [
        Livro.create(mockLivroProps, 'livro-1'),
        Livro.create({ ...mockLivroProps, titulo: new Nome('Outro Livro') }, 'livro-2'),
      ];

      const dtoList = LivroAdapter.toDTOList(livros);

      expect(dtoList).toHaveLength(2);
      expect(dtoList[0].id).toBe('livro-1');
      expect(dtoList[1].id).toBe('livro-2');
      expect(dtoList[1].titulo).toBe('Outro Livro');
    });

    it('deve retornar lista vazia quando receber array vazio', () => {
      const dtoList = LivroAdapter.toDTOList([]);

      expect(dtoList).toEqual([]);
    });
  });
});
