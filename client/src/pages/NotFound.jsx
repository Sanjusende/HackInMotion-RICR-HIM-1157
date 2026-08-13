import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-6">
      <div className="p-6 bg-primary/10 rounded-full text-primary animate-bounce">
        <FileQuestion size={64} />
      </div>
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold text-dark-text">404 - Page Not Found</h1>
        <p className="text-secondary-text max-w-md mx-auto">
          The page you are looking for does not exist or has been moved to another location.
        </p>
      </div>
      <Link to="/" className="pt-2">
        <Button variant="primary" className="flex items-center gap-2">
          <Home size={18} /> Return Home
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
