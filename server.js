import express from 'express';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Load routes
app.use('/', routes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
