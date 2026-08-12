import React from 'react';

const PageHeader = ({
  title,
  description,
  actions,
  className = '',
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border-custom mb-8 ${className}`}>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-dark-text">{title}</h1>
        {description && (
          <p className="text-secondary-text text-base font-medium max-w-2xl">{description}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center space-x-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
