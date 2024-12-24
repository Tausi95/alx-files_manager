import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();

    this.client.on('error', (err) => {
      console.error('Error occurred while connecting to Redis:', err);
    });

    this.client.connect().catch((err) => {
      console.error('Failed to connect to Redis:', err);
    });
  }

  isAlive() {
    return this.client.isOpen; // Check if the client is open
  }

  async get(key) {
    try {
      return await this.client.get(key);
    } catch (err) {
      console.error('Error in Redis GET:', err);
      throw err;
    }
  }

  async set(key, value, duration) {
    try {
      await this.client.setEx(key, duration, value); // Use setEx for expiry
    } catch (err) {
      console.error('Error in Redis SET:', err);
      throw err;
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch (err) {
      console.error('Error in Redis DEL:', err);
      throw err;
    }
  }
}

const redisClient = new RedisClient();
export default redisClient;

process.on('SIGINT', async () => {
  console.log('Closing Redis client...');
  await redisClient.client.quit();
  process.exit(0);
});

