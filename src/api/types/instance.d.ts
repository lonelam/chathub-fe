import type { AxiosInstance, AxiosResponse } from 'axios';
import { OpenAIToken, Token } from './token';
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
  'wechat/sessions': [
    never,
    {
      data: Conversation[];
    },
  ];
  'wechat/admin/sessions': [
    never,
    {
      data: Conversation[];
    },
  ];
  'openai/models': [
    never,
    {
      lower: string;
      higher: string;
    },
  ];
  'auth/pre-login': [
    never,
    {
      init: boolean;
    },
  ];
}

export interface PostApiTypeMap {
  'token/create/openai': [
    {
      // type: 'openai' | 'pad-local';
      token: string;
      baseUrl: string;
    },
    Token,
  ];

  'token/create/pad-local': [
    {
      // type: 'openai' | 'pad-local';
      token: string;
      puppetType: string;
    },
    Token,
  ];
  'token/update/openai': [
    {
      // type: 'openai' | 'pad-local';
      data: OpenAIToken;
    },
    OpenAIToken,
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
  'openai/models/update': [
    {
      lower: string;
      higher: string;
    },
    {
      lower: string;
      higher: string;
    },
  ];
  'auth/setup': [
    {
      password: string;
      openai: { token: string; baseUrl: string };
      padLocal: {
        token: string;
        puppetType: string;
      };
    },
    {
      user: User;
    },
  ];
  'auth/login': [
    {
      username: string;
      password: string;
    },
    {
      user: User;
    },
  ];
}
export interface ApiInstance extends AxiosInstance {
  get: <K extends keyof GetApiTypeMap>(
    url: K,
    config?: {
      params?: GetApiTypeMap[K][0];
    },
  ) => Promise<AxiosResponse<GetApiTypeMap[K][1]>>;
  post: <K extends keyof PostApiTypeMap>(
    url: K,
    data?: PostApiTypeMap[K][0],
  ) => Promise<AxiosResponse<PostApiTypeMap[K][1]>>;
}
