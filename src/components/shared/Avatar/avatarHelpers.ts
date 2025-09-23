import { User } from 'lucide-react';
import logo from '@/assets/skt_logo.jpg';
import customerAvatar from '/assets/avatars/customer.png';
import type { SenderType, Entity, Scenario } from '@/contexts/scenario';

// Helper function to get avatar props based on sender type
export function getAvatarProps(
  senderType?: 'user' | 'ai' | 'agent' | 'server-human'
) {
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
        src: customerAvatar,
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

// Helper function to get avatar props for Entity with custom avatar support
export function getEntityAvatarProps(
  entity?: Entity | null,
  fallbackSenderType?: 'user' | 'ai' | 'agent' | 'server-human'
) {
  // Entity에 avatarUrl이 있으면 우선 사용
  if (entity?.avatarUrl) {
    return {
      src: entity.avatarUrl,
      alt: entity.displayName || entity.name || 'Avatar',
      fallbackIcon: undefined,
    };
  }

  // 없으면 기존 로직 사용
  return getAvatarProps(fallbackSenderType);
}

// Helper function to find entity by name from scenario
export function findEntityByName(scenario: Scenario, entityName: string): Entity | null {
  console.log(`🔍 findEntityByName: Looking for "${entityName}"`);
  console.log('📋 Available entities:', {
    customer: scenario.customer.name,
    agents: scenario.agents.map(a => a.name),
    servers: scenario.servers.map(s => s.name)
  });

  // Check customer
  if (scenario.customer.name === entityName) {
    console.log(`✅ Found customer: ${scenario.customer.name} → ${scenario.customer.avatarUrl}`);
    return scenario.customer;
  }

  // Check agents
  const agent = scenario.agents.find(agent => agent.name === entityName);
  if (agent) {
    console.log(`✅ Found agent: ${agent.name} → ${agent.avatarUrl}`);
    return agent;
  }

  // Check servers
  const server = scenario.servers.find(server => server.name === entityName);
  if (server) {
    console.log(`✅ Found server: ${server.name} → ${server.avatarUrl}`);
    return server;
  }

  console.log(`❌ Entity "${entityName}" not found`);
  return null;
}

// Helper function to get avatar props based on message context
export function getMessageAvatarProps(
  messageFrom: string,
  ownerName: string,
  messageFromEntity?: Entity | null,
  fallbackSenderType?: 'user' | 'ai' | 'agent' | 'server-human'
) {
  console.log(`🎭 getMessageAvatarProps: messageFrom="${messageFrom}", ownerName="${ownerName}"`);
  console.log('🎭 messageFromEntity:', messageFromEntity);
  console.log('🎭 fallbackSenderType:', fallbackSenderType);

  // 메시지가 owner로부터 온 경우 - 사용자 Avatar 사용
  if (messageFrom === ownerName) {
    console.log('🎭 ✅ Using owner avatar (user type)');
    return getAvatarProps('user');
  }

  // 메시지 발신자의 entity가 있고 avatarUrl이 있으면 해당 Avatar 사용
  if (messageFromEntity?.avatarUrl) {
    console.log(`🎭 ✅ Using messageFromEntity avatar: ${messageFromEntity.avatarUrl}`);
    return {
      src: messageFromEntity.avatarUrl,
      alt: messageFromEntity.displayName || messageFromEntity.name || 'Avatar',
      fallbackIcon: undefined,
    };
  }

  // entity가 없으면 senderType 기반으로 결정
  console.log(`🎭 ⚠️ Falling back to senderType: ${fallbackSenderType}`);
  return getAvatarProps(fallbackSenderType);
}
