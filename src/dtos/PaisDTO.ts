export class PaisDTO {
  bandeira: string;
  isoAlpha2: string;
  isoAlpha3: string;
  isoNumeric: number;
  nome: string;
  nomePortugues: string;

  constructor(data: object) {
    this.isoNumeric = Object.getOwnPropertyDescriptor(data, 'isoNumeric')?.value as number | 0;
    this.bandeira = Object.getOwnPropertyDescriptor(data, 'bandeira')?.value as string | '';
    this.isoAlpha2 = Object.getOwnPropertyDescriptor(data, 'isoAlpha2')?.value as string | '';
    this.isoAlpha3 = Object.getOwnPropertyDescriptor(data, 'isoAlpha3')?.value as string | '';
    this.nome = Object.getOwnPropertyDescriptor(data, 'nome')?.value as string | '';
    this.nomePortugues = Object.getOwnPropertyDescriptor(data, 'nomePortugues')?.value as
      | string
      | '';
  }

  toJSONString(): string {
    return JSON.stringify({
      isoNumeric: this.isoNumeric,
      bandeira: this.bandeira,
      isoAlpha2: this.isoAlpha2,
      isoAlpha3: this.isoAlpha3,
      nome: this.nome,
      nomePortugues: this.nomePortugues,
    });
  }
}
