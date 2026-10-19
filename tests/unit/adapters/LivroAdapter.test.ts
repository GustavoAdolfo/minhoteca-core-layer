import { LivroAdapter } from '../../../layer/nodejs/src/adapters/LivroAdapter';
import { Livro } from '../../../layer/nodejs/src/entities/Livro';
import { StatusLivro } from '../../../layer/nodejs/src/enums';
import { ISBN } from '../../../layer/nodejs/src/value-objects/ISBN';
import { LivroDTO } from '../../../layer/nodejs/src/dtos/LivroDTO';
import { LivroInterface } from '../../../layer/nodejs/src/interfaces/livro.interface';

describe('LivroAdapter', () => {
  const mockLivroProps = {
    titulo: 'O Senhor dos Anéis',
    isbn: new ISBN('978-0-545-01022-1'),
    autorId: 'autor-123',
    editoraId: 'editora-456',
    anoPublicacao: 1954,
    sinopse: 'Uma épica jornada pela Terra Média',
    situacao: StatusLivro.DISPONIVEL,
    localizacao: 'Estante A-10',
    criadoEm: new Date('2024-01-01T10:00:00Z'),
    atualizadoEm: new Date('2024-01-02T15:30:00Z'),
    id: 'livro-789',
  } as unknown as LivroInterface;

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
        sinopse: 'Uma épica jornada pela Terra Média',
        situacao: StatusLivro.DISPONIVEL,
        localizacao: 'Estante A-10',
        isbn: '9780545010221',
      });
    });
  });

  describe('fromCreateDTO', () => {
    it('deve converter CriarLivroDTO para props de Livro', () => {
      const createDTO = new LivroDTO({
        titulo: 'Harry Potter',
        isbn: '978-0-439-13959-5',
        autorId: 'autor-999',
        editoraId: 'editora-888',
        anoPublicacao: 1997,
        sinopse: 'O menino que sobreviveu',
        localizacao: 'Estante B-05',
      });

      const props = LivroAdapter.fromCreateDTO(createDTO);

      expect(props.titulo?.toString()).toBe('Harry Potter');
      expect(props.isbn.toString()).toBe('9780439139595');
      expect(props.autorId).toBe('autor-999');
      expect(props.editoraId).toBe('editora-888');
      expect(props.anoPublicacao).toBe(1997);
      expect(props.sinopse).toBe('O menino que sobreviveu');
      expect(props.situacao).toBe(StatusLivro.DISPONIVEL);
      expect(props.localizacao).toBe('Estante B-05');
    });

    it('deve usar situação fornecida no DTO', () => {
      const createDTO = new LivroDTO({
        titulo: 'Livro Emprestado',
        isbn: '978-1-234-56789-0',
        autorId: 'autor-111',
        editoraId: 'editora-222',
        anoPublicacao: 2020,
        sinopse: 'Descrição',
        situacao: StatusLivro.EMPRESTADO,
        localizacao: 'Estante C-01',
      });

      const props = LivroAdapter.fromCreateDTO(createDTO);

      expect(props.situacao).toBe(StatusLivro.EMPRESTADO);
    });
  });

  describe('toDTOList', () => {
    it('deve serializar datas persistidas sem interromper a listagem', () => {
      const propsPersistidas: LivroInterface = {
        ...mockLivroProps,
        criadoEm: '2024-01-01T10:00:00Z',
        atualizadoEm: '2024-01-02T15:30:00Z',
      };
      const livros = [
        Livro.create(mockLivroProps, 'livro-1'),
        Livro.reconstitute('livro-2', propsPersistidas),
        Livro.create(propsPersistidas, 'livro-3'),
      ];

      const dtos = LivroAdapter.toDTOList(livros);

      expect(dtos).toHaveLength(3);
      expect(dtos.map((dto) => dto.id)).toEqual(['livro-1', 'livro-2', 'livro-3']);
      for (const livro of livros) {
        expect(livro.getCriadoEm()).toBe('2024-01-01T10:00:00.000Z');
        expect(livro.getAtualizadoEm()).toBe('2024-01-02T15:30:00.000Z');
      }
      for (const dto of dtos) {
        expect(dto).toBeInstanceOf(LivroDTO);
        expect(dto).not.toHaveProperty('criadoEm');
        expect(dto).not.toHaveProperty('atualizadoEm');
      }
    });

    it('deve converter lista de Livros para lista de DTOs', () => {
      const livros = [
        Livro.create(mockLivroProps, 'livro-1'),
        Livro.create({ ...mockLivroProps, titulo: 'Outro Livro' }, 'livro-2'),
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
