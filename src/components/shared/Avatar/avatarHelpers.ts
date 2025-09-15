import { User } from 'lucide-react';
import logo from '@/assets/logo.png';
import avatarSmall from '@/assets/avatar_small.png';

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