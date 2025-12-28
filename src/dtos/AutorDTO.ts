export class AutorDTO {
  id?: string;
  name?: string;
  defaultPictureUrl?: string;
  mobilePictureUrl?: string;
  externalUrl?: string;
  countryName?: string;
  countryPortugueseName?: string;
  isoAlpha3?: string;
  countryId?: number;
  flag?: string;
  totalBooks: number = 0;
  reviewPending: boolean = false;

  constructor(data: object) {
    this.id = Object.getOwnPropertyDescriptor(data, 'id')?.value as string | undefined;
    this.name = Object.getOwnPropertyDescriptor(data, 'name')?.value as string | undefined;
    this.defaultPictureUrl = Object.getOwnPropertyDescriptor(data, 'defaultPictureUrl')?.value as
      | string
      | undefined;
    this.mobilePictureUrl = Object.getOwnPropertyDescriptor(data, 'mobilePictureUrl')?.value as
      | string
      | undefined;
    this.externalUrl = Object.getOwnPropertyDescriptor(data, 'externalUrl')?.value as
      | string
      | undefined;
    this.countryName = Object.getOwnPropertyDescriptor(data, 'countryName')?.value as
      | string
      | undefined;
    this.countryPortugueseName = Object.getOwnPropertyDescriptor(data, 'countryPortugueseName')
      ?.value as string | undefined;
    this.isoAlpha3 = Object.getOwnPropertyDescriptor(data, 'isoAlpha3')?.value as
      | string
      | undefined;
    this.countryId = Object.getOwnPropertyDescriptor(data, 'countryId')?.value as
      | number
      | undefined;
    this.flag = Object.getOwnPropertyDescriptor(data, 'flag')?.value as string | undefined;
    this.totalBooks =
      (Object.getOwnPropertyDescriptor(data, 'totalBooks')?.value as number | undefined) ?? 0;
    this.reviewPending =
      (Object.getOwnPropertyDescriptor(data, 'reviewPending')?.value as boolean | undefined) ??
      false;
  }

  toString(): string {
    return JSON.stringify({
      id: this.id,
      name: this.name,
      defaultPictureUrl: this.defaultPictureUrl,
      mobilePictureUrl: this.mobilePictureUrl,
      externalUrl: this.externalUrl,
      countryName: this.countryName,
      countryPortugueseName: this.countryPortugueseName,
      isoAlpha3: this.isoAlpha3,
      countryId: this.countryId,
      flag: this.flag,
      totalBooks: this.totalBooks,
      reviewPending: this.reviewPending,
    });
  }
}
