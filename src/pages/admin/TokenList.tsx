import api from 'api';
import { OpenAIToken, Token } from 'api/types/token';
import React, { useState } from 'react';
import { AdminDataContext } from './AdminDataContext';
export interface ITokenListProps {
  tokens: Token[];
  type: 'openai' | 'pad-local';
}

export const baseUrlOptions = ['https://api.openai.com/v1', 'https://aiproxy.laizn.com/v1', 'https://api.gptapi.us/v1'];

const TokenRow = ({ token, type }: { token: Token; type: 'openai' | 'pad-local' }) => {
  const { dataChanging, setDataChanging, fetchData } = React.useContext(AdminDataContext);
  const [baseUrl, setBaseUrl] = useState(type === 'openai' ? (token as OpenAIToken).baseUrl : '');

  const handleBaseUrlChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setBaseUrl(e.target.value);
      setDataChanging(true);
      api
        .post('token/update/openai', {
          data: {
            ...token,
            baseUrl: e.target.value,
          },
        })
        .then((newTokenResp) => {
          if (newTokenResp.status === 200) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            token = {
              ...newTokenResp.data,
            };
          }
          setDataChanging(false);
        })
        .catch(console.error);
    },
    [token],
  );
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

  return (
    <div key={token.id} className="mb-2 flex items-center justify-between rounded bg-base-200 p-2">
      <div>
        <span className="font-semibold">ID:</span> {token.id} | <span className="font-semibold">Token:</span>{' '}
        {token.token}
        {type === 'openai' && (
          <div className="ml-2">
            <span className="font-semibold">URL:</span>
            <select value={baseUrl} onChange={handleBaseUrlChange} className="select select-bordered ml-2">
              {baseUrlOptions.map((url, index) => (
                <option key={index} value={url}>
                  {url}
                </option>
              ))}
            </select>
          </div>
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
  );
};

export const TokenList: React.FC<ITokenListProps> = (props) => {
  const { tokens, type } = props;

  return (
    <>
      {tokens.map((token) => (
        <TokenRow key={token.id} token={token} type={type} />
      ))}
    </>
  );
};
