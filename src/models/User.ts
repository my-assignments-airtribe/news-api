import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  preferences: {
    categories: string[];
    sources: string[];
  }
  createdAt: Date;
  updatedAt: Date;
  readArticles: {
    articleUrl: string;
    readAt: Date;
  }[];
  favoriteArticles: {
    articleUrl: string;
    favoritedAt: Date;
  }[];
}

// Define the User schema
const userSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, lowercase: true, match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date,
  preferences: {
    categories: [String],
    sources: [String]
  },
  readArticles: [{
    articleUrl: { type: String},
    readAt: { type: Date, default: Date.now}
  }],
  favoriteArticles: [{
    articleUrl: { type: String},
    readAt: { type: Date, default: Date.now}
  }]
});

// Create and export the User model
const User = mongoose.model<IUser>('User', userSchema);

export default User;
