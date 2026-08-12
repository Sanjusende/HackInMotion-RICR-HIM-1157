import React from 'react';

const Section = ({
  children,
  title,
  subtitle,
  background = 'transparent', // 'transparent' | 'surface' | 'sidebar'
  className = '',
  ...props
}) => {
  const bgClasses = {
    transparent: 'bg-transparent',
    surface: 'bg-surface border-y border-border-custom',
    sidebar: 'bg-sidebar-bg border-y border-border-custom',
  };

  return (
    <section
      className={`py-12 md:py-16 ${bgClasses[background]} ${className}`}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12 space-y-3">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold text-dark-text tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-secondary-text text-base md:text-lg font-medium">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;
