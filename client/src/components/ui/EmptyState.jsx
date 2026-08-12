import React from 'react';
import Button from './Button';

const EmptyState = ({
  title = 'No Data Found',
  description = 'There is currently no information available in this section.',
  actionText,
  onAction,
  icon: Icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border-custom rounded-card bg-white max-w-lg mx-auto">
      <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
        {Icon ? (
          <Icon size={40} />
        ) : (
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        )}
      </div>
      <h3 className="text-lg font-bold text-dark-text mb-2">{title}</h3>
      <p className="text-secondary-text text-sm mb-6 max-w-sm">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
