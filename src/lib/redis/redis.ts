import { Redis as RedisIo } from 'ioredis';
import { env } from '../../config/env.js';
import { logger } from '../logger/logger.js';

class Redis {
  private static instance: Redis | null = null;

  private readonly client: RedisIo;

  private constructor() {
    this.client = new RedisIo({
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
      username: env.REDIS_USER,
      password: env.REDIS_PASS,
      keyPrefix: env.REDIS_KEY_PREFIX,
      retryStrategy: this.retryStrategy,
      reconnectOnError: this.reconnectOnError,
    });

    this.client.on('ready', () => {
      logger.info('[redis] connected');
    });

    this.client.on('error', (error) => {
      logger.error('[redis] ', error);
    });

    this.setupProcessHooks();
  }

  get redis(): RedisIo {
    return this.client;
  }

  static getInstance(): Redis {
    if (!Redis.instance) {
      Redis.instance = new Redis();
    }
    return Redis.instance;
  }

  disconnect(): void {
    logger.info(`[redis] disconnecting...`);
    this.client.disconnect();
    logger.info(`[redis] disconnected`);
  }

  private retryStrategy = (times: number) => {
    const delay = Math.min(times * 50, 2000);
    logger.warn('[redis] retrying connection', { attempt: times, delay });
    return delay;
  };

  private reconnectOnError = (error: Error) => {
    const retriable = ['ECONNREFUSED', 'ETIMEDOUT', 'ECONNRESET'].some((code) =>
      error.message.includes(code)
    );
    if (retriable) {
      logger.warn('[redis] reconnecting after error', { error: error.message });
    }
    return retriable;
  };

  private setupProcessHooks() {
    const shutdown = () => {
      if (this.client.status === 'end') return;
      try {
        this.disconnect();
      } catch {
        // silent
      }
    };

    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
  }
}

const redis = Redis.getInstance().redis;

export { redis, Redis };
