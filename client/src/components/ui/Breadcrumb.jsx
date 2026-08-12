import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="flex py-3 px-5 text-secondary-text rounded-card bg-white dark:bg-slate-900 border border-border-custom dark:border-slate-800 shadow-small w-fit">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-semibold text-secondary-text hover:text-primary dark:text-slate-400 dark:hover:text-green-300 transition-colors"
          >
            <Home className="mr-2.5 h-4 w-4" />
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index}>
              <div className="flex items-center">
                <ChevronRight className="h-5 w-5 text-gray-400" />
                {isLast ? (
                  <span className="ml-1 text-sm font-bold text-dark-text dark:text-slate-200 md:ml-2">
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.path}
                    className="ml-1 text-sm font-semibold text-secondary-text hover:text-primary dark:text-slate-400 dark:hover:text-green-300 transition-colors md:ml-2"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
