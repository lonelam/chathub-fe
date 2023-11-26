import { Friend, HistoryMessage } from 'api/types/conversation';
import React from 'react';

export interface IConversationFaceProps {
  messages: HistoryMessage[];
  users: Friend[];
  currentUserWechatId: string; // Assuming this is the ID of the current user
}

export const ConversationFace: React.FC<IConversationFaceProps> = ({ messages, users, currentUserWechatId }) => {
  return (
    <div className="flex flex-col space-y-2 p-4">
      {messages.map((msg) => {
        const user = users.find((f) => f.wechatId === msg.senderId);
        const isCurrentUser = msg.senderId === currentUserWechatId;

        return (
          <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            {!isCurrentUser && (
              <img
                src={user?.avatarUrl}
                alt="avatar"
                className="mr-2 h-8 w-8 rounded-full" // Adjust the size as needed
              />
            )}
            <div className={`rounded-lg p-2 ${isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
              {!isCurrentUser && <div className="text-sm text-gray-600">{user?.name}</div>}
              <div>{msg.textContent}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
