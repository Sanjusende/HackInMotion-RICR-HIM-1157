import React from 'react';
import { Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../ui/Card';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-bg-custom relative overflow-hidden">
      {/* Background blurs */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-accent/5 blur-3xl -z-10 animate-pulse" />

      <Card shadow="large" className="w-full max-w-md p-8 bg-white border border-border-custom" hoverLift={false}>
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="p-3 bg-primary/10 rounded-full text-primary mb-3 hover:scale-105 transition-transform">
            <Sprout size={32} />
          </Link>
          <h2 className="text-2xl font-extrabold text-dark-text tracking-tight">{title}</h2>
          {subtitle && (
            <p className="text-secondary-text font-medium text-sm mt-1.5 text-center">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </Card>
    </div>
  );
};

export default AuthLayout;
