import { Editora } from '../../entities/Editora';
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
});
