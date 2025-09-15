import { User } from 'lucide-react';
import logo from '@/assets/skt_logo.jpg';
import avatarSmall from '@/assets/avatar_small.png';
import type { SenderType } from '@/contexts/scenario';

// Helper function to get avatar props based on sender type
export function getAvatarProps(senderType?: 'user' | 'ai' | 'agent' | 'server-human') {
  switch (senderType) {
    case 'ai':
    case 'agent':
      return {
        src: logo,
        alt: 'AI Assistant',
        fallbackIcon: undefined,
      };
    case 'server-human':
      return {
        src: undefined,
        alt: 'Human Server',
        fallbackIcon: User,
      };
    case 'user':
    default:
      return {
        src: avatarSmall,
        alt: 'User',
        fallbackIcon: User,
      };
  }
}

// Helper function to get avatar props based on CallSession caller information
export function getCallerAvatarProps(callerType?: SenderType) {
  // Convert scenario senderType to component senderType
  const componentSenderType = (() => {
    switch (callerType) {
      case 'agent':
        return 'ai';
      case 'customer':
        return 'user';
      case 'server':
        return 'server-human';
      default:
        return 'user';
    }
  })();

  return getAvatarProps(componentSenderType);
}