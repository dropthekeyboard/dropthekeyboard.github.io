import { cn } from '@/lib/utils';
import {
  Phone,
  MessageCircle,
  Settings,
  Camera,
  Music,
  Calendar,
  MapPin,
  Calculator,
  Clock,
  User,
} from 'lucide-react';
import type { Entity } from '@/contexts/scenario';
import { getEntityAvatarProps } from '@/components/shared/Avatar/avatarHelpers';

interface HomeScreenProps {
  className?: string;
  entity?: Entity | null;
  location?: 'customer' | 'server';
}

export function HomeScreen({
  className,
  entity,
  location = 'customer',
}: HomeScreenProps) {
  const displayName = entity?.displayName || entity?.name || 'Contact';

  // Convert entity type to component sender type
  const getComponentSenderType = (
    entityType?: 'human' | 'ai',
    location?: 'customer' | 'server'
  ): 'user' | 'ai' | 'agent' | 'server-human' => {
    // Server section의 human 타입은 server-human으로 처리
    if (location === 'server' && entityType === 'human') {
      return 'server-human';
    }

    switch (entityType) {
      case 'ai':
        return 'ai';
      case 'human':
        return 'user';
      default:
        return 'user';
    }
  };

  const senderType = getComponentSenderType(entity?.type, location);
  const avatarProps = getEntityAvatarProps(entity, senderType);

  const apps = [
    { icon: Phone, label: 'Phone', color: 'text-green-500' },
    { icon: MessageCircle, label: 'Messages', color: 'text-blue-500' },
    { icon: Camera, label: 'Camera', color: 'text-gray-600' },
    { icon: Music, label: 'Music', color: 'text-pink-500' },
    { icon: Calendar, label: 'Calendar', color: 'text-red-500' },
    { icon: MapPin, label: 'Maps', color: 'text-orange-500' },
    { icon: Calculator, label: 'Calculator', color: 'text-purple-500' },
    { icon: Clock, label: 'Clock', color: 'text-indigo-500' },
    { icon: Settings, label: 'Settings', color: 'text-gray-500' },
  ];

  return (
    <div
      className={cn(
        'relative flex flex-col h-full w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg overflow-hidden',
        className
      )}
    >
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Contact Info */}
        <div className="text-center mb-8">
          <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg overflow-hidden">
            {entity?.avatarUrl ? (
              <img
                src={entity.avatarUrl}
                alt={entity.displayName || entity.name || 'Avatar'}
                className="w-full h-full object-cover"
              />
            ) : avatarProps.src ? (
              <img
                src={avatarProps.src}
                alt={avatarProps.alt}
                className="w-full h-full object-cover"
              />
            ) : avatarProps.fallbackIcon ? (
              <avatarProps.fallbackIcon className="w-14 h-14 text-white" />
            ) : (
              <User className="w-14 h-14 text-white" />
            )}
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">
            {displayName}
          </h2>
        </div>

        {/* App Grid */}
        <div className="grid grid-cols-3 gap-6 max-w-xs mx-auto">
          {apps.map((app, index) => {
            const IconComponent = app.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-white/10 dark:hover:bg-black/10 transition-colors cursor-pointer group"
              >
                <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl shadow-md flex items-center justify-center group-hover:scale-105 transition-transform">
                  <IconComponent className={cn('w-6 h-6', app.color)} />
                </div>
                <span className="text-xs text-gray-700 dark:text-gray-300 font-medium text-center leading-tight">
                  {app.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Dock */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="bg-black/20 dark:bg-white/10 backdrop-blur-lg rounded-2xl px-6 py-3 shadow-lg">
            <div className="flex items-center space-x-6">
              <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-center">
                <Phone className="w-5 h-5 text-green-500" />
              </div>
              <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-blue-500" />
              </div>
              <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-center">
                <Settings className="w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
