import api from 'api';
import { OpenAIToken, PadLocalToken } from 'api/types/token';
import React from 'react';
export interface IAdminDataContext {
  dataChanging: boolean;
  setDataChanging: (changing: boolean) => void;
  fetchData: () => Promise<void>;
  openAITokens: OpenAIToken[];
  padLocalTokens: PadLocalToken[];
}

export const AdminDataContext = React.createContext<IAdminDataContext>({
  dataChanging: false,
  setDataChanging: () => {},
  fetchData: () => Promise.resolve(),
  openAITokens: [],
  padLocalTokens: [],
});
export const AdminDataContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const { children } = props;
  const [dataChanging, setDataChanging] = React.useState<boolean>(false);

  const [openAITokens, setOpenAITokens] = React.useState<OpenAIToken[]>([]);
  const [padLocalTokens, setPadLocalTokens] = React.useState<PadLocalToken[]>([]);
  const fetchData = React.useCallback(async () => {
    try {
      const response = await api.get('token');
      setOpenAITokens(response.data.openai as OpenAIToken[]);
      setPadLocalTokens(response.data['pad-local'] as PadLocalToken[]);
    } catch (error) {
      console.error('Error fetching token data', error);
    }
  }, []);
  return (
    <AdminDataContext.Provider
      value={{
        dataChanging,
        setDataChanging,
        fetchData,
        openAITokens,
        padLocalTokens,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
};
