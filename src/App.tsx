import React from 'react';
import { useApiInterceptors } from 'api';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminPage } from 'pages/admin';
import { StartPage } from 'pages/start';
import { EntryPage } from 'pages/entry';
import { ChatPage } from 'pages/chat';
import { AdminDataContextProvider } from 'pages/admin/AdminDataContext';
import LoginPage from 'pages/login';
import RegisterPage from 'pages/register';
import SetupPage from 'pages/setup';
import { ChatDataContextProvider } from 'pages/chat/ChatDataContext';
export const App: React.FC = () => {
  useApiInterceptors();
  return (
    <Routes>
      <Route path="/" element={<EntryPage />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <AdminDataContextProvider>
            <AdminPage />,
          </AdminDataContextProvider>
        }
      />
      <Route path="/start" element={<StartPage />} />
      <Route
        path="/chat/:id"
        element={
          <ChatDataContextProvider>
            <ChatPage />
          </ChatDataContextProvider>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
