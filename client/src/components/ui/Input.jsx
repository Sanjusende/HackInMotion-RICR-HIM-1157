import React from 'react';

const Input = React.forwardRef(
  (
    {
      label,
      id,
      type = 'text',
      error,
      success,
      icon: Icon,
      disabled = false,
      className = '',
      placeholder,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`w-full flex flex-col space-y-1.5 ${className}`}>
        {label && (
          <label htmlFor={id} className="text-sm font-semibold text-dark-text">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {Icon && (
            <div className="absolute left-4 text-secondary-text pointer-events-none">
              <Icon size={20} />
            </div>
          )}
          <input
            ref={ref}
            id={id}
            type={type}
            disabled={disabled}
            placeholder={placeholder}
            className={`w-full h-12 bg-white text-dark-text rounded-input border-2 px-4 transition-all focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200
            ${Icon ? 'pl-11' : ''}
            ${
              error
                ? 'border-danger focus:border-danger focus:ring-danger/20'
                : success
                  ? 'border-success focus:border-success focus:ring-success/20'
                  : 'border-border-custom focus:border-primary focus:ring-primary/20'
            }
          `}
            {...props}
          />
          {success && !error && (
            <div className="absolute right-4 text-success pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>
        {error && <p className="text-xs font-medium text-danger mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
