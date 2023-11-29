import React, { useState, useEffect } from 'react';
import { FaUpdate } from 'react-icons/fa'; // Import React Icons
import api from 'api'; // Import your API configuration
import { OpenAIToken, Token } from 'api/types/token';
import { EditSystemMessages } from './EditSystemMessages';

export const AdminPage = () => {
  const [openAITokens, setOpenAITokens] = useState<Token[]>([]);
  const [padLocalTokens, setPadLocalTokens] = useState<Token[]>([]);
  const [dataChanging, setDataChanging] = useState(false);
  const [showTokenForm, setShowTokenForm] = useState({
    openai: false,
    'pad-local': false,
  });
  const [newTokenValue, setNewTokenValue] = useState('');
  const [newTokenUrl, setNewTokenUrl] = useState('');

  const fetchData = async () => {
    try {
      const response = await api.get('token');
      setOpenAITokens(response.data.openai);
      setPadLocalTokens(response.data['pad-local']);
    } catch (error) {
      console.error('Error fetching token data', error);
    }
  };

  const createToken = async (type: 'openai' | 'pad-local') => {
    try {
      setDataChanging(true);
      const payload = type === 'openai' ? { token: newTokenValue, baseUrl: newTokenUrl } : { token: newTokenValue };
      await api.post(`token/create/${type}`, payload);
      await fetchData();
      setDataChanging(false);
      setShowTokenForm({ openai: false, 'pad-local': false });
      setNewTokenValue('');
      setNewTokenUrl('');
    } catch (error) {
      console.error('Error creating token', error);
      setDataChanging(false);
    }
  };

  const handleTokenValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTokenValue(e.target.value);
  };

  useEffect(() => {
    fetchData();
    // const interval = setInterval(fetchData, 5000); // Fetch every 5 seconds
    // return () => clearInterval(interval);
  }, []);

  const toggleActivation = async (id: number, type: string, value: boolean) => {
    try {
      // Implement the API call to toggle activation state
      // The API endpoint and method might need to be adjusted based on your backend
      setDataChanging(true);
      if (!value) {
        await api.get(`token/deactivate`, { params: { type, id } });
      } else {
        await api.get(`token/activate`, { params: { type, id } });
      }
      await fetchData();
      setDataChanging(false);
    } catch (error) {
      console.error('Error toggling token activation', error);
    }
  };

  const renderTokenList = (tokens: Token[], type: 'openai' | 'pad-local') =>
    tokens.map((token) => (
      <div key={token.id} className="mb-2 flex items-center justify-between rounded bg-base-200 p-2">
        <div>
          <span className="font-semibold">ID:</span> {token.id} |<span className="font-semibold">Token:</span>{' '}
          {token.token}
          {type === 'openai' && (
            <span className="ml-2">
              (<span className="font-semibold">URL:</span> {(token as OpenAIToken).baseUrl})
            </span>
          )}
        </div>
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text sr-only">Activate Token</span>
            <input
              type="checkbox"
              checked={token.isActive}
              disabled={dataChanging}
              onChange={() => toggleActivation(token.id, type, !token.isActive)}
              className="toggle"
            />
          </label>
        </div>
      </div>
    ));

  const renderAddTokenButton = (type: 'openai' | 'pad-local') => (
    <button
      onClick={() => setShowTokenForm({ ...showTokenForm, [type]: !showTokenForm[type] })}
      className="btn btn-primary ml-2"
      disabled={dataChanging}
    >
      +
    </button>
  );

  const renderTokenForm = (type: 'openai' | 'pad-local') =>
    showTokenForm[type] && (
      <div className="mb-4">
        <input
          type="text"
          value={newTokenValue}
          onChange={handleTokenValueChange}
          className="input input-bordered w-full max-w-xs"
          placeholder="Enter token value"
        />
        {type === 'openai' && (
          <input
            type="text"
            value={newTokenUrl}
            onChange={(e) => setNewTokenUrl(e.target.value)}
            className="input input-bordered mt-2 w-full max-w-xs"
            placeholder="Enter Base URL"
          />
        )}
        <button
          onClick={() => createToken(type)}
          className="btn btn-success ml-2"
          disabled={dataChanging || !newTokenValue || (type === 'openai' && !newTokenUrl)}
        >
          Add Token
        </button>
      </div>
    );

  return (
    <div className="p-4">
      <h1 className="mb-4 text-xl font-bold">Token Management</h1>
      <div>
        <h2 className="mb-2 flex items-center justify-between text-lg font-semibold">
          OpenAI Tokens
          {renderAddTokenButton('openai')}
        </h2>
        {renderTokenForm('openai')}
        {renderTokenList(openAITokens, 'openai')}
      </div>
      <div>
        <h2 className="mb-2 mt-4 flex items-center justify-between text-lg font-semibold">
          Pad-Local Tokens
          {renderAddTokenButton('pad-local')}
        </h2>
        {renderTokenForm('pad-local')}
        {renderTokenList(padLocalTokens, 'pad-local')}
      </div>
      <div>
        <h2 className="mb-2 mt-4 flex items-center justify-between text-lg font-semibold">Chat Sessions</h2>
        <EditSystemMessages />
      </div>
    </div>
  );
};
