import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from 'api';
import { ConversationFace } from 'components/conversation-face';
import { Conversation } from 'api/types/conversation';
import { FiRefreshCw, FiArrowLeft, FiArrowRight, FiSend, FiLogOut, FiHome, FiTool } from 'react-icons/fi';
import { NotFoundPage } from 'pages/not-found';
import { WechatAccount } from 'api/types/accounts';
import { FaRobot, FaUserFriends } from 'react-icons/fa';
import { ChatList } from './ChatList';
export enum HeaderContentEnum {
  ConversationName = 0,
  SystemMessage,
  ModulusNumber,
}
const MAX_INPUT_HEIGHT = 75;
export const ChatPage = () => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [account, setAccount] = useState<WechatAccount | null>(null);
  const [chatSessions, setChatSessions] = useState<Conversation[]>([]);
  const [activeMessage, _setActiveMessage] = useState('');
  const [headerContentType, _setHeaderContentType] = useState(0);
  const [refreshing, setRefreshing] = useState(true);
  const [gptCompleting, setGptCompleting] = useState(false);
  const lastInputActiveTime = useRef(0);
  const lastSentMessage = useRef('');
  const chatScrollDivRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { id: wechatId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [chatListExpand, setChatListExpand] = useState(false);

  const selectedId = searchParams.get('id') || chatSessions[0]?.id?.toString();

  const navigate = useNavigate();

  const handleInput = React.useCallback(() => {
    const target = textareaRef.current;
    if (!target) {
      return;
    }
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, MAX_INPUT_HEIGHT)}px`;
  }, []);

  React.useEffect(() => {
    console.log(`selected id changed to ${selectedId}`);
    setChatListExpand(false);
    const selectedSession = chatSessions.find((s) => s.id?.toString() === selectedId);
    if (selectedSession) {
      setConversation(selectedSession);
      setActiveMessage(selectedSession.activeMessage);
      setTimeout(() => {
        const target = chatScrollDivRef.current;
        if (!target) {
          return;
        }
        handleInput();
        target.scrollTo({
          top: target.scrollHeight,
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const setActiveMessage = React.useCallback((msg: string) => {
    if (msg === lastSentMessage.current) {
      _setActiveMessage('');
    } else {
      _setActiveMessage(msg);
    }
  }, []);

  const updateHeaderContentType = React.useCallback(() => {
    _setHeaderContentType((t) => {
      return (t + 1) % HeaderContentEnum.ModulusNumber;
    });
  }, []);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const msg = e.target.value;
      lastInputActiveTime.current = Date.now();
      setActiveMessage(msg);
    },
    [setActiveMessage],
  );
  const fetchChatSessions = React.useCallback(async () => {
    if (!wechatId) {
      return;
    }

    try {
      const response = await api.get('wechat/chat-sessions', {
        params: { wechat_id: wechatId },
      });

      let selectedConversation: null | Conversation = response.data.chatSessions[0];
      if (selectedId) {
        selectedConversation = response.data.chatSessions.find((c) => c.id === parseInt(selectedId)) || null;
      }
      setConversation((prevConv) => {
        if (
          selectedConversation &&
          prevConv &&
          selectedConversation.historyMessages.length !== prevConv.historyMessages.length
        ) {
          const target = chatScrollDivRef.current;
          if (!target) {
            return selectedConversation;
          }
          setTimeout(() => {
            target.scrollTo({ top: target.scrollHeight });
          });
        }
        return selectedConversation;
      });

      if (
        selectedConversation &&
        selectedConversation.activeMessage &&
        Date.now() - lastInputActiveTime.current > 60 * 1000
      ) {
        setActiveMessage(selectedConversation.activeMessage);
        setTimeout(handleInput);
      }
      setAccount(response.data.wechatAccount);
      setChatSessions(response.data.chatSessions);
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
    }
  }, [handleInput, selectedId, setActiveMessage, wechatId]);

  useEffect(() => {
    fetchChatSessions();
    if (refreshing) {
      const intervalHandler = setInterval(fetchChatSessions, 5000);
      return () => {
        clearInterval(intervalHandler);
      };
    }
  }, [fetchChatSessions, wechatId, refreshing]);

  const handleRefreshActiveMessageClick = React.useCallback(async () => {
    if (!conversation || !wechatId) {
      return;
    }
    try {
      setGptCompleting(true);
      const { data } = await api.post('wechat/complete-chat-session', { sessionId: conversation.id });
      setConversation(data.data);
      setActiveMessage(data.data.activeMessage);
      setChatSessions(
        chatSessions.map((c) => {
          if (c.id === data.data.id) {
            return { ...c, activeMessage: data.data.activeMessage };
          }
          return c;
        }),
      );
    } catch (err) {
      console.error(err);
    }
    setGptCompleting(false);
  }, [chatSessions, conversation, setActiveMessage, wechatId]);
  const handleRefreshClick = React.useCallback(() => {
    setRefreshing((r) => !r);
  }, []);

  const headerContentStr = useMemo(() => {
    if (!conversation) {
      return '';
    }
    switch (headerContentType) {
      case HeaderContentEnum.ConversationName:
        return conversation.friends[0]?.name;
      case HeaderContentEnum.SystemMessage:
        return conversation.systemMessage;
    }
  }, [conversation, headerContentType]);

  const sayCurrentText = () => {
    if (!conversation || !wechatId) {
      return;
    }
    api.post('wechat/say', {
      listenerId: conversation.conversationId,
      wechatId: wechatId,
      textContent: activeMessage,
    });
    lastSentMessage.current = activeMessage;
    setActiveMessage(conversation.activeMessage);
  };

  const handleEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sayCurrentText();
    }
  };

  const handleGoAdmin = React.useCallback(() => {
    navigate('/admin');
  }, [navigate]);
  const handleGoHome = React.useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleLogout = React.useCallback(async () => {
    // Implement your logout logic here
    if (wechatId) {
      await api.post('wechat/logout', {
        wechatId,
      });
    }
    navigate('/'); // Redirect to the login page after logout
  }, [navigate, wechatId]);

  const handleChatListExpand = React.useCallback(() => {
    setChatListExpand((c) => !c);
  }, []);

  if (!conversation || !wechatId) {
    return null;
  }

  return (
    <div className="flex h-screen flex-col">
      <div
        className={`flex items-center justify-between ${
          account?.isLogin ? 'bg-blue-500' : 'bg-gray-500'
        } p-4 text-white`}
      >
        <h1 className="h-full flex-1 text-lg font-semibold" onClick={updateHeaderContentType}>
          {headerContentStr}
        </h1>
        <div>
          <button onClick={handleGoAdmin} className="mx-1 text-white">
            <FiTool />
          </button>
          <button>
            <FiHome onClick={handleGoHome} className="mx-1 text-white" />
          </button>
          <button onClick={handleRefreshClick} className="mx-1 text-white">
            <FiRefreshCw className={refreshing ? 'animate-spin' : ''} />
          </button>
          <button onClick={handleLogout} className="mx-1 text-white">
            <FiLogOut />
          </button>
        </div>
      </div>
      <div className="flex-grow overflow-auto" ref={chatScrollDivRef}>
        <ConversationFace
          messages={conversation.historyMessages}
          currentUserWechatId={wechatId}
          users={conversation.friends.concat([{ ...conversation.wechatAccount, id: -1 }])}
        />
      </div>
      <div className="relative flex items-center justify-between overflow-visible bg-gray-100 p-4">
        <ChatList
          className={`absolute left-1 top-0 max-w-[80%] -translate-y-full rounded bg-gray-100 p-2 ${
            chatListExpand ? '' : 'hidden'
          } overflow-scroll`}
          style={{
            maxHeight: `calc(100vh - ${MAX_INPUT_HEIGHT + 10}px)`,
          }}
          chatSessions={chatSessions}
        />
        <button className="rounded-full bg-blue-500 p-2 text-white" onClick={handleChatListExpand}>
          <FaUserFriends />
        </button>

        <button
          disabled={gptCompleting}
          onClick={handleRefreshActiveMessageClick}
          className={`m-1 rounded-full ${gptCompleting ? 'bg-gray-500' : 'bg-orange-300'} p-2 text-white`}
        >
          <FaRobot />
        </button>
        <textarea
          ref={textareaRef}
          value={activeMessage}
          onChange={handleChange}
          onKeyDown={handleEnterPress}
          onInput={handleInput}
          disabled={gptCompleting}
          className="mx-2 flex-grow resize-none overflow-hidden overflow-y-auto rounded border border-gray-300 p-1"
          placeholder="Type a message"
          rows={1}
        />
        <button onClick={sayCurrentText} className="rounded-full bg-blue-500 p-2 text-white">
          <FiSend />
        </button>
      </div>
    </div>
  );
};
