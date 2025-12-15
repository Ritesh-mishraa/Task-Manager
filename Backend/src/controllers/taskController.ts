import { Request, Response } from 'express';
import Task from '../models/Task';
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  dueDate: z.string().transform((str) => new Date(str)),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']),
  assignedToId: z.string().optional(),
});


export const getTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const filter: any = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.priority) filter.priority = req.query.priority;

    const tasks = await Task.find(filter)
      .populate('assignedToId', 'name email')
      .populate('creatorId', 'name')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const validatedData = taskSchema.parse(req.body);

    // Create Task
    const task = await Task.create({
      ...validatedData,
      creatorId: req.user._id,
    });

    const populatedTask = await task.populate('assignedToId', 'name email');

    const io = req.app.get('io');
    io.emit('task:created', populatedTask);

    res.status(201).json(populatedTask);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: error.issues });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};


export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findByIdAndUpdate(id, updates, { new: true })
      .populate('assignedToId', 'name email')
      .populate('creatorId', 'name');

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Emit Socket Event
    const io = req.app.get('io');
    io.emit('task:updated', task);

    res.json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);

    // Emit Socket Event
    const io = req.app.get('io');
    io.emit('task:deleted', id);

    res.json({ message: 'Task deleted' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};