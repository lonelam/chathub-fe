import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import api from 'api';
import { ConversationFace } from 'components/conversation-face';
import { Conversation } from 'api/types/conversation';
import { FiRefreshCw, FiArrowLeft, FiArrowRight, FiSend, FiLogOut } from 'react-icons/fi';
import { NotFoundPage } from 'pages/not-found';
export enum HeaderContentEnum {
  ConversationName = 0,
  SystemMessage,
  ModulusNumber,
}
export const ChatPage = () => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [chatSessions, setChatSessions] = useState<Conversation[]>([]);
  const [activeMessage, _setActiveMessage] = useState('');
  const [headerContentType, _setHeaderContentType] = useState(0);
  const lastInputActiveTime = useRef(0);
  const lastSentMessage = useRef('');
  const chatScrollDivRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { id: wechatId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedIndex = searchParams.get('s') || '0';
  const navigate = useNavigate();

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

  const handleInput = React.useCallback(() => {
    const target = textareaRef.current;
    if (!target) {
      return;
    }
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 80)}px`;
  }, []);
  const fetchChatSessions = React.useCallback(async () => {
    if (!wechatId) {
      return;
    }

    try {
      const response = await api.get('wechat/chat-sessions', {
        params: { wechat_id: wechatId },
      });

      let selectedConversation: null | Conversation = response.data.data[0];
      if (selectedIndex) {
        selectedConversation = response.data.data[parseInt(selectedIndex)];
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
      setChatSessions(response.data.data);
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
    }
  }, [handleInput, selectedIndex, setActiveMessage, wechatId]);

  useEffect(() => {
    fetchChatSessions();
    const intervalHandler = setInterval(fetchChatSessions, 5000);
    return () => {
      clearInterval(intervalHandler);
    };
  }, [fetchChatSessions, wechatId, selectedIndex]);

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

  const handleLogout = React.useCallback(async () => {
    // Implement your logout logic here
    if (wechatId) {
      await api.post('wechat/logout', {
        wechatId,
      });
    }
    navigate('/'); // Redirect to the login page after logout
  }, [navigate, wechatId]);

  const onArrowClick = (add: number) => {
    const currentIndex = parseInt(selectedIndex);
    setSearchParams({ s: String(currentIndex + add) });
  };

  if (!conversation || !wechatId) {
    return <NotFoundPage />;
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between bg-blue-500 p-4 text-white">
        <h1 className="h-full flex-1 text-lg font-semibold" onClick={updateHeaderContentType}>
          {headerContentStr}
        </h1>
        <div>
          <button onClick={fetchChatSessions} className="mx-1 text-white">
            <FiRefreshCw className="animate-spin" />
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
      <div className="flex items-center justify-between bg-gray-100 p-4">
        <button
          onClick={onArrowClick.bind(null, -1)}
          className="rounded-full bg-blue-500 p-2 text-white"
          disabled={selectedIndex === '0'}
        >
          <FiArrowLeft />
        </button>

        <button
          onClick={onArrowClick.bind(null, 1)}
          className="rounded-full bg-blue-500 p-2 text-white"
          disabled={selectedIndex === String(chatSessions.length - 1)}
        >
          <FiArrowRight />
        </button>
        <textarea
          ref={textareaRef}
          value={activeMessage}
          onChange={(e) => setActiveMessage(e.target.value)}
          onKeyDown={handleEnterPress}
          onInput={handleInput}
          className="mx-2 flex-grow resize-none overflow-hidden rounded border border-gray-300 p-2"
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
