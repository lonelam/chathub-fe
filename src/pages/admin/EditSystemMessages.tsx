import React from 'react';
import api from 'api';
import { FiCheck, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { Conversation, FeatureFlags } from 'api/types/conversation';
import { FaRobot } from 'react-icons/fa';

const ConversationCard: React.FC<{ session: Conversation; fetchData: () => void }> = (props) => {
  const { session, fetchData } = props;
  const [disabled, setDisabled] = React.useState(false);
  const textAreaRef = React.useRef<HTMLTextAreaElement>(null);

  const isAutoReplyEnabled = (session.featureFlags & FeatureFlags.AutoReplyFeature) !== 0;
  const isGptCompletionEnabled = (session.featureFlags & FeatureFlags.GptCompletionFeature) !== 0;
  const isFastAutoReplyEnabled = (session.featureFlags & FeatureFlags.FastAutoReplyFeature) !== 0;

  const toggleAutoReplyFeature = React.useCallback(async () => {
    setDisabled(true);
    await api.post('wechat/update/feature', {
      sessionId: session.id,
      feature: session.featureFlags ^ FeatureFlags.AutoReplyFeature,
    });
    fetchData();
    setDisabled(false);
  }, [fetchData, session.featureFlags, session.id]);

  const toggleChatCompletionFeature = React.useCallback(async () => {
    setDisabled(true);
    await api.post('wechat/update/feature', {
      sessionId: session.id,
      feature: session.featureFlags ^ FeatureFlags.GptCompletionFeature,
    });
    fetchData();
    setDisabled(false);
  }, [fetchData, session.featureFlags, session.id]);

  const toggleFastAutoReplyFeature = React.useCallback(async () => {
    setDisabled(true);
    await api.post('wechat/update/feature', {
      sessionId: session.id,
      feature: session.featureFlags ^ FeatureFlags.FastAutoReplyFeature,
    });
    fetchData();
    setDisabled(false);
  }, [fetchData, session.featureFlags, session.id]);

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
    setDisabled(false);
  }, [fetchData, session.id]);

  return (
    <div className="mb-4 max-w-xl flex-1 rounded-lg bg-white p-4 shadow-lg">
      <div className="text-sm text-gray-500">ID: {session.id}</div>
      <div className="text-sm text-gray-500">Chatter: {session.friends[0]?.name}</div>
      <div className="mt-2">
        <label className="font-semibold text-gray-700">System Message:</label>
        <textarea
          ref={textAreaRef}
          disabled={disabled}
          defaultValue={session.systemMessage}
          className="mt-1 w-full rounded border border-gray-300 p-2"
        ></textarea>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={updateSystemMessage}
          disabled={disabled}
          className={`rounded p-2 text-white ${disabled ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
          aria-label="Update System Message"
        >
          <FiCheck className="mr-1 inline" /> Update
        </button>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <button
              onClick={toggleFastAutoReplyFeature}
              disabled={disabled}
              className={`rounded-full p-2 ${disabled ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-700'}`}
              aria-label="Toggle Fast Auto Reply Feature"
            >
              {isFastAutoReplyEnabled ? <FiToggleRight className="text-white" /> : <FaRobot className="text-white" />}
            </button>
            <span className="ml-2 text-sm font-semibold text-gray-700">Fast Reply</span>
          </div>

          <div className="flex items-center">
            <button
              onClick={toggleAutoReplyFeature}
              disabled={disabled}
              className={`rounded-full p-2 ${disabled ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-700'}`}
              aria-label="Toggle Auto Reply Feature"
            >
              {isAutoReplyEnabled ? <FiToggleRight className="text-white" /> : <FiToggleLeft className="text-white" />}
            </button>
            <span className="ml-2 text-sm font-semibold text-gray-700">Auto Reply</span>
          </div>

          <div className="flex items-center">
            <button
              onClick={toggleChatCompletionFeature}
              disabled={disabled}
              className={`rounded-full p-2 ${disabled ? 'bg-gray-300' : 'bg-blue-500 hover:bg-blue-700'}`}
              aria-label="Toggle GPT Completion Feature"
            >
              {isGptCompletionEnabled ? (
                <FiToggleRight className="text-white" />
              ) : (
                <FiToggleLeft className="text-white" />
              )}
            </button>
            <span className="ml-2 text-sm font-semibold text-gray-700">GPT Completion</span>
          </div>
        </div>
      </div>
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
    <div className="flex flex-wrap gap-4">
      {sessions.map((session) => (
        <ConversationCard session={session} key={session.id} fetchData={fetchData} />
      ))}
    </div>
  );
};
