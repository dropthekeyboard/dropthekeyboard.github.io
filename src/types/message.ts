export interface MessageContent {
  text: string;
  format?: 'plain' | 'markdown';
}

export interface MarkdownOptions {
  allowHtml?: boolean;
  linkTarget?: '_blank' | '_self';
  enableGfm?: boolean;
}

export interface MessageBubbleProps {
  message: string;
  isOwnMessage: boolean;
  senderType?: 'user' | 'ai' | 'agent' | 'server-human';
  isTyping?: boolean;
  timestamp?: number;
  isRead?: boolean;
  enableMarkdown?: boolean;
  markdownOptions?: MarkdownOptions;
}

export interface VoiceBubbleProps {
  message: string;
  isOwnMessage: boolean;
  senderType?: 'user' | 'ai' | 'agent' | 'server-human';
  timestamp?: number;
  className?: string;
  enableMarkdown?: boolean;
  markdownOptions?: MarkdownOptions;
}

export type SenderType = 'user' | 'ai' | 'agent' | 'server-human';

export interface MessageMetadata {
  id: string;
  timestamp: number;
  isRead: boolean;
  isDelivered: boolean;
  format: 'plain' | 'markdown';
}
