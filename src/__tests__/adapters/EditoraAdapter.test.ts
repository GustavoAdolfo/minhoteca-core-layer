import { EditoraAdapter } from '../../adapters/EditoraAdapter';
import { Editora } from '../../entities/Editora';
import { Nome } from '../../value-objects/Nome';
import { Email } from '../../value-objects/Email';
import { EditoraInterface } from '../../interfaces/editora.interface';
import { EditoraDTO } from '../../dtos/EditoraDTO';

describe('EditoraAdapter', () => {
  describe('toDTO', () => {
    it('deve converter Editora para EditoraDTO com todos os campos', () => {
      const editoraProps = {
        nome: 'Editora XYZ',
        email: 'contato@editoraxyz.com',
        website: 'https://editoraxyz.com',
        pais: 'Brasil',
      } as unknown as EditoraInterface;

      const editora = Editora.create(editoraProps, 'editora-123');
      const dto = EditoraAdapter.toDTO(editora);

      expect(dto).toHaveProperty('id', 'editora-123');
      expect(dto.nome).toBe(editoraProps.nome);
      expect(dto.email).toBe(editoraProps.email);
      expect(dto.website).toBe(editoraProps.website);
      expect(dto.pais).toBe(editoraProps.pais);
    });

    it('deve converter Editora para EditoraDTO com email undefined', () => {
      const editoraProps = {
        nome: 'Editora ABC',
        website: 'https://editoraabc.com',
        pais: 'Portugal',
      } as unknown as EditoraInterface;

      const editora = Editora.create(editoraProps, 'editora-456');
      const dto = EditoraAdapter.toDTO(editora);

      expect(dto).toEqual({
        id: 'editora-456',
        nome: 'Editora ABC',
        email: undefined,
        website: 'https://editoraabc.com',
        pais: 'Portugal',
      });
    });

    it('deve converter Editora para EditoraDTO com campos opcionais undefined', () => {
      const editoraProps = {
        nome: 'Editora Simples',
        pais: 'Brasil',
      } as unknown as EditoraInterface;

      const editora = Editora.create(editoraProps, 'editora-789');
      const dto = EditoraAdapter.toDTO(editora);

      expect(dto).toEqual({
        id: 'editora-789',
        nome: 'Editora Simples',
        email: undefined,
        website: undefined,
        pais: 'Brasil',
      });
    });
  });

  describe('fromCreateDTO', () => {
    it('deve converter CriarEditoraDTO para EditoraProps com todos os campos', () => {
      const dto = new EditoraDTO({
        nome: 'Nova Editora',
        email: 'contato@novaeditora.com',
        website: 'https://novaeditora.com',
        pais: 'Brasil',
      });

      const props = EditoraAdapter.fromCreateDTO(dto);

      expect(props.nome).toBeInstanceOf(Nome);
      expect(props.nome.toString()).toBe('Nova Editora');
      expect(props.email).toBeInstanceOf(Email);
      expect(props.email?.toString()).toBe('contato@novaeditora.com');
      expect(props.website).toBe('https://novaeditora.com');
      expect(props.pais).toBe('Brasil');
    });

    it('deve converter CriarEditoraDTO para EditoraProps com email undefined', () => {
      const dto = new EditoraDTO({
        nome: 'Editora Sem Email',
        website: 'https://semmail.com',
        pais: 'Portugal',
      });
      const props = EditoraAdapter.fromCreateDTO(dto);

      expect(props.nome).toBeInstanceOf(Nome);
      expect(props.nome.toString()).toBe('Editora Sem Email');
      expect(props.email).toBeUndefined();
      expect(props.website).toBe('https://semmail.com');
      expect(props.pais).toBe('Portugal');
    });

    it('deve converter CriarEditoraDTO para Editora apenas com campos obrigatórios', () => {
      const dto = new EditoraDTO({
        nome: 'Editora Mínima',
      });

      const props = EditoraAdapter.fromCreateDTO(dto);

      expect(props.nome).toBeInstanceOf(Nome);
      expect(props.nome.toString()).toBe('Editora Mínima');
      expect(props.email).toBeUndefined();
      expect(props.website).toBeUndefined();
      expect(props.pais).toBeUndefined();
    });
  });

  describe('toDTOList', () => {
    it('deve converter lista de Editoras para lista de DTOs', () => {
      const editoras = [
        Editora.create(
          {
            nome: 'Editora 1',
            email: 'editora1@test.com',
            pais: 'Brasil',
          } as unknown as EditoraInterface,
          'id-1'
        ),
        Editora.create(
          {
            nome: 'Editora 2',
            website: 'https://editora2.com',
            pais: 'Portugal',
          } as unknown as EditoraInterface,
          'id-2'
        ),
        Editora.create(
          {
            nome: 'Editora 3',
            pais: 'Espanha',
          } as unknown as EditoraInterface,
          'id-3'
        ),
      ];

      const dtos = EditoraAdapter.toDTOList(editoras);

      expect(dtos).toHaveLength(3);
      expect(dtos[0]).toEqual({
        id: 'id-1',
        nome: 'Editora 1',
        email: 'editora1@test.com',
        website: undefined,
        pais: 'Brasil',
      });
      expect(dtos[1]).toEqual({
        id: 'id-2',
        nome: 'Editora 2',
        email: undefined,
        website: 'https://editora2.com',
        pais: 'Portugal',
      });
      expect(dtos[2]).toEqual({
        id: 'id-3',
        nome: 'Editora 3',
        email: undefined,
        website: undefined,
        pais: 'Espanha',
      });
    });

    it('deve retornar lista vazia quando recebe array vazio', () => {
      const dtos = EditoraAdapter.toDTOList([]);

      expect(dtos).toEqual([]);
      expect(dtos).toHaveLength(0);
    });
  });
});
