import React from 'react';

const SectionTitle = ({
  title,
  subtitle,
  badge,
  align = 'center',
  className = '',
}) => {
  const alignClass = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start';

  return (
    <div className={`flex flex-col max-w-3xl mb-10 md:mb-12 ${alignClass} ${className}`}>
      {badge && (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary mb-3 uppercase tracking-wider">
          {badge}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-extrabold text-dark-text tracking-tight leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-secondary-text text-base md:text-lg font-medium mt-3 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
