/* eslint-disable @typescript-eslint/no-explicit-any */
import { createLogger, format, transports, Logger, LoggerOptions } from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';

export interface LogContext {
  userId?: string;
  requestId?: string;
  correlationId?: string;
  traceId?: string;
  spanId?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  action?: string;
  duration?: number;
  durationUnit?: string;
  errorCode?: string;
  [key: string]: any;
}

export class LogService {
  logger: Logger;
  private service: string;
  private environment: string;

  constructor(service: string) {
    this.service = service;
    this.environment = process.env.NODE_ENV ?? 'development';

    const isProduction = this.environment === 'production';
    const logLevel = process.env.LOG_LEVEL ?? 'info';

    // Configurar transports
    const logTransports: any[] = [
      new transports.Console({
        format: format.combine(format.colorize(), format.simple()),
      }),
    ];

    // Adicionar CloudWatch em produção
    if (isProduction && process.env.AWS_REGION) {
      logTransports.push(
        new WinstonCloudWatch({
          logGroupName: process.env.LOG_GROUP_NAME ?? `/minhoteca/${service}`,
          logStreamName: `${process.env.NODE_ENV}-${new Date().toISOString().split('T')[0]}`,
          awsRegion: process.env.AWS_REGION,
          messageFormatter: (info: any) => this.formatCloudWatchMessage(info),
        })
      );
    }

    this.logger = createLogger({
      level: logLevel,
      exitOnError: false,
      defaultMeta: { service, env: this.environment },
      handleExceptions: true,
      handleRejections: true,
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
        format.splat(),
        format.errors({ stack: true }),
        format.printf((info: any) => this.formatLogMessage(info))
      ),
      transports: logTransports,
    } as LoggerOptions);
  }

  /**
   * Formata mensagem para CloudWatch com estrutura otimizada
   */
  private formatCloudWatchMessage(info: any): string {
    return JSON.stringify(this.buildLogObject(info));
  }

  /**
   * Formata mensagem de log padrão
   */
  private formatLogMessage(info: any): string {
    return JSON.stringify(this.buildLogObject(info));
  }

  /**
   * Constrói objeto de log estruturado com todos os campos necessários
   */
  private buildLogObject(info: any): object {
    const sanitized = this.sanitizeData(info);

    return {
      timestamp: info.timestamp ?? undefined,
      level: info.level ?? undefined,
      service: this.service,
      env: this.environment,
      message: info.message ?? undefined,

      // Rastreamento distribuído
      correlationId: sanitized.correlationId ?? undefined,
      traceId: sanitized.traceId ?? undefined,
      spanId: sanitized.spanId ?? undefined,
      requestId: sanitized.requestId ?? undefined,

      // Contexto da requisição
      userId: sanitized.userId ?? undefined,
      endpoint: sanitized.endpoint ?? undefined,
      method: sanitized.method ?? undefined,
      statusCode: sanitized.statusCode ?? undefined,
      action: sanitized.action ?? undefined,

      // Performance
      duration: sanitized.duration ?? undefined,
      durationUnit: sanitized.durationUnit ?? 'ms',

      // Dados e erros
      errorCode: sanitized.errorCode ?? undefined,
      context: this.removeUndefinedFields(sanitized.context ?? null),
      stack: sanitized.stack ?? undefined,
      label: sanitized.label ?? undefined,
    };
  }

  /**
   * Remove campos sensíveis (PII) dos dados de log
   */
  private sanitizeData(data: any): any {
    const sensitiveFields = [
      'password',
      'token',
      'apiKey',
      'secret',
      'creditCard',
      'ssn',
      'email',
      'phone',
    ];

    const sanitize = (obj: any): any => {
      if (!obj || typeof obj !== 'object') return obj;

      if (Array.isArray(obj)) {
        return obj.map(sanitize);
      }

      const result: any = {};
      for (const key in obj) {
        if (sensitiveFields.some((field) => key.toLowerCase().includes(field.toLowerCase()))) {
          result[key] = '[REDACTED]';
        } else if (typeof obj[key] === 'object') {
          result[key] = sanitize(obj[key]);
        } else {
          result[key] = obj[key];
        }
      }
      return result;
    };

    return sanitize(data);
  }

  /**
   * Remove campos undefined do objeto
   */
  private removeUndefinedFields(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;

    if (Array.isArray(obj)) {
      return obj
        .map((item) => this.removeUndefinedFields(item))
        .filter((item) => item !== undefined);
    }

    const result: any = {};
    for (const key in obj) {
      if (obj[key] !== undefined && obj[key] !== null) {
        result[key] =
          typeof obj[key] === 'object' ? this.removeUndefinedFields(obj[key]) : obj[key];
      }
    }
    return Object.keys(result).length > 0 ? result : null;
  }

  /**
   * Log com contexto estruturado
   */
  public log(
    level: string,
    message: string,
    context?: LogContext,
    debugContext?: Record<string, any>
  ): void {
    const sanitized = this.sanitizeData(context ?? {});
    this.logger.log(level, message, {
      ...sanitized,
      ...(process.env.DEBUG?.toLowerCase() === 'true' && debugContext
        ? { debug: debugContext }
        : {}),
    });
  }

  /**
   * Log de erro
   */
  public error(
    message: string,
    context?: LogContext,
    error?: Error,
    debugContext?: Record<string, any>
  ): void {
    const sanitized = this.sanitizeData(context ?? {});
    const errorData = {
      ...sanitized,
      ...(process.env.DEBUG?.toLowerCase() === 'true' && debugContext
        ? { debug: debugContext }
        : {}),
      errorCode: context?.errorCode || error?.name || 'UNKNOWN_ERROR',
      stack: error?.stack,
    };
    this.logger.error(message, errorData);
  }

  /**
   * Log de aviso
   */
  public warn(message: string, context?: LogContext, debugContext?: Record<string, any>): void {
    const sanitized = this.sanitizeData(context ?? {});
    this.logger.warn(message, {
      ...sanitized,
      ...(process.env.DEBUG?.toLowerCase() === 'true' && debugContext
        ? { debug: debugContext }
        : {}),
    });
  }

  /**
   * Log de informação
   */
  public info(message: string, context?: LogContext, debugContext?: Record<string, any>): void {
    const sanitized = this.sanitizeData(context ?? {});
    this.logger.info(message, {
      ...sanitized,
      ...(process.env.DEBUG?.toLowerCase() === 'true' && debugContext
        ? { debug: debugContext }
        : {}),
    });
  }

  /**
   * Log HTTP para rastreamento de requisições
   */
  public logHttpRequest(
    method: string,
    endpoint: string,
    statusCode: number,
    duration: number,
    userId?: string,
    context?: LogContext,
    debugContext?: Record<string, any>
  ): void {
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    const sanitized = this.sanitizeData(context ?? {});
    const logData = {
      ...sanitized,
      method,
      endpoint,
      statusCode,
      duration,
      durationUnit: 'ms',
      userId,
      action: `HTTP_${method}`,
      ...(process.env.DEBUG?.toLowerCase() === 'true' && debugContext
        ? { debug: debugContext }
        : {}),
    };

    this.logger[level as keyof Logger](
      `HTTP Request: ${method} ${endpoint} - ${statusCode}`,
      logData
    );
  }

  /**
   * Log de operação de negócio com rastreamento
   */
  public logOperation(
    action: string,
    success: boolean,
    duration: number,
    context?: LogContext,
    error?: Error,
    debugContext?: Record<string, any>
  ): void {
    const level = success ? 'info' : 'error';
    const sanitized = this.sanitizeData(context ?? {});
    const logData = {
      ...sanitized,
      action,
      success,
      duration,
      durationUnit: 'ms',
      ...(error && { errorCode: error.name, stack: error.stack }),
      ...(process.env.DEBUG?.toLowerCase() === 'true' && debugContext
        ? { debug: debugContext }
        : {}),
    };

    this.logger[level as keyof Logger](
      `Operation: ${action} - ${success ? 'Success' : 'Failed'}`,
      logData
    );
  }

  /**
   * Log de performance
   */
  public logPerformance(
    action: string,
    duration: number,
    userId?: string,
    threshold?: number,
    debugContext?: Record<string, any>
  ): void {
    const isSlowOperation = threshold && duration > threshold;
    const level = isSlowOperation ? 'warn' : 'info';

    const logData = {
      action,
      duration,
      durationUnit: 'ms',
      userId,
      isSlowOperation: !!isSlowOperation,
      ...(process.env.DEBUG?.toLowerCase() === 'true' && debugContext
        ? { debug: debugContext }
        : {}),
    };

    const sanitized = this.sanitizeData(logData);
    this.logger[level as keyof Logger](`Performance: ${action} - ${duration}ms`, sanitized);
  }

  /**
   * Fechar o logger (importante para CloudWatch)
   */
  public async close(): Promise<void> {
    return new Promise((resolve) => {
      this.logger.close();
      resolve();
    });
  }
}
