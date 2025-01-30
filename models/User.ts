import mongoose, { Schema, Document, model } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin'; // Define roles
  favorites: string[];
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, // Default role is "user"
  favorites: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.User || model<IUser>('User', UserSchema);
