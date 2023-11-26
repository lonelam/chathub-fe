import api from 'api';
import { Conversation } from 'api/types/conversation';
import React from 'react';
import { FiCheck } from 'react-icons/fi';

const ConversationCard: React.FC<{ session: Conversation; fetchData: () => void }> = (props) => {
  const { session, fetchData } = props;
  const [disabled, setDisabled] = React.useState(false);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);
  const updateSystemMessage = React.useCallback(async () => {
    const target = textAreaRef.current;
    if (!target) {
      return;
    }
    setDisabled(true);
    await api.post('wechat/update/system_message', {
      sessionId: session.id,
      message: target.value,
    });
    fetchData();
  }, [fetchData, session.id]);

  return (
    <div className="mb-4 rounded-lg bg-white p-4 shadow-lg">
      <div className="text-sm text-gray-500">ID: {session.id}</div>
      <div className="text-sm text-gray-500">Chatter: {session.friends[0].name}</div>
      <div className="mt-2">
        <label className="font-semibold text-gray-700">System Message:</label>
        <textarea
          ref={textAreaRef}
          disabled={disabled}
          defaultValue={session.systemMessage}
          className="mt-1 w-full rounded border border-gray-300 p-2"
        ></textarea>
      </div>
      <button
        onClick={updateSystemMessage}
        disabled={disabled}
        className={`mt-2 rounded p-2 text-white ${disabled ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
      >
        <FiCheck className="mr-1 inline" /> Update
      </button>
    </div>
  );
};

export const EditSystemMessages = () => {
  const [sessions, setSessions] = React.useState<Conversation[]>([]);

  const fetchData = React.useCallback(async () => {
    const sessions = await api.get('wechat/admin/sessions');
    setSessions(sessions.data.data);
  }, []);
  React.useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-4">
      {sessions.map((session) => (
        <ConversationCard session={session} key={session.id} fetchData={fetchData} />
      ))}
    </div>
  );
};
