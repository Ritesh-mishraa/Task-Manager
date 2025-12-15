import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import api from '../services/api';
import type { Task } from '../types';

// Singleton socket connection (prevents multiple connections)
let socket: Socket;

export const useTaskSocket = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initialize Socket
    if (!socket) {
      socket = io('http://localhost:5000');
    }

    // 2. Fetch Initial Data
    const fetchTasks = async () => {
      try {
        const { data } = await api.get('/tasks');
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();

    // 3. Define Event Listeners
    const handleTaskCreated = (newTask: Task) => {
      setTasks((prev) => [newTask, ...prev]);
    };

    const handleTaskUpdated = (updatedTask: Task) => {
      setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
    };

    const handleTaskDeleted = (deletedTaskId: string) => {
      setTasks((prev) => prev.filter((t) => t._id !== deletedTaskId));
    };

    // 4. Attach Listeners
    socket.on('task:created', handleTaskCreated);
    socket.on('task:updated', handleTaskUpdated);
    socket.on('task:deleted', handleTaskDeleted);

    // 5. Cleanup
    return () => {
      socket.off('task:created', handleTaskCreated);
      socket.off('task:updated', handleTaskUpdated);
      socket.off('task:deleted', handleTaskDeleted);
    };
  }, []);

  return { tasks, loading };
};