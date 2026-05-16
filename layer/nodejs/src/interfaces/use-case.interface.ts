import { PageDataType } from './pageData.type';

export interface UseCaseInterface {
  execute(data: unknown): Promise<PageDataType>;
}
