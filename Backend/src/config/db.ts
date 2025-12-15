import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || '');
    const indexes = await mongoose.connection.collection('users').indexes();
    const indexExists = indexes.find(index => index.name === 'username_1');
    
    if (indexExists) {
      await mongoose.connection.collection('users').dropIndex('username_1');
      console.log('✅ FIXED: Dropped the problematic "username" index.');
    }
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${(error as Error).message}`);
    process.exit(1);
  }
};

export default connectDB;