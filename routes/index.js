import express from 'express';
import appController from '../controllers/AppController.js';  // Import the instance
import userController from '../controllers/UsersController.js';
import authController from '../controllers/AuthController.js';
import filesController from '../controllers/FilesController.js';

const router = express.Router();

// Log the appController to check its structure and methods
console.log('appController:', appController);

// Get db status
router.get('/status', (req, res) => appController.getStatus(req, res));
// Get db and redis stats
router.get('/stats', (req, res) => appController.getStats(req, res));

// Create new user
router.post('/users', (req, res) => userController.postNew(req, res));
// Get user by token
router.get('/users/me', (req, res) => userController.getMe(req, res));
// Connect user and create new session
router.get('/connect', (req, res) => authController.getConnect(req, res));
// Disconnect user and remove session
router.get('/disconnect', (req, res) => authController.getDisconnect(req, res));
// Upload a new file
router.post('/files', (req, res) => filesController.postUpload(req, res));
// Get a file based on id
router.get('/files/:id', (req, res) => filesController.getShow(req, res));
// Get all files based on a folder Id
router.get('/files', (req, res) => filesController.getIndex(req, res));
// Change public status to true
router.put('/files/:id/publish', (req, res) => filesController.putPublish(req, res));
// Change public status to false
router.put('/files/:id/unpublish', (req, res) => filesController.putUnpublish(req, res));
// Return the content of the file document based on the ID
router.get('/files/:id/data', (req, res) => filesController.getFile(req, res));

export default router;

