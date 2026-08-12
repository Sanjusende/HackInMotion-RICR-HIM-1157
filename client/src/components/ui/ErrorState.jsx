import React from 'react';
import Button from './Button';
import { AlertCircle } from 'lucide-react';

const ErrorState = ({
  title = 'Something went wrong',
  description = 'We encountered an error while processing your request. Please try again.',
  actionText = 'Retry',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border border-red-100 rounded-card bg-red-50/30 max-w-lg mx-auto">
      <div className="p-4 bg-danger/10 rounded-full text-danger mb-4">
        <AlertCircle size={40} />
      </div>
      <h3 className="text-lg font-bold text-dark-text mb-2">{title}</h3>
      <p className="text-secondary-text text-sm mb-6 max-w-sm">{description}</p>
      {onAction && (
        <Button variant="danger" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
