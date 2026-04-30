import { Editora } from '../../entities/Editora';
import { Entity } from '../../entities/Entity';
import { EditoraInterface } from '../../interfaces/editora.interface';

describe('Editora Entity', () => {
  it('deve criar uma nova editora', () => {
    const editoraProps = {
      nome: 'Editora Exemplo',
      pais: 'Brasil',
    } as unknown as EditoraInterface;

    const editora = Editora.create(editoraProps);

    expect(editora.getId()).toBeDefined();
    expect(editora.getNome().toString()).toBe(editoraProps.nome.toString());
    expect(editora.getPais()).toBe(editoraProps.pais);
  });

  it('deve reconstituir uma editora a partir de dados persistidos', () => {
    const editoraProps = {
      nome: 'Editora Persistida',
      pais: 'Portugal',
    } as unknown as EditoraInterface;

    const editora = Editora.reconstitute('editora-123', editoraProps);

    expect(editora.getId()).toBe('editora-123');
    expect(editora.getNome().toString()).toBe(editoraProps.nome.toString());
    expect(editora.getPais()).toBe(editoraProps.pais);
  });

  it('deve atualizar os dados da editora', () => {
    const editoraProps = {
      nome: 'Editora Original',
      pais: 'Brasil',
    } as unknown as EditoraInterface;

    const editora = Editora.create(editoraProps);

    // Atualizando nome e país
    editora.update({
      nome: 'Editora Atualizada',
      pais: 'Argentina',
    });

    expect(editora.getNome().toString()).toBe('Editora Atualizada');
    expect(editora.getPais()).toBe('Argentina');
  });

  it('deve manter os dados inalterados ao atualizar com campos parciais', () => {
    const editoraProps = {
      nome: 'Editora Parcial',
      pais: 'Brasil',
    } as unknown as EditoraInterface;

    const editora = Editora.create(editoraProps);

    // Atualizando apenas o país
    editora.update({
      pais: 'Chile',
      website: 'https://editora.example.com',
      logoUrl: 'https://editora.example.com/logo.png',
    });

    expect(editora.getNome().toString()).toBe('Editora Parcial');
    expect(editora.getPais()).toBe('Chile');
  });

  it('deve retornar JSON string com os dados da editora', () => {
    const editoraProps = {
      nome: 'Editora JSON',
      email: 'editora@example.com',
      website: 'https://editorajson.com',
      pais: 'Brasil',
      logoUrl: 'https://editorajson.com/logo.png',
    } as unknown as EditoraInterface;

    const editora = Editora.create(editoraProps);
    const jsonString = editora.toJSONString();

    const expectedJson = JSON.stringify({
      id: editora.getId(),
      nome: editoraProps.nome.toString(),
      email: editoraProps.email,
      website: editoraProps.website,
      pais: editoraProps.pais,
      logoUrl: editoraProps.logoUrl,
    });

    expect(jsonString).toBe(expectedJson);
  });

  it('deve retornar JSON string com os dados parciais', () => {
    const editoraProps = {
      nome: 'Editora JSON',
      website: 'https://editorajson.com',
      pais: 'Brasil',
    } as unknown as EditoraInterface;

    const editora = Editora.create(editoraProps);
    const jsonString = editora.toJSONString();

    const expectedJson = JSON.stringify({
      id: editora.getId(),
      nome: editoraProps.nome.toString(),
      website: editoraProps.website,
      pais: editoraProps.pais,
    });

    expect(jsonString).toBe(expectedJson);
  });

  it('deve atualizar editora com dados parciais, mantendo os campos opcionais inalterados', () => {
    const editoraProps = {
      nome: 'Editora Completa',
      email: null,
      website: 'https://editorajson.com',
      pais: 'Brasil',
      logoUrl: 'https://editorajson.com/logo.png',
    } as unknown as EditoraInterface;

    const editora = Editora.create(editoraProps);

    // Atualizando apenas o nome
    editora.update({
      nome: 'Editora Atualizada',
      email: 'editora@atualizada.com',
    });

    expect(editora.getNome().toString()).toBe('Editora Atualizada');
    expect(editora.getEmail()).toBe('editora@atualizada.com');
    expect(editora.getWebsite()).toBe('https://editorajson.com');
    expect(editora.getPais()).toBe('Brasil');
    expect(editora.getLogoUrl()).toBe('https://editorajson.com/logo.png');
  });

  it('deve retornar igualdade entre editoras com os mesmos dados', () => {
    const editoraProps = {
      nome: 'Editora Igual',
      pais: 'Brasil',
    } as unknown as EditoraInterface;

    const editora1 = Editora.create(editoraProps);
    const editora2 = Editora.reconstitute(editora1.getId(), editoraProps);

    expect(editora1.equals(editora2)).toBe(true);
  });

  it('deve retornar igualdade entre editoras com os mesmos dados incluindo website e logourl', () => {
    const editoraProps = {
      nome: 'Editora Igual',
      pais: 'Brasil',
      website: 'https://editoraigual.com',
      logoUrl: 'https://editoraigual.com/logo.png',
    } as unknown as EditoraInterface;

    const editora1 = Editora.create(editoraProps);
    const editora2 = Editora.create(editoraProps);

    expect(editora1.equals(editora2)).toBe(true);
  });

  it('deve retornar igualdade entre editoras com os mesmos dados incluindo email', () => {
    const editoraProps = {
      nome: 'Editora Igual',
      email: 'editora@igual.com',
      website: 'https://editoraigual.com',
      pais: 'Brasil',
      logoUrl: 'https://editoraigual.com/logo.png',
    } as unknown as EditoraInterface;

    const editora1 = Editora.create(editoraProps);
    const editora2 = Editora.reconstitute(editora1.getId(), editoraProps);

    expect(editora1.equals(editora2)).toBe(true);
  });

  it('deve retornar desigualdade entre editoras com dados diferentes', () => {
    const editora1 = Editora.create({
      nome: 'Editora A',
      pais: 'Brasil',
    } as unknown as EditoraInterface);

    const editora2 = Editora.create({
      nome: 'Editora B',
      pais: 'Portugal',
    } as unknown as EditoraInterface);

    expect(editora1.equals(editora2)).toBe(false);
  });

  it('deve retornar desigualdade entre editora e outro tipo de entidade', () => {
    const editora = Editora.create({
      nome: 'Editora A',
      pais: 'Brasil',
      email: null,
    } as unknown as EditoraInterface);

    const outraEntidade = {
      id: 'outra-entidade-123',
      nome: 'Outra Entidade',
      email: 'editora@exemplo.com',
    };

    expect(editora.equals(outraEntidade as unknown as Entity)).toBe(false);
  });

  it('deve retornar desigualdade entre editoras com emails diferentes', () => {
    const editora1 = Editora.create({
      nome: 'Editora Igual',
      email: 'editora1@email.com',
      pais: 'Brasil',
    } as unknown as EditoraInterface);

    const editora2 = Editora.create({
      nome: 'Editora Igual',
      email: 'editora2@email.com',
      pais: 'Brasil',
    } as unknown as EditoraInterface);

    expect(editora1.equals(editora2)).toBe(false);
  });

  it('deve retornar desigualdade quando this.email existe mas entity.email é undefined', () => {
    const editora1 = Editora.create({
      nome: 'Editora Igual',
      email: 'editora@email.com',
      pais: 'Brasil',
    } as unknown as EditoraInterface);

    const editora2 = Editora.create({
      nome: 'Editora Igual',
      pais: 'Brasil',
    } as unknown as EditoraInterface);

    expect(editora1.equals(editora2)).toBe(false);
  });

  it('deve retornar desigualdade quando this.email é undefined mas entity.email existe', () => {
    const editora1 = Editora.create({
      nome: 'Editora Igual',
      pais: 'Brasil',
      email: undefined,
    } as unknown as EditoraInterface);

    const editora2 = Editora.create({
      nome: 'Editora Igual',
      email: 'editora@email.com',
      pais: 'Brasil',
    } as unknown as EditoraInterface);

    expect(editora1.equals(editora2)).toBe(false);
  });

  it('deve retornar desigualdade quando this.logoUrl existe mas entity.logoUrl é undefined', () => {
    const editora1 = Editora.create({
      nome: 'Editora Igual',
      logoUrl: 'https://editora.com/logo.png',
      pais: 'Brasil',
    } as unknown as EditoraInterface);

    const editora2 = Editora.create({
      nome: 'Editora Igual',
      pais: 'Brasil',
    } as unknown as EditoraInterface);

    expect(editora1.equals(editora2)).toBe(false);
  });

  it('deve retornar desigualdade quando this.logoUrl é undefined mas entity.logoUrl existe', () => {
    const editora1 = Editora.create({
      nome: 'Editora Igual',
      pais: 'Brasil',
    } as unknown as EditoraInterface);

    const editora2 = Editora.create({
      nome: 'Editora Igual',
      logoUrl: 'https://editora.com/logo.png',
      pais: 'Brasil',
    } as unknown as EditoraInterface);

    expect(editora1.equals(editora2)).toBe(false);
  });

  it('deve manter email inalterado ao atualizar com email null', () => {
    const editora = Editora.create({
      nome: 'Editora Original',
      email: 'original@email.com',
      pais: 'Brasil',
    } as unknown as EditoraInterface);

    // Atualizando com email undefined - deve manter o email original
    editora.update({
      nome: 'Editora Atualizada',
      email: undefined,
    });

    expect(editora.getEmail()).toBe('original@email.com');
    expect(editora.getNome().toString()).toBe('Editora Atualizada');
  });

  it('deve exibir desigualdade quando entity email é undefined', () => {
    const editora = Editora.create({
      nome: 'Editora Original',
      email: 'original@email.com',
      pais: 'Brasil',
    } as unknown as EditoraInterface);

    const outraEditora = Editora.create({
      nome: 'Editora Original',
      pais: 'Brasil',
    } as unknown as EditoraInterface);
    outraEditora.removeEmail(); // forçando email como undefined

    expect(editora.equals(outraEditora)).toBe(false);
  });

  it('deve manter logoUrl inalterado ao atualizar com logoUrl null', () => {
    const editora = Editora.create({
      nome: 'Editora Original',
      logoUrl: 'https://editora.com/logo.png',
      pais: 'Brasil',
    } as unknown as EditoraInterface);

    // Atualizando com logoUrl undefined - deve manter o logoUrl original
    editora.update({
      nome: 'Editora Atualizada',
      logoUrl: undefined,
    });

    expect(editora.getLogoUrl()).toBe('https://editora.com/logo.png');
    expect(editora.getNome().toString()).toBe('Editora Atualizada');
  });

  it('deve manter email inalterado ao atualizar com email undefined', () => {
    const editora = Editora.create({
      nome: 'Editora Original',
      email: 'original@email.com',
      pais: 'Brasil',
    } as unknown as EditoraInterface);

    // Atualizando com email undefined - deve manter o email original
    editora.update({
      nome: 'Editora Atualizada',
    });

    expect(editora.getEmail()).toBe('original@email.com');
    expect(editora.getNome().toString()).toBe('Editora Atualizada');
  });
});
