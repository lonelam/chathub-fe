import React, { useState, useEffect } from 'react';
import api from 'api'; // Import your API configuration
import { EditSystemMessages } from './EditSystemMessages';
import { TokenList, baseUrlOptions } from './TokenList';
import { AdminDataContext } from './AdminDataContext';
import { ModelSelect } from './ModelSelect';

export const AdminPage = () => {
  const { dataChanging, setDataChanging, fetchData, openAITokens, padLocalTokens } = React.useContext(AdminDataContext);
  const [showTokenForm, setShowTokenForm] = useState({
    openai: false,
    'pad-local': false,
  });
  const [newTokenValue, setNewTokenValue] = useState('');
  const [newTokenUrl, setNewTokenUrl] = useState('');

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
  }, [fetchData]);

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
          <select
            value={newTokenUrl}
            onChange={(e) => setNewTokenUrl(e.target.value)}
            className="select select-bordered mt-2 w-full max-w-xs"
          >
            {baseUrlOptions.map((url, index) => (
              <option key={index} value={url}>
                {url}
              </option>
            ))}
          </select>
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
        <TokenList tokens={openAITokens} type="openai" />
      </div>
      <div>
        <h2 className="mb-2 mt-4 flex items-center justify-between text-lg font-semibold">
          Pad-Local Tokens
          {renderAddTokenButton('pad-local')}
        </h2>
        {renderTokenForm('pad-local')}

        <TokenList tokens={padLocalTokens} type="pad-local" />
      </div>
      <div>
        <h2 className="mb-2 mt-4 flex items-center justify-between text-lg font-semibold">Chat Sessions</h2>
        <EditSystemMessages />
      </div>
      <ModelSelect />
    </div>
  );
};
