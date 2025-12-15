import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { User } from '../types';

const CreateTask = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]); // Store list of users
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assignedToId: '', // New field
  });

  // 1. Fetch Users on Load
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users');
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users');
      }
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // If assignedToId is empty string, remove it so backend treats it as undefined/null
      const payload = { ...formData };
      if (!payload.assignedToId) delete (payload as any).assignedToId;

      await api.post('/tasks', payload);
      navigate('/'); 
    } catch (error) {
      alert('Failed to create task');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">Create New Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input 
              className="w-full border p-2 rounded" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              className="w-full border p-2 rounded" 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select 
                className="w-full border p-2 rounded"
                value={formData.priority}
                onChange={e => setFormData({...formData, priority: e.target.value})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Due Date</label>
              <input 
                type="date" 
                className="w-full border p-2 rounded"
                value={formData.dueDate}
                onChange={e => setFormData({...formData, dueDate: e.target.value})}
                required 
              />
            </div>
          </div>

          {/* New Assign User Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Assign To</label>
            <select 
              className="w-full border p-2 rounded"
              value={formData.assignedToId}
              onChange={e => setFormData({...formData, assignedToId: e.target.value})}
            >
              <option value="">-- Unassigned --</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 mt-6">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create</button>
            <button type="button" onClick={() => navigate('/')} className="text-gray-600 px-4 py-2">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;