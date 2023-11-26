import axios from 'axios';
import type { ApiInstance } from './types/instance';

export const api = axios.create({
  baseURL: '/api',
}) as ApiInstance;

export default api;
