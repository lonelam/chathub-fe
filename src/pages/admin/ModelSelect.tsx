import api from 'api';
import React, { useState, useEffect, useCallback } from 'react';

const modelOptions = [
  'gpt-4-1106-preview',
  'gpt-4-vision-preview',
  'gpt-4',
  'gpt-4-0314',
  'gpt-4-0613',
  'gpt-4-32k',
  'gpt-4-32k-0314',
  'gpt-4-32k-0613',
  'gpt-3.5-turbo-1106',
  'gpt-3.5-turbo',
  'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo-0301',
  'gpt-3.5-turbo-0613',
  'gpt-3.5-turbo-16k-0613',
];

export const ModelSelect = () => {
  const [lower, setLower] = useState('');
  const [higher, setHigher] = useState('');

  const getModelsData = useCallback(async () => {
    try {
      const resp = await api.get('openai/models');
      setLower(resp.data.lower);
      setHigher(resp.data.higher);
    } catch (error) {
      console.error('Error fetching models', error);
    }
  }, []);

  const updateModelsData = useCallback(async () => {
    try {
      const resp = await api.post('openai/models/update', { lower, higher });
      setLower(resp.data.lower);
      setHigher(resp.data.higher);
    } catch (error) {
      console.error('Error updating models', error);
    }
  }, [lower, higher]);

  useEffect(() => {
    getModelsData();
  }, [getModelsData]);

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center space-y-4 rounded-xl bg-white p-6 shadow-md">
      <h1 className="text-xl font-semibold text-gray-900">Update AI Models</h1>
      <div className="flex w-full flex-col space-y-2">
        <label className="text-gray-700">Lower Model:</label>
        <select value={lower} onChange={(e) => setLower(e.target.value)} className="select select-bordered w-full">
          {modelOptions.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>
      <div className="flex w-full flex-col space-y-2">
        <label className="text-gray-700">Higher Model:</label>
        <select value={higher} onChange={(e) => setHigher(e.target.value)} className="select select-bordered w-full">
          {modelOptions.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>
      <button onClick={updateModelsData} className="btn btn-primary w-full" disabled={!lower || !higher}>
        Update Models
      </button>
    </div>
  );
};
