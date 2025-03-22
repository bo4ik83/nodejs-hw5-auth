import 'dotenv/config';
import { initMongoConnection } from './db/initMongoConnection.js';
import app from './server.js';

const PORT = Number(process.env.PORT) || 3000;

const startApp = async () => {
  try {
    await initMongoConnection();
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start the application:', error);
    process.exit(1);
  }
};

startApp();
