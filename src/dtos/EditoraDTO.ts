export class EditoraDTO {
  id?: string;
  nome?: string;
  email?: string;
  website?: string;
  pais?: string;
  logoUrl?: string;

  constructor(data: object) {
    this.id = Object.getOwnPropertyDescriptor(data, 'id')?.value ?? undefined;
    this.nome = Object.getOwnPropertyDescriptor(data, 'nome')?.value ?? undefined;
    this.email = Object.getOwnPropertyDescriptor(data, 'email')?.value ?? undefined;
    this.website = Object.getOwnPropertyDescriptor(data, 'website')?.value ?? undefined;
    this.pais = Object.getOwnPropertyDescriptor(data, 'pais')?.value ?? undefined;
    this.logoUrl = Object.getOwnPropertyDescriptor(data, 'logoUrl')?.value ?? undefined;
  }

  toJSONString(): string {
    return JSON.stringify({
      id: this.id,
      nome: this.nome,
      email: this.email,
      website: this.website,
      pais: this.pais,
      logoUrl: this.logoUrl,
    });
  }
}
