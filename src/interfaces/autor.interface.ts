export interface AutorInterface {
  id?: string;
  name: string;
  defaultPictureUrl?: string;
  mobilePictureUrl?: string;
  externalUrl?: string;
  countryName?: string;
  countryPortugueseName?: string;
  isoAlpha3?: string;
  countryId?: number;
  flag?: string;
  totalBooks?: number;
  reviewPending: boolean;
}
