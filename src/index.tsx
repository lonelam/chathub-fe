import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { AdminPage } from 'pages/admin';
import { StartPage } from 'pages/start';
import { EntryPage } from 'pages/entry';
import { ChatPage } from 'pages/chat';
import { AdminDataContextProvider } from 'pages/admin/AdminDataContext';
const router = createBrowserRouter([
  {
    path: '/',
    element: <EntryPage />,
  },
  {
    path: '/admin',
    element: (
      <AdminDataContextProvider>
        <AdminPage />,
      </AdminDataContextProvider>
    ),
  },
  {
    path: '/start',
    element: <StartPage />,
  },
  {
    path: '/chat/:id',
    element: <ChatPage />,
  },
]);
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
