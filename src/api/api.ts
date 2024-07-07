import axios from 'axios';
import { Task, TaskStatus, FetchTasksParams } from '../store/types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_JWT_TOKEN}`,
  },
});

export const getTasks = async (params: FetchTasksParams = {}) => {
  const response = await api.get('/tasks', { params });
  return response.data;
};

export const getTaskById = async (id: number) => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

export const postTask = async (
  title: string,
  description: string,
  status: TaskStatus
): Promise<Task> => {
  const response = await api.post('/tasks', {
    data: {
      title,
      description,
      status,
    },
  });
  return response.data.data;
};

export const putTask = async (
  id: number,
  title: string,
  description: string,
  status: TaskStatus
): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, {
    data: {
      title,
      description,
      status,
    },
  });
  return response.data.data;
};

export const deleteTask = async (id: number): Promise<Task> => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};
