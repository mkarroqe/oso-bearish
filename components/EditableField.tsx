'use client';

import { useState } from 'react';

interface EditableFieldProps {
  value: string | number;
  field: string;
  symbol: string;
  canEdit: boolean;
  type?: 'text' | 'number';
  prefix?: string;
  suffix?: string;
  className?: string;
  onUpdate: (symbol: string, field: string, value: string | number) => void;
}

export function EditableField({
  value,
  field,
  symbol,
  canEdit,
  type = 'text',
  prefix = '',
  suffix = '',
  className = '',
  onUpdate
}: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async () => {
    if (editValue === value.toString()) {
      setIsEditing(false);
      return;
    }

    setIsUpdating(true);
    try {
      const finalValue = type === 'number' ? parseFloat(editValue) : editValue;
      
      const response = await fetch(`/api/stocks?symbol=${symbol}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: finalValue }),
      });

      if (response.ok) {
        onUpdate(symbol, field, finalValue);
      } else {
        console.error('Failed to update field');
        setEditValue(value.toString()); // Reset on error
      }
    } catch (error) {
      console.error('Error updating field:', error);
      setEditValue(value.toString()); // Reset on error
    } finally {
      setIsUpdating(false);
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      setEditValue(value.toString());
      setIsEditing(false);
    }
  };

  const formatDisplayValue = (val: string | number) => {
    if (type === 'number' && field === 'price') {
      return Number(val).toFixed(2);
    }
    return val;
  };

  if (!canEdit) {
    return <span className={className}>{prefix}{formatDisplayValue(value)}{suffix}</span>;
  }

  if (isEditing) {
    return (
      <div className="relative">
        <input
          type={type}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          disabled={isUpdating}
          className={`bg-white border-2 border-blue-500 rounded px-2 py-1 text-sm focus:outline-none ${className}`}
          autoFocus
          style={{ width: Math.max(80, editValue.length * 8 + 20) + 'px' }}
        />
        {isUpdating && (
          <div className="absolute inset-0 bg-white/80 rounded flex items-center justify-center">
            <div className="w-3 h-3 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => {
        setEditValue(value.toString());
        setIsEditing(true);
      }}
      className={`hover:bg-blue-50 hover:border hover:border-blue-200 rounded px-2 py-1 transition-colors ${className}`}
      title={`Click to edit ${field}`}
    >
      {prefix}{formatDisplayValue(value)}{suffix}
    </button>
  );
}