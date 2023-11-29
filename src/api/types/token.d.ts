export interface Token {
  id: number;
  token: string;
  isActive: boolean;
}
export interface OpenAIToken extends Token {
  baseUrl: string;
}

export interface PadLocalToken extends Token {
  isOccupied: boolean;
}
