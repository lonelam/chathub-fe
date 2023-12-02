import api from 'api';
import React, { useEffect } from 'react';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api.post('auth/login', { username, password }).then((resp) => {
      if (resp.status === 200) {
        navigate('/');
      } else {
        setError('用户名或密码错误');
      }
    });
  };
  useEffect(() => {
    api.get('auth/pre-login').then((resp) => {
      if (resp.status === 200) {
        if (!resp.data.init) {
          navigate('/setup');
        }
      }
    });
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="mt-4 bg-white px-8 py-6 text-left shadow-lg">
        <h3 className="text-center text-2xl font-bold">Login to your account</h3>
        <form action="" onSubmit={handleSubmit}>
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="username">
                Username
              </label>
              <div className="mt-1 flex items-center">
                <FaUserAlt className="h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Username"
                  id="username"
                  className="ml-2 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block">Password</label>
              <div className="mt-1 flex items-center">
                <FaLock className="h-5 w-5 text-gray-500" />
                <input
                  type="password"
                  placeholder="Password"
                  className="ml-2 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  value={password}
                />
              </div>
            </div>
            <div className="mb-4 h-4">
              <p className="text-red-500">{error}</p>
            </div>
            <div className="flex items-baseline justify-between">
              <button className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-900" type="submit">
                Login
              </button>
              <a href="/register" className="text-sm text-blue-600 hover:underline">
                Register new user
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
