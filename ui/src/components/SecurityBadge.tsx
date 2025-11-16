import { Shield, Lock, Eye, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SecurityBadgeProps {
  type: 'encrypted' | 'anonymous' | 'verified' | 'secure';
  className?: string;
}

export function SecurityBadge({ type, className }: SecurityBadgeProps) {
  const badgeConfig = {
    encrypted: {
      icon: Lock,
      text: 'Encrypted',
      variant: 'default' as const,
      className: 'bg-green-100 text-green-800 border-green-200'
    },
    anonymous: {
      icon: Eye,
      text: 'Anonymous',
      variant: 'default' as const,
      className: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    verified: {
      icon: CheckCircle,
      text: 'Verified',
      variant: 'default' as const,
      className: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    secure: {
      icon: Shield,
      text: 'Secure',
      variant: 'default' as const,
      className: 'bg-orange-100 text-orange-800 border-orange-200'
    }
  };

  const config = badgeConfig[type];
  const IconComponent = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        'flex items-center gap-1 px-2 py-1 text-xs font-medium',
        config.className,
        className
      )}
    >
      <IconComponent className="w-3 h-3" />
      {config.text}
    </Badge>
  );
}
