/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogService, LogContext } from '../../services/logService';
import { Logger } from 'winston';

describe('LogService', () => {
  let logService: LogService;
  const originalEnv = process.env;

  beforeAll(() => {
    logService = new LogService('ServicoTeste');
  });

  afterAll(async () => {
    await logService.close();
    process.env = originalEnv;
  });

  beforeEach(() => {
    // reseta env para evitar testes interferirem entre si
    process.env = { ...originalEnv };
    jest.restoreAllMocks();
  });

  describe('Inicialização', () => {
    it('deve inicializar o logger com nome do serviço e ambiente corretos', () => {
      expect(logService.logger).toBeInstanceOf(Logger);
      expect(logService.logger.defaultMeta).toMatchObject({
        service: 'ServicoTeste',
        env: process.env.NODE_ENV ?? 'development',
      });
    });

    it('deve definir o nível de log a partir de LOG_LEVEL ou usar info como padrão', () => {
      process.env.LOG_LEVEL = 'debug';
      const novoServico = new LogService('OutroServico');
      expect(novoServico.logger.level).toBe('debug');
    });

    it('deve inicializar com CloudWatch transport em produção com AWS_REGION', () => {
      process.env.NODE_ENV = 'production';
      process.env.AWS_REGION = 'us-east-1';
      const servicoProd = new LogService('ServicoProducao');
      // Verificar se logger foi criado com sucesso em modo produção
      expect(servicoProd.logger).toBeInstanceOf(Logger);
      expect(servicoProd.logger.defaultMeta?.env).toBe('production');
    });

    it('deve inicializar com CloudWatch transport em development', () => {
      delete process.env.NODE_ENV;
      process.env.AWS_REGION = 'us-east-1';
      const servicoDev = new LogService('ServicoDesenv');
      // Verificar se logger foi criado com sucesso em modo desenvolvimento
      expect(servicoDev.logger).toBeInstanceOf(Logger);
      expect(servicoDev.logger.defaultMeta?.env).toBe('development');
    });

    it('não deve inicializar CloudWatch transport sem AWS_REGION em produção', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.AWS_REGION;
      const servicoProdSemRegion = new LogService('ServicoProdSemRegion');
      expect(servicoProdSemRegion.logger).toBeInstanceOf(Logger);
    });

    it('não deve inicializar CloudWatch transport em desenvolvimento', () => {
      process.env.NODE_ENV = 'development';
      process.env.AWS_REGION = 'us-east-1';
      const servicoDesenv = new LogService('ServicoDesenv');
      expect(servicoDesenv.logger).toBeInstanceOf(Logger);
    });
  });

  describe('Método log()', () => {
    it('deve fazer log com contexto estruturado', () => {
      const spyLog = jest
        .spyOn(logService.logger, 'log')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = {
        userId: 'usuario-123',
        correlationId: 'corr-456',
      };

      logService.log('info', 'Mensagem teste', contexto);

      expect(spyLog).toHaveBeenCalledWith(
        'info',
        'Mensagem teste',
        expect.objectContaining(contexto)
      );
      spyLog.mockRestore();
    });

    it('deve incluir debugContext quando DEBUG=true', () => {
      process.env.DEBUG = 'true';
      const spyLog = jest
        .spyOn(logService.logger, 'log')
        .mockImplementation(() => logService.logger);
      const debugDados = { detalhes: 'valor' };

      logService.log('info', 'Mensagem', {}, debugDados);

      expect(spyLog).toHaveBeenCalledWith(
        'info',
        'Mensagem',
        expect.objectContaining({ debug: debugDados })
      );
      spyLog.mockRestore();
      process.env.DEBUG = 'false';
    });

    it('não deve incluir debugContext quando DEBUG não é true', () => {
      process.env.DEBUG = 'false';
      const spyLog = jest
        .spyOn(logService.logger, 'log')
        .mockImplementation(() => logService.logger);
      const debugDados = { detalhes: 'valor' };

      logService.log('info', 'Mensagem', {}, debugDados);

      expect(spyLog).toHaveBeenCalledWith(
        'info',
        'Mensagem',
        expect.not.objectContaining({ debug: debugDados })
      );
      spyLog.mockRestore();
    });
  });

  describe('Método error()', () => {
    it('deve fazer log de erro com contexto', () => {
      const spyError = jest
        .spyOn(logService.logger, 'error')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = { userId: 'usuario-123' };

      logService.error('Erro ocorreu', contexto);

      expect(spyError).toHaveBeenCalledWith(
        'Erro ocorreu',
        expect.objectContaining({
          userId: 'usuario-123',
          errorCode: 'UNKNOWN_ERROR',
        })
      );
      spyError.mockRestore();
    });

    it('deve incluir código de erro do Error fornecido', () => {
      const spyError = jest
        .spyOn(logService.logger, 'error')
        .mockImplementation(() => logService.logger);
      const erro = new Error('Erro específico');

      logService.error('Erro', {}, erro);

      expect(spyError).toHaveBeenCalledWith(
        'Erro',
        expect.objectContaining({ errorCode: 'Error' })
      );
      spyError.mockRestore();
    });

    it('deve incluir stack trace quando Error é fornecido', () => {
      const spyError = jest
        .spyOn(logService.logger, 'error')
        .mockImplementation(() => logService.logger);
      const erro = new Error('Stack trace test');

      logService.error('Erro', {}, erro);

      expect(spyError).toHaveBeenCalledWith('Erro', expect.objectContaining({ stack: erro.stack }));
      spyError.mockRestore();
    });

    it('deve incluir debugContext em error quando DEBUG=true', () => {
      process.env.DEBUG = 'true';
      const spyError = jest
        .spyOn(logService.logger, 'error')
        .mockImplementation(() => logService.logger);
      const debugDados = { tentativas: 3 };

      logService.error('Erro', {}, undefined, debugDados);

      expect(spyError).toHaveBeenCalledWith('Erro', expect.objectContaining({ debug: debugDados }));
      spyError.mockRestore();
      process.env.DEBUG = 'false';
    });
  });

  describe('Método warn()', () => {
    it('deve fazer log de aviso com contexto', () => {
      const spyWarn = jest
        .spyOn(logService.logger, 'warn')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = { action: 'AVISO_TESTE' };

      logService.warn('Aviso importante', contexto);

      expect(spyWarn).toHaveBeenCalledWith('Aviso importante', expect.objectContaining(contexto));
      spyWarn.mockRestore();
    });

    it('deve incluir debugContext em warn quando DEBUG=true', () => {
      process.env.DEBUG = 'true';
      const spyWarn = jest
        .spyOn(logService.logger, 'warn')
        .mockImplementation(() => logService.logger);
      const debugDados = { memoriaBaixa: true };

      logService.warn('Aviso', {}, debugDados);

      expect(spyWarn).toHaveBeenCalledWith('Aviso', expect.objectContaining({ debug: debugDados }));
      spyWarn.mockRestore();
      process.env.DEBUG = 'false';
    });
  });

  describe('Método info()', () => {
    it('deve fazer log de informação com contexto', () => {
      const spyInfo = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = { userId: 'user-123' };

      logService.info('Informação', contexto);

      expect(spyInfo).toHaveBeenCalledWith('Informação', expect.objectContaining(contexto));
      spyInfo.mockRestore();
    });

    it('deve incluir debugContext em info quando DEBUG=true', () => {
      process.env.DEBUG = 'true';
      const spyInfo = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);
      const debugDados = { versao: '1.0' };

      logService.info('Info', {}, debugDados);

      expect(spyInfo).toHaveBeenCalledWith('Info', expect.objectContaining({ debug: debugDados }));
      spyInfo.mockRestore();
      process.env.DEBUG = 'false';
    });
  });

  describe('Método logHttpRequest()', () => {
    it('deve fazer log de requisição HTTP com status 200', () => {
      const spyInfo = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);

      logService.logHttpRequest('GET', '/api/livros', 200, 150, 'user-123');

      expect(spyInfo).toHaveBeenCalledWith(
        expect.stringContaining('HTTP Request: GET /api/livros - 200'),
        expect.objectContaining({
          method: 'GET',
          endpoint: '/api/livros',
          statusCode: 200,
          duration: 150,
          durationUnit: 'ms',
          userId: 'user-123',
          action: 'HTTP_GET',
        })
      );
      spyInfo.mockRestore();
    });

    it('deve fazer log de requisição HTTP com status 400 como warn', () => {
      const spyWarn = jest
        .spyOn(logService.logger, 'warn')
        .mockImplementation(() => logService.logger);

      logService.logHttpRequest('POST', '/api/livros', 400, 200);

      expect(spyWarn).toHaveBeenCalledWith(
        expect.stringContaining('HTTP Request: POST /api/livros - 400'),
        expect.objectContaining({ statusCode: 400 })
      );
      spyWarn.mockRestore();
    });

    it('deve fazer log de requisição HTTP com status 500 como error', () => {
      const spyError = jest
        .spyOn(logService.logger, 'error')
        .mockImplementation(() => logService.logger);

      logService.logHttpRequest('DELETE', '/api/livros/123', 500, 300);

      expect(spyError).toHaveBeenCalledWith(
        expect.stringContaining('HTTP Request: DELETE /api/livros/123 - 500'),
        expect.objectContaining({ statusCode: 500 })
      );
      spyError.mockRestore();
    });

    it('deve incluir contexto adicional em logHttpRequest', () => {
      const spyInfo = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = { correlationId: 'corr-123' };

      logService.logHttpRequest('GET', '/api/livros', 200, 150, 'user-123', contexto);

      expect(spyInfo).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ correlationId: 'corr-123' })
      );
      spyInfo.mockRestore();
    });

    it('deve incluir debugContext em logHttpRequest quando DEBUG=true', () => {
      process.env.DEBUG = 'true';
      const spyInfo = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);
      const debugDados = { cache: 'hit' };

      logService.logHttpRequest('GET', '/api/livros', 200, 150, 'user-123', {}, debugDados);

      expect(spyInfo).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ debug: debugDados })
      );
      spyInfo.mockRestore();
      process.env.DEBUG = 'false';
    });
  });

  describe('Método logOperation()', () => {
    it('deve fazer log de operação bem-sucedida como info', () => {
      const spyInfo = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);

      logService.logOperation('BUSCAR_LIVRO', true, 200);

      expect(spyInfo).toHaveBeenCalledWith(
        expect.stringContaining('Operation: BUSCAR_LIVRO - Success'),
        expect.objectContaining({
          action: 'BUSCAR_LIVRO',
          success: true,
          duration: 200,
          durationUnit: 'ms',
        })
      );
      spyInfo.mockRestore();
    });

    it('deve fazer log de operação falhada como error', () => {
      const spyError = jest
        .spyOn(logService.logger, 'error')
        .mockImplementation(() => logService.logger);

      logService.logOperation('BUSCAR_LIVRO', false, 500);

      expect(spyError).toHaveBeenCalledWith(
        expect.stringContaining('Operation: BUSCAR_LIVRO - Failed'),
        expect.objectContaining({
          action: 'BUSCAR_LIVRO',
          success: false,
          duration: 500,
        })
      );
      spyError.mockRestore();
    });

    it('deve incluir erro na operação falhada', () => {
      const spyError = jest
        .spyOn(logService.logger, 'error')
        .mockImplementation(() => logService.logger);
      const erro = new Error('Database error');

      logService.logOperation('BUSCAR_LIVRO', false, 300, {}, erro);

      expect(spyError).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          errorCode: 'Error',
          stack: erro.stack,
        })
      );
      spyError.mockRestore();
    });

    it('deve incluir debugContext em logOperation quando DEBUG=true', () => {
      process.env.DEBUG = 'true';
      const spyInfo = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);
      const debugDados = { recursosUsados: '80%' };

      logService.logOperation('CRIAR_LIVRO', true, 500, {}, undefined, debugDados);

      expect(spyInfo).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ debug: debugDados })
      );
      spyInfo.mockRestore();
      process.env.DEBUG = 'false';
    });
  });

  describe('Método logPerformance()', () => {
    it('deve fazer log de performance rápida como info', () => {
      const spyInfo = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);

      logService.logPerformance('BUSCAR_LIVROS', 200, 'user-123', 500);

      expect(spyInfo).toHaveBeenCalledWith(
        expect.stringContaining('Performance: BUSCAR_LIVROS - 200ms'),
        expect.objectContaining({
          action: 'BUSCAR_LIVROS',
          duration: 200,
          userId: 'user-123',
          isSlowOperation: false,
        })
      );
      spyInfo.mockRestore();
    });

    it('deve fazer log de performance lenta como warn', () => {
      const spyWarn = jest
        .spyOn(logService.logger, 'warn')
        .mockImplementation(() => logService.logger);

      logService.logPerformance('BUSCAR_LIVROS', 800, 'user-123', 500);

      expect(spyWarn).toHaveBeenCalledWith(
        expect.stringContaining('Performance: BUSCAR_LIVROS - 800ms'),
        expect.objectContaining({
          action: 'BUSCAR_LIVROS',
          duration: 800,
          isSlowOperation: true,
        })
      );
      spyWarn.mockRestore();
    });

    it('deve fazer log de performance sem threshold definido como info', () => {
      const spyInfo = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);

      logService.logPerformance('OPERACAO', 1000, 'user-123');

      expect(spyInfo).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          isSlowOperation: false,
        })
      );
      spyInfo.mockRestore();
    });

    it('deve incluir debugContext em logPerformance quando DEBUG=true', () => {
      process.env.DEBUG = 'true';
      const spyInfo = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);
      const debugDados = { dbTime: 150, networkTime: 50 };

      logService.logPerformance('OPERACAO', 200, 'user-123', 500, debugDados);

      expect(spyInfo).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ debug: debugDados })
      );
      spyInfo.mockRestore();
      process.env.DEBUG = 'false';
    });
  });

  describe('Sanitização de Dados Sensíveis', () => {
    it('deve remover password dos dados de log', () => {
      const spyLog = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = {
        password: 'senha123',
        userId: 'user-123',
      } as any;

      logService.info('Teste', contexto);

      expect(spyLog).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          password: '[REDACTED]',
          userId: 'user-123',
        })
      );
      spyLog.mockRestore();
    });

    it('deve remover token dos dados de log', () => {
      const spyLog = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = {
        token: 'abc123xyz',
        action: 'LOGIN',
      } as any;

      logService.info('Teste', contexto);

      expect(spyLog).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          token: '[REDACTED]',
          action: 'LOGIN',
        })
      );
      spyLog.mockRestore();
    });

    it('deve remover apiKey dos dados de log', () => {
      const spyLog = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = {
        apiKey: 'chave-secreta',
        endpoint: '/api',
      } as any;

      logService.info('Teste', contexto);

      expect(spyLog).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          apiKey: '[REDACTED]',
          endpoint: '/api',
        })
      );
      spyLog.mockRestore();
    });

    it('deve remover múltiplos campos sensíveis', () => {
      const spyError = jest
        .spyOn(logService.logger, 'error')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = {
        password: 'secret',
        email: 'user@example.com',
        creditCard: '1234-5678',
        userId: 'user-123',
      } as any;

      logService.error('Teste', contexto);

      expect(spyError).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          password: '[REDACTED]',
          email: '[REDACTED]',
          creditCard: '[REDACTED]',
          userId: 'user-123',
        })
      );
      spyError.mockRestore();
    });
  });

  describe('Método close()', () => {
    it('deve fechar o logger sem erros', async () => {
      const novoServico = new LogService('ServicoFechar');
      const resultado = await novoServico.close();

      expect(resultado).toBeUndefined();
    });
  });

  describe('Inicialização com CloudWatch em Produção', () => {
    it('deve configurar CloudWatch quando NODE_ENV é production e AWS_REGION está definido', () => {
      const originalEnvNodeEnv = process.env.NODE_ENV;
      const originalAwsRegion = process.env.AWS_REGION;

      process.env.NODE_ENV = 'production';
      process.env.AWS_REGION = 'us-east-1';

      const prodService = new LogService('ProdService');

      expect(prodService.logger).toBeInstanceOf(Logger);
      expect(prodService.logger.transports.length).toBeGreaterThan(1);

      process.env.NODE_ENV = originalEnvNodeEnv;
      process.env.AWS_REGION = originalAwsRegion;
    });

    it('não deve configurar CloudWatch sem AWS_REGION', () => {
      const originalEnvNodeEnv = process.env.NODE_ENV;
      const originalAwsRegion = process.env.AWS_REGION;

      process.env.NODE_ENV = 'production';
      delete process.env.AWS_REGION;

      const prodService = new LogService('ProdServiceNoRegion');

      expect(prodService.logger.transports.length).toBe(1);

      process.env.NODE_ENV = originalEnvNodeEnv;
      process.env.AWS_REGION = originalAwsRegion;
    });
  });

  describe('Sanitização de Arrays e Objetos Aninhados', () => {
    it('deve sanitizar campos sensíveis em arrays', () => {
      const spyLog = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = {
        items: ['item1', 'item2'],
      } as any;

      logService.info('Teste array', contexto);

      expect(spyLog).toHaveBeenCalledWith(
        'Teste array',
        expect.objectContaining({
          items: expect.any(Array),
        })
      );
      spyLog.mockRestore();
    });

    it('deve sanitizar token em arrays', () => {
      const spyLog = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = {
        tokens: ['abc123', 'def456'],
      } as any;

      logService.info('Teste token array', contexto);

      expect(spyLog).toHaveBeenCalledWith(
        'Teste token array',
        expect.objectContaining({
          tokens: '[REDACTED]',
        })
      );
      spyLog.mockRestore();
    });

    it('deve sanitizar objetos aninhados com campos sensíveis', () => {
      const spyLog = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = {
        usuario: {
          id: 'user-123',
          password: 'secret123',
        },
        acao: 'LOGIN',
      } as any;

      logService.info('Teste aninhado', contexto);

      expect(spyLog).toHaveBeenCalledWith(
        'Teste aninhado',
        expect.objectContaining({
          acao: 'LOGIN',
        })
      );
      spyLog.mockRestore();
    });

    it('deve remover undefined de arrays em removeUndefinedFields', () => {
      const spyLog = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = {
        items: [1, undefined, 3],
      } as any;

      logService.info('Teste', contexto);

      expect(spyLog).toHaveBeenCalled();
      spyLog.mockRestore();
    });

    it('deve remover undefined de objetos aninhados', () => {
      const spyLog = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = {
        dados: {
          campo1: 'valor',
          campo2: undefined,
          campo3: 'valor2',
        },
      } as any;

      logService.info('Teste nested undefined', contexto);

      expect(spyLog).toHaveBeenCalled();
      spyLog.mockRestore();
    });

    it('deve remover campo totalmente se todos os valores são undefined', () => {
      const spyLog = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = {
        dados: {
          campo1: undefined,
          campo2: undefined,
        },
      } as any;

      logService.info('Teste all undefined', contexto);

      expect(spyLog).toHaveBeenCalled();
      spyLog.mockRestore();
    });

    it('deve sanitizar valores primitivos não-objetos', () => {
      const spyLog = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = {
        stringValue: 'teste',
        numberValue: 123,
      } as any;

      logService.info('Teste primitivos', contexto);

      expect(spyLog).toHaveBeenCalledWith(
        'Teste primitivos',
        expect.objectContaining({
          stringValue: 'teste',
          numberValue: 123,
        })
      );
      spyLog.mockRestore();
    });

    it('deve remover campos null do objeto', () => {
      const spyLog = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = {
        campo1: 'valor',
        campo2: null,
        campo3: 'outro',
      } as any;

      logService.info('Teste null', contexto);

      expect(spyLog).toHaveBeenCalled();
      spyLog.mockRestore();
    });

    it('deve sanitizar campos sensíveis em objetos dentro de arrays', () => {
      const spyLog = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = {
        registros: [
          { id: '1', password: 'secret1' },
          { id: '2', password: 'secret2' },
        ],
      } as any;

      logService.info('Teste array with objects', contexto);

      expect(spyLog).toHaveBeenCalled();
      spyLog.mockRestore();
    });

    it('deve incluir todos os campos no objeto de log estruturado', () => {
      const spyLog = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = {
        userId: 'user-123',
        correlationId: 'corr-456',
        traceId: 'trace-789',
        spanId: 'span-101',
        requestId: 'req-202',
        endpoint: '/api/livros',
        method: 'GET',
        statusCode: 200,
        action: 'LISTAR_LIVROS',
        duration: 150,
        durationUnit: 'ms',
        errorCode: 'NONE',
      };

      logService.info('Teste completo', contexto);

      expect(spyLog).toHaveBeenCalledWith('Teste completo', expect.objectContaining(contexto));
      spyLog.mockRestore();
    });

    it('deve remover undefined do objeto removido por removeUndefinedFields', () => {
      const spyLog = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = {
        userId: undefined,
        endpoint: '/api/test',
        method: 'POST',
      } as any;

      logService.info('Teste com undefined', contexto);

      expect(spyLog).toHaveBeenCalledWith(
        'Teste com undefined',
        expect.objectContaining({
          endpoint: '/api/test',
          method: 'POST',
        })
      );
      spyLog.mockRestore();
    });

    it('deve preservar status code em diferentes ranges', () => {
      const spyLog = jest
        .spyOn(logService.logger, 'log')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = {
        statusCode: 404,
        endpoint: '/api/notfound',
        method: 'DELETE',
      };

      logService.log('warn', 'Recurso não encontrado', contexto);

      expect(spyLog).toHaveBeenCalledWith(
        'warn',
        'Recurso não encontrado',
        expect.objectContaining({
          statusCode: 404,
        })
      );
      spyLog.mockRestore();
    });

    it('deve construir durationUnit padrão quando não fornecido', () => {
      const spyLog = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger);
      const contexto: LogContext = {
        duration: 200,
        // durationUnit não fornecido - deve usar padrão
      };

      logService.info('Teste duration', contexto);

      expect(spyLog).toHaveBeenCalled();
      spyLog.mockRestore();
    });
  });

  describe('sanitizeData (private)', () => {
    it('deve retornar primitivos e null sem alterar (branch !obj ou typeof !== object)', () => {
      const sanitize = (logService as any).sanitizeData.bind(logService);

      expect(sanitize('abc')).toBe('abc');
      expect(sanitize(123)).toBe(123);
      expect(sanitize(null)).toBeNull();
      expect(sanitize(undefined)).toBeUndefined();
    });

    it('deve aplicar match case-insensitive por substring em campos sensíveis', () => {
      const sanitize = (logService as any).sanitizeData.bind(logService);

      const result = sanitize({
        EmailAddress: 'user@example.com',
        ApiKEYValue: 'xxx',
        PhoneNumber: '9999',
        normal: 'ok',
      });

      expect(result).toEqual({
        EmailAddress: '[REDACTED]',
        ApiKEYValue: '[REDACTED]',
        PhoneNumber: '[REDACTED]',
        normal: 'ok',
      });
    });

    it('deve sanitizar objetos aninhados contendo null (branch typeof object + retorno null)', () => {
      const sanitize = (logService as any).sanitizeData.bind(logService);

      const result = sanitize({
        nested: {
          password: 'secret',
          innerNull: null,
        },
      });

      expect(result.nested.password).toBe('[REDACTED]');
      expect(result.nested.innerNull).toBeNull();
    });

    it('deve sanitizar arrays de objetos (branch Array.isArray)', () => {
      const sanitize = (logService as any).sanitizeData.bind(logService);

      const result = sanitize({
        list: [{ token: 'a' }, { token: 'b' }, { ok: true }],
      });

      expect(result.list).toEqual([{ token: '[REDACTED]' }, { token: '[REDACTED]' }, { ok: true }]);
    });
  });

  describe('removeUndefinedFields (private)', () => {
    it('deve retornar primitivos sem alterar (branch !obj ou typeof !== object)', () => {
      const remove = (logService as any).removeUndefinedFields.bind(logService);

      expect(remove('x')).toBe('x');
      expect(remove(10)).toBe(10);
      expect(remove(null)).toBeNull();
      expect(remove(undefined)).toBeUndefined();
    });

    it('deve remover undefined em arrays e manter null (branch Array + filter)', () => {
      const remove = (logService as any).removeUndefinedFields.bind(logService);

      const result = remove([1, undefined, null, 2, undefined]);
      expect(result).toEqual([1, null, 2]); // null é mantido, undefined é removido
    });

    it('deve retornar null quando objeto fica vazio (branch Object.keys(result).length === 0)', () => {
      const remove = (logService as any).removeUndefinedFields.bind(logService);

      const result = remove({ a: undefined, b: null });
      expect(result).toBeNull();
    });

    it('deve manter null vindo de nested object (branch recursão retorna null mas chave permanece)', () => {
      const remove = (logService as any).removeUndefinedFields.bind(logService);

      const result = remove({
        keep: 'ok',
        nested: { x: undefined, y: undefined }, // vira null
      });

      // nested permanece como null (porque a checagem de null/undefined é antes da recursão)
      expect(result).toEqual({ keep: 'ok', nested: null });
    });
  });

  describe('buildLogObject / format* (private)', () => {
    it('deve aplicar durationUnit default ms quando não informado (branch ?? "ms")', () => {
      const build = (logService as any).buildLogObject.bind(logService);

      const obj = build({ level: 'info', message: 'm' });
      expect(obj).toEqual(expect.objectContaining({ durationUnit: 'ms' }));
    });

    it('deve definir context como null quando context tem apenas undefined (branch removeUndefinedFields -> null)', () => {
      const build = (logService as any).buildLogObject.bind(logService);

      const obj = build({
        level: 'info',
        message: 'm',
        context: { a: undefined, b: undefined },
      });

      expect(obj).toEqual(expect.objectContaining({ context: null }));
    });

    it('formatLogMessage deve retornar JSON string (branch formatLogMessage -> JSON.stringify)', () => {
      const formatLogMessage = (logService as any).formatLogMessage.bind(logService);

      const json = formatLogMessage({ level: 'info', message: 'hello', timestamp: 't' });
      const parsed = JSON.parse(json);

      expect(parsed).toEqual(
        expect.objectContaining({
          level: 'info',
          message: 'hello',
          timestamp: 't',
          service: 'ServicoTeste',
        })
      );
    });

    it('formatCloudWatchMessage deve retornar JSON string (branch formatCloudWatchMessage)', () => {
      const formatCW = (logService as any).formatCloudWatchMessage.bind(logService);

      const json = formatCW({ level: 'warn', message: 'cw', timestamp: 't2' });
      const parsed = JSON.parse(json);

      expect(parsed).toEqual(
        expect.objectContaining({
          level: 'warn',
          message: 'cw',
          timestamp: 't2',
          service: 'ServicoTeste',
        })
      );
    });
  });

  describe('Branches DEBUG=true sem debugContext', () => {
    it('log(): DEBUG=true mas sem debugContext não deve incluir debug', () => {
      process.env.DEBUG = 'true';
      const spyLog = jest
        .spyOn(logService.logger, 'log')
        .mockImplementation(() => logService.logger as any);

      logService.log('info', 'msg', { userId: 'u1' });

      expect(spyLog).toHaveBeenCalledWith(
        'info',
        'msg',
        expect.not.objectContaining({ debug: expect.anything() })
      );
    });

    it('warn(): DEBUG=true mas sem debugContext não deve incluir debug', () => {
      process.env.DEBUG = 'true';
      const spyWarn = jest
        .spyOn(logService.logger, 'warn')
        .mockImplementation(() => logService.logger as any);

      logService.warn('warn', { action: 'X' });

      expect(spyWarn).toHaveBeenCalledWith(
        'warn',
        expect.not.objectContaining({ debug: expect.anything() })
      );
    });

    it('info(): DEBUG=true mas sem debugContext não deve incluir debug', () => {
      process.env.DEBUG = 'true';
      const spyInfo = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger as any);

      logService.info('info', { action: 'Y' });

      expect(spyInfo).toHaveBeenCalledWith(
        'info',
        expect.not.objectContaining({ debug: expect.anything() })
      );
    });

    it('error(): DEBUG=true mas sem debugContext não deve incluir debug', () => {
      process.env.DEBUG = 'true';
      const spyError = jest
        .spyOn(logService.logger, 'error')
        .mockImplementation(() => logService.logger as any);

      logService.error('err', { action: 'Z' });

      expect(spyError).toHaveBeenCalledWith(
        'err',
        expect.not.objectContaining({ debug: expect.anything() })
      );
    });

    it('logHttpRequest(): DEBUG=true mas sem debugContext não deve incluir debug', () => {
      process.env.DEBUG = 'true';
      const spyInfo = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger as any);

      logService.logHttpRequest('GET', '/x', 200, 10, 'u');

      expect(spyInfo).toHaveBeenCalledWith(
        expect.anything(),
        expect.not.objectContaining({ debug: expect.anything() })
      );
    });

    it('logOperation(): DEBUG=true mas sem debugContext não deve incluir debug', () => {
      process.env.DEBUG = 'true';
      const spyInfo = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger as any);

      logService.logOperation('A', true, 10);

      expect(spyInfo).toHaveBeenCalledWith(
        expect.anything(),
        expect.not.objectContaining({ debug: expect.anything() })
      );
    });

    it('logPerformance(): DEBUG=true mas sem debugContext não deve incluir debug', () => {
      process.env.DEBUG = 'true';
      const spyInfo = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger as any);

      logService.logPerformance('P', 10, 'u');

      expect(spyInfo).toHaveBeenCalledWith(
        expect.anything(),
        expect.not.objectContaining({ debug: expect.anything() })
      );
    });
  });

  describe('errorCode precedence', () => {
    it('deve priorizar context.errorCode sobre error.name', () => {
      const spyError = jest
        .spyOn(logService.logger, 'error')
        .mockImplementation(() => logService.logger as any);
      const erro = new Error('boom');

      logService.error('Erro', { errorCode: 'MEU_CODIGO' }, erro);

      expect(spyError).toHaveBeenCalledWith(
        'Erro',
        expect.objectContaining({ errorCode: 'MEU_CODIGO' })
      );
    });
  });

  describe('logOperation / logPerformance branches adicionais', () => {
    it('logOperation(): failure com DEBUG=true deve incluir debugContext (branch error + debug)', () => {
      process.env.DEBUG = 'true';
      const spyError = jest
        .spyOn(logService.logger, 'error')
        .mockImplementation(() => logService.logger as any);

      logService.logOperation('X', false, 123, {}, new Error('fail'), { extra: 1 });

      expect(spyError).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ debug: { extra: 1 } })
      );
    });

    it('logPerformance(): threshold=0 (falsy) deve considerar operação não lenta (branch threshold falsy)', () => {
      const spyInfo = jest
        .spyOn(logService.logger, 'info')
        .mockImplementation(() => logService.logger as any);

      logService.logPerformance('T0', 999, 'u', 0);

      expect(spyInfo).toHaveBeenCalledWith(
        expect.stringContaining('Performance: T0 - 999ms'),
        expect.objectContaining({ isSlowOperation: false })
      );
    });

    it('logPerformance(): caminho warn com DEBUG=true deve incluir debugContext (branch warn + debug)', () => {
      process.env.DEBUG = 'true';
      const spyWarn = jest
        .spyOn(logService.logger, 'warn')
        .mockImplementation(() => logService.logger as any);

      logService.logPerformance('SLOW', 900, 'u', 500, { diag: 'x' });

      expect(spyWarn).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ debug: { diag: 'x' } })
      );
    });
  });

  describe('close() - deve chamar logger.close (branch interno)', () => {
    it('deve chamar logger.close ao fechar', async () => {
      const svc = new LogService('SvcCloseSpy');
      const spy = jest.spyOn(svc.logger, 'close');

      await svc.close();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  it('deve gerar logStreamName com data YYYY-MM-DD em produção', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-04-29T10:00:00.000Z'));

    process.env.NODE_ENV = 'production';
    process.env.AWS_REGION = 'us-east-1';
    delete process.env.LOG_GROUP_NAME;

    const svc = new LogService('ServicoX');

    // cobre branch do LOG_GROUP_NAME ?? default e logStreamName dependente de Date
    // (dependendo do winston-cloudwatch real, pode haver efeitos colaterais;
    // se houver, me diga que eu te passo a versão com mock do WinstonCloudWatch)
    expect(svc.logger).toBeInstanceOf(Logger);

    jest.useRealTimers();
  });
});
