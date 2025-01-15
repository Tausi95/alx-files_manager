import express from 'express';
import appController from '../controllers/AppController';
import userController from '../controllers/UsersController';
import authController from '../controllers/AuthController';
import filesController from '../controllers/FilesController';

const router = express.Router();

// Status and Stats Routes
router.get('/status', async (req, res, next) => {
  try {
    await appController.getStatus(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/stats', async (req, res, next) => {
  try {
    await appController.getStats(req, res);
  } catch (error) {
    next(error);
  }
});

// User Routes
router.post('/users', async (req, res, next) => {
  try {
    await userController.postNew(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/users/me', async (req, res, next) => {
  try {
    await userController.getMe(req, res);
  } catch (error) {
    next(error);
  }
});

// Authentication Routes
router.get('/connect', async (req, res, next) => {
  try {
    await authController.getConnect(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/disconnect', async (req, res, next) => {
  try {
    await authController.getDisconnect(req, res);
  } catch (error) {
    next(error);
  }
});

// File Routes
router.post('/files', async (req, res, next) => {
  try {
    await filesController.postUpload(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/files/:id', async (req, res, next) => {
  try {
    await filesController.getShow(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/files', async (req, res, next) => {
  try {
    await filesController.getIndex(req, res);
  } catch (error) {
    next(error);
  }
});

router.put('/files/:id/publish', async (req, res, next) => {
  try {
    await filesController.putPublish(req, res);
  } catch (error) {
    next(error);
  }
});

router.put('/files/:id/unpublish', async (req, res, next) => {
  try {
    await filesController.putUnpublish(req, res);
  } catch (error) {
    next(error);
  }
});

router.get('/files/:id/data', async (req, res, next) => {
  try {
    await filesController.getFile(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
