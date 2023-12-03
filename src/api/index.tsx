import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ApiInstance } from './types/instance';

export const api = axios.create({
  baseURL: '/api',
}) as ApiInstance;

export const useApiInterceptors = () => {
  const navigate = useNavigate();
  const [unauthorized, setUnauthorized] = React.useState(false);
  React.useEffect(() => {
    if (unauthorized) {
      navigate('/login');
    }
  }, [unauthorized]);
  React.useEffect(() => {
    api.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        const { status } = error.response;
        if (status === 401) {
          setUnauthorized(true);
          return {};
        } else {
          return Promise.reject(error);
        }
      },
    );
  });
};
export default api;
