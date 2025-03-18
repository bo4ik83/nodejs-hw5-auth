import mongoose from 'mongoose';

export const initMongoConnection = async () => {
  try {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
      process.env;

    if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_URL || !MONGODB_DB) {
      throw new Error(
        'Одна або декілька змінних оточення MongoDB не визначені',
      );
    }

    const connectionString = `mongodb+srv://${encodeURIComponent(
      MONGODB_USER,
    )}:${encodeURIComponent(
      MONGODB_PASSWORD,
    )}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

    mongoose.set('strictQuery', true); // Включає сувору перевірку запитів
    mongoose.set('bufferCommands', false); // Вимикає буферизацію команд

    await mongoose.connect(connectionString);

    console.log('✅ Mongo connection successfully established!');

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected!');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err.message);
    });
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};
