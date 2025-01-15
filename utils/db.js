import { MongoClient } from 'mongodb';

class DBClient {
  constructor() {
    const {
      DB_HOST = 'localhost',
      DB_PORT = 27017,
      DB_DATABASE = 'files_manager',
    } = process.env;

    const url = `mongodb://${DB_HOST}:${DB_PORT}`;
    this.client = new MongoClient(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    // Initialize the database instance to null
    this.db = null;

    // Connect to MongoDB
    this.client.connect()
      .then(() => {
        console.log('Connected to MongoDB successfully.');
        this.db = this.client.db(DB_DATABASE);
      })
      .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
      });
  }

  /**
   * Check if the MongoDB connection is alive.
   * @returns {boolean} True if connected, false otherwise.
   */
  async isAlive() {
    try {
      // Ping MongoDB to validate connection status
      await this.client.db('admin').command({ ping: 1 });
      return true;
    } catch (err) {
      return false;
    }
  }

  /**
   * Get the number of documents in the "users" collection.
   * @returns {Promise<number>} Number of users.
   */
  async nbUsers() {
    try {
      if (!this.db) return 0;
      return await this.db.collection('users').countDocuments();
    } catch (err) {
      console.error('Error counting users:', err);
      return 0;
    }
  }

  /**
   * Get the number of documents in the "files" collection.
   * @returns {Promise<number>} Number of files.
   */
  async nbFiles() {
    try {
      if (!this.db) return 0;
      return await this.db.collection('files').countDocuments();
    } catch (err) {
      console.error('Error counting files:', err);
      return 0;
    }
  }
}

const dbClient = new DBClient();
export default dbClient;
