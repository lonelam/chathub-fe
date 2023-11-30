import React from 'react';
export interface IChatDataContext {}

const ChatDataContext = React.createContext<IChatDataContext>({});
const ChatDataContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  return <ChatDataContext.Provider value={props}>{props.children}</ChatDataContext.Provider>;
};
