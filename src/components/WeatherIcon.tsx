
import React from 'react';
import * as LucideIcons from 'lucide-react';

interface LucideIconProps {
  icon: string;
  size?: number;
  color?: string;
  className?: string;
}

export const LucideIcon: React.FC<LucideIconProps> = ({ 
  icon, 
  size = 24, 
  color,
  className = ''
}) => {
  // First cast to unknown, then to Record to fix TypeScript error
  const IconComponent = ((LucideIcons as unknown) as Record<string, React.FC<any>>)[icon] || LucideIcons.Cloud;
  
  return (
    <IconComponent 
      size={size} 
      color={color} 
      className={`weather-icon ${className}`} 
    />
  );
};
