import api from 'api';
import { WechatAccount } from 'api/types/accounts';
import { Conversation } from 'api/types/conversation';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
export interface IChatDataContext {
  chatSessions: Conversation[];
  fetchChatSessions: () => Promise<void>;
  refreshing: boolean;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
  account: WechatAccount | null;
  updateConversation: (conversation: Conversation) => Promise<Conversation>;
}

export const ChatDataContext = React.createContext<IChatDataContext>({
  chatSessions: [],
  fetchChatSessions: () => Promise.resolve(),
  refreshing: false,
  setRefreshing: () => {},
  account: null,
  updateConversation: (conversation: Conversation) => Promise.resolve(conversation),
});
export const ChatDataContextProvider: React.FC<React.PropsWithChildren<{}>> = (props) => {
  const [chatSessions, setChatSessions] = useState<Conversation[]>([]);

  const [refreshing, setRefreshing] = useState(true);
  const [account, setAccount] = useState<WechatAccount | null>(null);
  const { id: wechatId } = useParams();
  const fetchChatSessions = React.useCallback(async () => {
    try {
      if (!wechatId) {
        return;
      }

      const response = await api.get('wechat/chat-sessions', {
        params: { wechat_id: wechatId },
      });
      setChatSessions(response.data.chatSessions);
      setAccount(response.data.wechatAccount);
    } catch (error) {
      console.log(error);
    }
  }, [wechatId]);

  const updateConversation = useCallback(async (conversation: Conversation) => {
    try {
      return new Promise<Conversation>((resolve, reject) => {
        setChatSessions((prevSessions) => {
          let sessionUpdated = false;
          const updatedSessions = prevSessions.map((c) => {
            if (c.id === conversation.id) {
              const newConversation = { ...c, activeMessage: conversation.activeMessage };
              resolve(newConversation);
              sessionUpdated = true;
              return newConversation;
            }
            return c;
          });
          if (!sessionUpdated) {
            reject(new Error('Could not find conversation to update'));
          }
          return updatedSessions;
        });
      });
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }, []);

  useEffect(() => {
    fetchChatSessions();
    if (refreshing) {
      const intervalHandler = setInterval(fetchChatSessions, 5000);
      return () => {
        clearInterval(intervalHandler);
      };
    }
  }, [fetchChatSessions, wechatId, refreshing]);

  return (
    <ChatDataContext.Provider
      value={{
        chatSessions,
        fetchChatSessions,
        refreshing,
        setRefreshing,
        account,
        updateConversation,
      }}
    >
      {props.children}
    </ChatDataContext.Provider>
  );
};
