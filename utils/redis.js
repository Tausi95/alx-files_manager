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

  // Check if Redis client is alive
  async isAlive() {
    if (!this.client || !this.client.isOpen) {
      return false;
    }
    try {
      await this.client.ping();
      return true;
    } catch (err) {
      console.error('Error pinging Redis server:', err);
      return false;
    }
  }

  // Get a value by key from Redis
  async get(key) {
    if (!await this.isAlive()) {
      console.error('Cannot GET: Redis client is not connected.');
      return null;
    }
    try {
      const value = await this.client.get(key);
      if (value === null) {
        console.log(`Key "${key}" not found in Redis.`);
      }
      return value;
    } catch (err) {
      console.error('Error in Redis GET:', err);
      return null;
    }
  }

  // Set a key-value pair in Redis with expiration
  async set(key, value, duration) {
    if (!await this.isAlive()) {
      console.error('Cannot SET: Redis client is not connected.');
      return;
    }
    try {
      await this.client.setEx(key, duration, value);
    } catch (err) {
      console.error('Error in Redis SET:', err);
    }
  }

  // Delete a key in Redis
  async del(key) {
    if (!await this.isAlive()) {
      console.error('Cannot DEL: Redis client is not connected.');
      return;
    }
    try {
      await this.client.del(key);
    } catch (err) {
      console.error('Error in Redis DEL:', err);
    }
  }
}

const redisClient = new RedisClient();

// Handle process termination signals
process.on('SIGINT', async () => {
  console.log('SIGINT received: Closing Redis client...');
  try {
    await redisClient.client.quit();
    console.log('Redis client closed successfully.');
  } catch (err) {
    console.error('Error closing Redis client:', err);
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received: Closing Redis client...');
  try {
    await redisClient.client.quit();
    console.log('Redis client closed successfully.');
  } catch (err) {
    console.error('Error closing Redis client:', err);
  }
  process.exit(0);
});

export default redisClient;
