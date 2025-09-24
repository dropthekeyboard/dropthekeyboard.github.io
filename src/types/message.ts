import type { Entity, Message } from '@/contexts/scenario';

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
  message: Message;
  isOwnMessage: boolean;
  senderType?: 'user' | 'ai' | 'agent' | 'server-human';
  isTyping?: boolean;
  timestamp?: number;
  isRead?: boolean;
  enableMarkdown?: boolean;
  markdownOptions?: MarkdownOptions;
  entity?: Entity | null; // Optional Entity for avatar support
  messageFrom?: string; // Message sender identifier for avatar selection
  ownerName?: string; // Phone owner name for avatar comparison
  messageFromEntity?: Entity | null; // Message sender's entity for avatar
}

export interface VoiceBubbleProps {
  message: string;
  fromEntity: Entity;
  ownerEntity: Entity;
  timestamp?: number;
  className?: string;
  enableMarkdown?: boolean;
  markdownOptions?: MarkdownOptions;
  variant?: 'default' | 'program';
  audioUrl?: string;
}

export type SenderType = 'user' | 'ai' | 'agent' | 'server-human';

export interface MessageMetadata {
  id: string;
  timestamp: number;
  isRead: boolean;
  isDelivered: boolean;
  format: 'plain' | 'markdown';
}
