import { Request, Response } from 'express';
import User from '../models/User';


export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('_id name email');
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};