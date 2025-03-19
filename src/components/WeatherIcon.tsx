
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
  // Dynamic import of the icon from lucide-react
  const IconComponent = LucideIcons[icon as keyof typeof LucideIcons] || LucideIcons.Cloud;
  
  return (
    <IconComponent 
      size={size} 
      color={color} 
      className={`weather-icon ${className}`} 
    />
  );
};
