import React from 'react';
import { FaUserAlt, FaLock, FaEnvelope } from 'react-icons/fa';

const RegisterPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="mt-4 bg-white px-8 py-6 text-left shadow-lg">
        <h3 className="text-center text-2xl font-bold">Create your account</h3>
        <form action="">
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
                  className="ml-2 w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <button className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-900">Register</button>
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
