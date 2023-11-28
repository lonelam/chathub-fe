import type { AxiosInstance, AxiosResponse } from 'axios';
import { Token } from './token';
import { WechatAccount } from './accounts';
import { ExposedBot } from './bot';
import { Conversation } from './conversation';
export interface GetApiTypeMap {
  token: [
    never,
    {
      openai: Token[];
      'pad-local': Token[];
    },
  ];
  'token/activate': [{ type: string; id: number }, never];
  'token/deactivate': [{ type: string; id: number }, never];
  'wechat/accounts': [never, { data: WechatAccount[] }];
  'wechat/bot': [{ id: string }, ExposedBot];
  'wechat/chat-sessions': [
    { wechat_id: string },
    {
      chatSessions: Conversation[];
      wechatAccount: WechatAccount | null;
    },
  ];
  'wechat/admin/sessions': [
    never,
    {
      data: Conversation[];
    },
  ];
}

export interface PostApiTypeMap {
  'token/create': [
    {
      type: 'openai' | 'pad-local';
      token: string;
    },
    Token,
  ];
  'wechat/start': [
    {},
    {
      qrcode: string;
      bot: ExposedBot;
    },
  ];
  'wechat/say': [
    {
      listenerId: string;
      textContent: string;
      wechatId: string;
    },
    {},
  ];
  'wechat/logout': [
    {
      wechatId: string;
    },
    {},
  ];
  'wechat/update/system_message': [
    {
      sessionId: number;
      message: string;
    },
    never,
  ];
  'wechat/complete-chat-session': [
    {
      sessionId: number;
    },
    {
      data: Conversation;
    },
  ];
  'wechat/update/feature': [
    {
      sessionId: number;
      feature: number;
    },
    never,
  ];
}
export class ApiInstance extends AxiosInstance {
  get<K extends keyof GetApiTypeMap>(
    url: K,
    config?: {
      params?: GetApiTypeMap[K][0];
    },
  ): Promise<AxiosResponse<GetApiTypeMap[K][1]>> {
    return super.get(url, { params });
  }
  post<K extends keyof PostApiTypeMap>(
    url: K,
    data?: PostApiTypeMap[K][0],
  ): Promise<AxiosResponse<PostApiTypeMap[K][1]>> {
    return super.post(url, data);
  }
}
