import mongoose, { ConnectOptions } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import User, { IUser } from '../../models/User';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions;
  await mongoose.connect(mongoUri, mongooseOpts);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User model', () => {
  let user: IUser;

  beforeEach(async () => {
    await User.deleteMany({});
    user = new User({
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'password',
      preferences: {
        categories: ['sports', 'politics'],
        sources: ['bbc', 'cnn']
      },
      readArticles: [],
      favoriteArticles: []
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should save a user', async () => {
    const savedUser = await user.save();
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(user.username);
    expect(savedUser.email).toBe(user.email);
    expect(savedUser.password).toBe(user.password);
    expect(savedUser.preferences).toEqual(user.preferences);
    expect(savedUser.readArticles).toEqual(user.readArticles);
    expect(savedUser.favoriteArticles).toEqual(user.favoriteArticles);
  });

  it('should not save a user with duplicate email', async () => {
    await user.save();
    const duplicateUser = new User({
      username: 'testuser2',
      email: 'testuser@example.com',
      password: 'password',
      preferences: {
        categories: ['sports', 'politics'],
        sources: ['bbc', 'cnn']
      },
      readArticles: [],
      favoriteArticles: []
    });
    await expect(duplicateUser.save()).rejects.toThrow('E11000 duplicate key error collection: test.users index: email_1 dup key: { email: "testuser@example.com" }');
  });

  it('should not save a user with duplicate username', async () => {
    await user.save();
    const duplicateUser = new User({
      username: 'testuser',
      email: 'testuser2@example.com',
      password: 'password',
      preferences: {
        categories: ['sports', 'politics'],
        sources: ['bbc', 'cnn']
      },
      readArticles: [],
      favoriteArticles: []
    });
    await expect(duplicateUser.save()).rejects.toThrow('E11000 duplicate key error collection: test.users index: username_1 dup key: { username: "testuser" }');
  });

  it('should not save a user with invalid email', async () => {
    user.email = 'invalidemail';
    await expect(user.save()).rejects.toThrow(mongoose.Error.ValidationError);
  });
});