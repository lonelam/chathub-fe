import { Conversation } from 'api/types/conversation';
import React from 'react';
import { useSearchParams } from 'react-router-dom';
export interface IChatListProps {
  chatSessions: Conversation[];
  className?: string;
  style?: React.CSSProperties;
}

export const ChatList: React.FC<IChatListProps> = (props) => {
  const { chatSessions, className, style } = props;
  const [, setSearchParams] = useSearchParams();
  const navigateToChat = React.useCallback(
    (session: Conversation) => {
      setSearchParams({
        id: session.id.toString(),
      });
    },
    [setSearchParams],
  );

  return (
    <div className={`${className} space-y-4`} style={style}>
      {chatSessions.map((session, index) => (
        <div
          key={session.id}
          className="flex cursor-pointer items-center space-x-3"
          onClick={() => navigateToChat(session)}
        >
          <div className="flex-shrink-0">
            {session.friends[0]?.avatarUrl ? (
              <img src={session.friends[0].avatarUrl} alt="avatar" className="h-10 w-10 rounded-full" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold">
                {session.friends[0]?.name.charAt(0)}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">{session.friends[0]?.name}</p>
            <p className="truncate text-sm text-gray-500">
              {session.historyMessages[session.historyMessages.length - 1]?.textContent}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
