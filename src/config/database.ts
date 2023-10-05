// Import any necessary libraries/modules here.
import mongoose, { ConnectOptions } from 'mongoose';

// MongoDB connection URL
const mongoURI = process.env.MONGODB_URI as string;

// MongoDB options (optional)
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions;

// Connect to MongoDB
mongoose
  .connect(mongoURI, mongoOptions)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

export default mongoose.connection;
