import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ApiInstance } from './types/instance';

export const api = axios.create({
  baseURL: '/api',
}) as ApiInstance;

export const useApiInterceptors = () => {
  const navigate = useNavigate();
  React.useEffect(() => {
    const ejectId = api.interceptors.response.use(
      (response) => response,
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
    return () => {
      api.interceptors.response.eject(ejectId);
    };
  }, [navigate]);
};
export default api;
