
import React from 'react';
import { cn } from '@/lib/utils';

interface MethodCardProps {
  title: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}

const MethodCard: React.FC<MethodCardProps> = ({
  title,
  description,
  isSelected,
  onClick,
  icon
}) => {
  return (
    <div 
      className={cn(
        'method-card',
        isSelected && 'border-spy-purple'
      )}
      onClick={onClick}
    >
      <div className="flex items-center mb-2">
        {icon && <div className="mr-2 text-spy-blue">{icon}</div>}
        <h3 className="text-lg font-bold text-spy-purple">{title}</h3>
      </div>
      <p className="text-sm text-gray-300">{description}</p>
      {isSelected && (
        <div className="mt-2 border-t border-spy-purple/30 pt-2">
          <span className="text-xs text-spy-blue">Selected</span>
        </div>
      )}
    </div>
  );
};

export default MethodCard;
