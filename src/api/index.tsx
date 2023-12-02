import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ApiInstance } from './types/instance';

export const api = axios.create({
  baseURL: '/api',
}) as ApiInstance;

export const useApiInterceptors = () => {
  const navigate = useNavigate();
  console.log(`should only execute once`);
  api.interceptors.response.use(
    (response) => {
      if (response.status === 401) {
        navigate('/login');
      }
      return response;
    },
    (error) => {
      const { status } = error.response;
      if (status === 401) {
        navigate('/login');
        return {};
      } else {
        return Promise.reject(error);
      }
    },
  );
};
export default api;
