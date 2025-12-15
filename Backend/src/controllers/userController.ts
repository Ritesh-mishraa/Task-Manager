import { Request, Response } from 'express';
import User from '../models/User';

// @desc    Get all users (for assignment)
// @route   GET /api/users
export const getUsers = async (req: Request, res: Response) => {
  try {
    // Only return id and name to protect privacy
    const users = await User.find({}).select('_id name email');
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};