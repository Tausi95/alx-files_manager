import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const {
      DB_HOST = '127.0.0.1',
      DB_PORT = 27017,
      DB_DATABASE = 'files_manager',
    } = process.env;

    const url = `mongodb://${DB_HOST}:${DB_PORT}`;

    this.client = new MongoClient(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    // Connect to MongoDB and catch errors
    this.client.connect().catch((error) => {
      console.error('Error occurred while connecting to MongoDB:', error);
    });

    // Initialize the database instance
    this.db = this.client.db(DB_DATABASE);
  }

  // Check if the DB client is alive
  async isAlive() {
    return !!this.client && !!this.client.topology && this.client.topology.isConnected();
  }

  // Get the number of users in the database
  async nbUsers() {
    const users = this.db.collection('users');
    const countUsers = await users.countDocuments();
    return countUsers;
  }

  // Get the number of files in the database
  async nbFiles() {
    const files = this.db.collection('files');
    const countFiles = await files.countDocuments();
    return countFiles;
  }

  // Optional methods for connect and disconnect (if needed)
  async connect() {
    if (!this.client.isConnected()) {
      await this.client.connect();
    }
  }

  async disconnect() {
    await this.client.close();
  }
}

const dbClient = new DBClient();
export default dbClient;// Use default export for ES Module
