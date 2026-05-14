import { AutorDTO } from '../../dtos/AutorDTO';
import { PaisDTO } from '../../dtos/PaisDTO';

describe('AutorDTO', () => {
  it('deve converter AutorDTO para um json válido', () => {
    const autorDTO = new AutorDTO({
      id: 'autor-123',
      nome: 'Autor Teste',
      pais: {
        nome: 'Brasil',
        nomePortugues: 'Brasil',
        isoAlpha3: 'BRA',
        isoAlpha2: 'BR',
        isoNumeric: 76,
        bandeira:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAUCAYAAACaq43EAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyRpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIF',
      } as PaisDTO,
      idPais: 76,
      totalLivros: 10,
      revisar: false,
    });

    const json = autorDTO.toJSONString();
    const content = JSON.parse(json);

    expect(content).toHaveProperty('id', 'autor-123');
    expect(content).toHaveProperty('nome', 'Autor Teste');
    expect(content).not.toHaveProperty('imagemPadrao');
    expect(content).not.toHaveProperty('imagemDispositivos');
    expect(content).not.toHaveProperty('urlReferencia');
    expect(content).toHaveProperty('pais');
    expect(content).toHaveProperty('idPais', 76);
    expect(content).toHaveProperty('totalLivros', 10);
    expect(content).toHaveProperty('revisar', false);
  });
});
