import api from 'api';
import React, { useState } from 'react';
import { FaUserAlt, FaLock, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationMessage, setValidationMessage] = useState('');

  const handleSubmit = React.useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      if (password !== confirmPassword) {
        setValidationMessage('两次密码不一致');
        return;
      } else if (!password) {
        setValidationMessage('需要管理员账户，密码不能为空');
        return;
      }
      api
        .post('auth/register', {
          username,
          password,
        })
        .then((resp) => {
          if (resp.status === 200) {
            console.log(`success, data: `, resp.data);
            navigate('/');
          }
        })
        .catch();
    },
    [confirmPassword, navigate, password, username],
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="mt-4 bg-white px-8 py-6 text-left shadow-lg">
        <h3 className="text-center text-2xl font-bold">Create your account</h3>
        <form action="" onSubmit={handleSubmit}>
          <div className="mt-4">
            <div className="mt-4">
              <label className="block" htmlFor="username">
                Username
              </label>
              <div className="mt-1 flex items-center">
                <FaUserAlt className="h-5 w-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Username"
                  id="username"
                  onChange={(e) => setUsername(e.target.value)}
                  className="ml-2 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600"
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
                  onChange={(e) => setPassword(e.target.value)}
                  className="ml-2 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block">Confirm Password</label>
              <div className="mt-1 flex items-center">
                <FaLock className="h-5 w-5 text-gray-500" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="ml-2 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <button className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-900" type="submit">
                Register
              </button>
              <a href="/login" className="text-sm text-blue-600 hover:underline">
                Already an user?
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
