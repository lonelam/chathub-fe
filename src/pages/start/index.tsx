import React, { useState, useEffect } from 'react';
import api from 'api'; // Import your API configuration
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import { VscBracketError } from 'react-icons/vsc';

export const StartPage = () => {
  const [qrcode, setQrcode] = useState('');
  const [botId, setBotId] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const startProcess = async () => {
      try {
        const response = await api.post('wechat/start');

        if (response.data.bot.isLoggedIn) {
          navigate(`/chat/${response.data.bot.currentUser.id}`);
        }
        setQrcode(response.data.qrcode);
        setBotId(response.data.bot.id);
      } catch (error) {
        if (error instanceof AxiosError) {
          setIsError(true);
        }
        console.error('Error starting process', error);
      }
    };

    startProcess();
  }, [navigate]);

  useEffect(() => {
    if (botId) {
      const interval = setInterval(async () => {
        try {
          const response = await api.get('wechat/bot', {
            params: {
              id: botId,
            },
          });
          if (response.data.isLoggedIn) {
            setIsLoggedIn(true);
            clearInterval(interval); // Stop polling once logged in
            navigate(`/chat/${response.data.currentUser.id}`);
          }
        } catch (error) {
          console.error('Error checking login state', error);
        }
      }, 1000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [botId, navigate]);

  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Start Page</h1>
      {qrcode && <QRCodeSVG value={qrcode} className="mb-4" />}
      {!isLoggedIn ? (
        isError ? (
          <>
            <VscBracketError size={320} color="red" />
            <p className="text-red-950">启动失败，可能是没有Token了</p>
          </>
        ) : (
          <p>Scan the QR code to log in</p>
        )
      ) : (
        <p className="text-green-500">Logged in successfully!</p>
      )}
    </div>
  );
};
