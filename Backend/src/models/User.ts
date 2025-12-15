import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// 1. Interface
export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

// 2. Schema
const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

// 3. Pre-save hook (FIXED)
UserSchema.pre('save', async function (next) {
  // FIX: Double cast (as unknown as IUser) to bypass the safety check
  const user = this as unknown as IUser; 

  if (!user.isModified('passwordHash')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
  next();
});

// 4. Method
UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema);