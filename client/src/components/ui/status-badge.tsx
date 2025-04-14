import React from 'react';
import { Badge } from './badge';
import { CheckCircle, Clock, AlertTriangle, Ban, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type StatusType = 
  | 'Not Started' 
  | 'In Progress' 
  | 'At Risk' 
  | 'Behind' 
  | 'Completed' 
  | 'Cancelled' 
  | string;

interface StatusConfig {
  color: string;
  darkColor: string;
  icon: React.ReactNode;
  description?: string;
}

export const STATUS_CONFIG: Record<string, StatusConfig> = {
  'Not Started': {
    color: 'bg-gray-100 text-gray-800',
    darkColor: 'dark:bg-gray-800 dark:text-gray-200',
    icon: <Ban className="h-3 w-3 mr-1" />,
    description: 'Work has not yet begun on this item.'
  },
  'In Progress': {
    color: 'bg-blue-100 text-blue-800',
    darkColor: 'dark:bg-blue-900 dark:text-blue-100',
    icon: <Clock className="h-3 w-3 mr-1" />,
    description: 'Work is actively being done on this item.'
  },
  'At Risk': {
    color: 'bg-yellow-100 text-yellow-800',
    darkColor: 'dark:bg-yellow-900 dark:text-yellow-100',
    icon: <AlertTriangle className="h-3 w-3 mr-1" />,
    description: 'There are issues that may prevent this item from being completed on schedule.'
  },
  'Behind': {
    color: 'bg-red-100 text-red-800',
    darkColor: 'dark:bg-red-900 dark:text-red-100',
    icon: <AlertTriangle className="h-3 w-3 mr-1" />,
    description: 'This item is behind schedule and requires attention.'
  },
  'Completed': {
    color: 'bg-green-100 text-green-800',
    darkColor: 'dark:bg-green-900 dark:text-green-100',
    icon: <CheckCircle className="h-3 w-3 mr-1" />,
    description: 'This item has been completed successfully.'
  },
  'Cancelled': {
    color: 'bg-gray-100 text-gray-800',
    darkColor: 'dark:bg-gray-800 dark:text-gray-300',
    icon: <Ban className="h-3 w-3 mr-1" />,
    description: 'This item has been cancelled and is no longer active.'
  },
};

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({ 
  status, 
  size = 'md', 
  showIcon = true, 
  className 
}: StatusBadgeProps) {
  const statusConfig = STATUS_CONFIG[status] || {
    color: 'bg-gray-100 text-gray-800',
    darkColor: 'dark:bg-gray-800 dark:text-gray-200',
    icon: <HelpCircle className="h-3 w-3 mr-1" />,
    description: 'Status unknown'
  };

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const iconSizes = {
    sm: 'h-2.5 w-2.5 mr-0.5',
    md: 'h-3 w-3 mr-1',
    lg: 'h-4 w-4 mr-1.5'
  };

  // Clone the icon to apply the correct size
  const sizedIcon = showIcon && React.cloneElement(
    statusConfig.icon as React.ReactElement, 
    { className: iconSizes[size] }
  );

  return (
    <Badge 
      variant="outline" 
      className={cn(
        'flex items-center font-medium',
        statusConfig.color,
        statusConfig.darkColor,
        sizeClasses[size],
        className
      )}
      title={statusConfig.description}
    >
      {showIcon && sizedIcon}
      {status}
    </Badge>
  );
}