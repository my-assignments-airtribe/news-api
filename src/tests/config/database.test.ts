import mongoose, { ConnectOptions } from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import database from '../../config/database';

dotenv.config();

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = new MongoMemoryServer();
  await mongoServer.start(); // Use start to initiate the MongoDB server
  const mongoUri = mongoServer.getUri(); // Get the URI after starting
  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions;
  await mongoose.connect(mongoUri, mongooseOptions);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('database connection', () => {
  it('should connect to the database', async () => {
    expect(database.readyState).toBe(1);
  });
});