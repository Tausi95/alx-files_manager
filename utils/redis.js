import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();

    this.client.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    this.client.connect()
      .then(() => console.log('Connected to Redis successfully.'))
      .catch((err) => console.error('Failed to connect to Redis:', err));
  }

  isAlive() {
    return this.client && this.client.isOpen;
  }

  async get(key) {
    if (!this.isAlive()) {
      console.error('Cannot GET: Redis client is not connected.');
      return null;
    }
    try {
      return await this.client.get(key);
    } catch (err) {
      console.error('Error in Redis GET:', err);
      return null;
    }
  }

  async set(key, value, duration) {
    if (!this.isAlive()) {
      console.error('Cannot SET: Redis client is not connected.');
      return;
    }
    try {
      await this.client.setEx(key, duration, value);
    } catch (err) {
      console.error('Error in Redis SET:', err);
    }
  }

  async del(key) {
    if (!this.isAlive()) {
      console.error('Cannot DEL: Redis client is not connected.');
      return;
    }
    try {
      await this.client.del(key);
    } catch (err) {
      console.error('Error in Redis DEL:', err);
    }
  }

  async shutdown() {
    if (this.client && this.client.isOpen) {
      try {
        await this.client.quit();
        console.log('Redis client closed successfully.');
      } catch (err) {
        console.error('Error closing Redis client:', err);
      }
    }
  }
}

const redisClient = new RedisClient();

process.on('SIGINT', async () => {
  console.log('SIGINT received: Closing Redis client...');
  await redisClient.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received: Closing Redis client...');
  await redisClient.shutdown();
  process.exit(0);
});

export default redisClient;
