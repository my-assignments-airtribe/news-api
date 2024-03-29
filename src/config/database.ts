import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();


// Load MongoDB connection credentials from environment variables
const username = process.env.MONGODB_USERNAME as string;
const password = process.env.MONGODB_PASSWORD as string;
const clusterName = process.env.MONGODB_CLUSTER_NAME as string;
const MONGODB_URL = process.env.MONGODB_URL as string;
const MONGODB_TEST_URL = process.env.MONGODB_TEST_URL as string;


const mongoURI =  process.env.NODE_ENV === 'test' ? MONGODB_TEST_URL : `mongodb+srv://${username}:${password}@${clusterName}.${MONGODB_URL}`;



const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as ConnectOptions;
if(process.env.NODE_ENV !== 'test') {
  mongoose
  .connect(mongoURI, mongoOptions)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
}

export default mongoose.connection;


