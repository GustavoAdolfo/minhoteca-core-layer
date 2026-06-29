import { PageDataType } from './pageData.type';

export interface UseCaseInterface {
  execute(data: unknown, idExecucao?: string): Promise<PageDataType>;
}
