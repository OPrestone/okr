import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StatusBadge, StatusType, STATUS_CONFIG } from './status-badge';

interface StatusSelectorProps {
  value: StatusType;
  onChange: (value: StatusType) => void;
  disabled?: boolean;
  statusList?: StatusType[];
  placeholder?: string;
  className?: string;
}

export function StatusSelector({
  value,
  onChange,
  disabled = false,
  statusList,
  placeholder = 'Select status',
  className,
}: StatusSelectorProps) {
  // Use provided status list or default to all available statuses
  const availableStatuses = statusList || Object.keys(STATUS_CONFIG);

  return (
    <Select 
      value={value} 
      onValueChange={onChange} 
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder}>
          {value ? (
            <StatusBadge status={value} showIcon={true} size="sm" />
          ) : (
            placeholder
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {availableStatuses.map((status) => (
          <SelectItem key={status} value={status} className="flex items-center">
            <StatusBadge status={status} showIcon={true} size="sm" />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}