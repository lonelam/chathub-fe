import React from 'react';
import { FiHome, FiSearch } from 'react-icons/fi'; // Importing icons from React Icons
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation

export const NotFoundPage = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 text-gray-700">
      <div className="text-center">
        <FiSearch className="mx-auto text-6xl" /> {/* Search Icon */}
        <h1 className="mt-4 text-5xl font-bold">404 Not Found</h1>
        <p className="mt-4">你似乎来到了没有知识的荒原.</p>
        <Link
          to="/"
          className="mt-6 inline-block rounded bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-700"
        >
          <FiHome className="mr-2 inline-block" /> {/* Home Icon */}
          Go Home
        </Link>
      </div>
    </div>
  );
};
