// Import the MongoClient class from the mongodb package
import { MongoClient } from 'mongodb';

// Define a class for interacting with the MongoDB database
class DBClient {
  constructor() {
    // Destructure the environment variables or set default values for database connection details
    const {
      DB_HOST = '127.0.0.1',
      DB_PORT = 27017,
      DB_DATABASE = 'files_manager',
    } = process.env;

    // Construct the MongoDB connection URL using the host and port
    const url = `mongodb://${DB_HOST}:${DB_PORT}`;

    // Create a new MongoDB client instance with connection options
    this.client = MongoClient(url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      // family: 4  // Optional parameter to specify the IP family (IPv4 or IPv6)
    });

    // Connect to the MongoDB server and handle any connection errors
    this.client.connect().catch((error) => {
      console.error('Error occurred while connecting to MongoDB:', error);
    });

    // Access the database using the specified name from the environment variables
    this.db = this.client.db(DB_DATABASE);
  }

  // Method to check if the database connection is alive
  async isAlive() {
    return !!this.client && !!this.client.topology && this.client.topology.isConnected();
    // Alternatively, you can use: return this.client.isConnected();
  }

  // Method to count the number of users in the 'users' collection
  async nbUsers() {
    const users = this.db.collection('users');
    const countUsers = await users.countDocuments();
    return countUsers;
  }

  // Method to count the number of files in the 'files' collection
  async nbFiles() {
    const files = this.db.collection('files');
    const countFiles = await files.countDocuments();
    return countFiles;
  }

  // Optional methods for connecting, disconnecting, or querying (currently commented)
  // connect() {
  //   return this.client.connect();
  // }
  // disconnect() {
  //   return this.client.disconnect();
  // }
  // query() {
  //   return this.client.query();
  // }
}

// Create an instance of DBClient and export it for use in other parts of the application
const dbClient = new DBClient();
module.exports = dbClient;
