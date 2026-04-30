import { EditoraDTO } from '../../dtos';

describe('EditoraDTO', () => {
  it('deve converter AutorDTO para um json válido', () => {
    const editoraDTO = new EditoraDTO({
      id: 'editora-123',
      nome: 'Editora Teste',
      email: 'teste@example.com',
      website: 'https://example.com',
      pais: 'Brasil',
      logoUrl: 'https://example.com/logo.png',
    });

    const json = editoraDTO.toJSONString();
    const content = JSON.parse(json);

    expect(content).toHaveProperty('id', 'editora-123');
    expect(content).toHaveProperty('nome', 'Editora Teste');
    expect(content).toHaveProperty('email', 'teste@example.com');
    expect(content).toHaveProperty('website', 'https://example.com');
    expect(content).toHaveProperty('pais', 'Brasil');
    expect(content).toHaveProperty('logoUrl', 'https://example.com/logo.png');
  });
});
