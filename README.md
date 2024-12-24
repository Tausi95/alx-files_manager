```markdown
# File Manager

This is a simple file manager application built with Node.js, Express, MongoDB, and Redis. It supports basic user authentication, file management, and caching functionalities.

---

## Features

- **User Authentication**: Register, login, and logout users securely using hashed passwords and Redis for token-based session management.
- **File Management**: Create, retrieve, and manage files.
- **Redis Caching**: Utilizes Redis to improve performance by caching user sessions.
- **MongoDB Storage**: Stores user and file data in a MongoDB database.

---

## Project Structure

- **`controllers/`**: Contains the business logic for authentication (`AuthController.js`) and user management (`UsersController.js`).
- **`utils/`**: Contains utility files for MongoDB (`db.js`) and Redis (`redis.js`) connections.
- **`routes/`**: Defines the API routes for the application.

---

## Requirements

- **Node.js**: v18.x or later
- **MongoDB**: v5.x or later
- **Redis**: v7.x or later
- **npm**: v8.x or later

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Tausi95/alx-file-manager.git
   cd file-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up MongoDB and Redis:
   - Ensure MongoDB and Redis are installed and running on your machine.

4. Create a `.env` file in the root directory and configure the following variables:
   ```env
   PORT=5000
   MONGO_URL=mongodb://localhost:27017/file_manager
   ```

---

## Usage

1. Start the server:
   ```bash
   npm start
   ```

2. The application will run on `http://localhost:5000`.

3. Use the following API endpoints:

   - **Register a new user**:
     ```
     POST /users
     Body: { "email": "user@example.com", "password": "yourpassword" }
     ```

   - **Login a user**:
     ```
     GET /connect
     Headers: { "Authorization": "Basic base64encoded(email:password)" }
     ```

   - **Logout a user**:
     ```
     DELETE /disconnect
     Headers: { "X-Token": "session_token" }
     ```

   - **Get logged-in user info**:
     ```
     GET /users/me
     Headers: { "X-Token": "session_token" }
     ```

---

## Dependencies

- **Express**: Web framework
- **MongoDB**: Database
- **Redis**: Caching
- **bcrypt**: Password hashing
- **uuid**: Unique ID generation

---

## Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
```


