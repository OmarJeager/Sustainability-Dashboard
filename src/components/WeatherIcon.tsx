
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
  // Using type assertion to fix the TypeScript error
  const IconComponent = (LucideIcons as Record<string, React.FC<any>>)[icon] || LucideIcons.Cloud;
  
  return (
    <IconComponent 
      size={size} 
      color={color} 
      className={`weather-icon ${className}`} 
    />
  );
};
