import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  shadow = 'medium', // 'small' | 'medium' | 'large' | 'glass'
  hoverLift = true,
  className = '',
  onClick,
  ...props
}) => {
  const shadowClasses = {
    small: 'shadow-small',
    medium: 'shadow-medium',
    large: 'shadow-large',
    glass: 'shadow-glass backdrop-blur-md bg-white/80 border border-white/20',
  };

  return (
    <motion.div
      onClick={onClick}
      whileHover={hoverLift ? { y: -6, boxShadow: 'var(--shadow-large)' } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`bg-white rounded-card border border-border-custom overflow-hidden transition-colors ${shadowClasses[shadow]} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
