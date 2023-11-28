import { WechatAccount } from './accounts';
export interface HistoryMessage {
  id: number;
  textContent: string;
  senderId: string;
  receiverId: string;
}

export interface Friend {
  id: number;
  name: string;
  wechatId: string;
  avatarUrl: string;
}

export const FeatureFlags = {
  GptCompletionFeature: 1 << 0,
  AutoReplyFeature: 1 << 1,
  FastAutoReplyFeature: 1 << 2,
};

export interface Conversation {
  id: number;
  conversationId: string;
  activeMessage: string;
  systemMessage: string;
  wechatAccount: WechatAccount;
  friends: Friend[];
  historyMessages: HistoryMessage[];
  featureFlags: number;
}
