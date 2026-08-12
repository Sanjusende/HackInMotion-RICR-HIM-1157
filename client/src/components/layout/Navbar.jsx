import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Sprout } from 'lucide-react';
import Button from '../ui/Button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page transition
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
  ];

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/80 backdrop-blur-md border-b border-border-custom shadow-small'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-primary font-bold text-xl cursor-pointer">
            <Sprout className="w-8 h-8 text-primary" />
            <span className="text-dark-text tracking-tight font-extrabold text-2xl">
              Krishi<span className="text-primary">Mitra</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `font-semibold text-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'text-primary'
                      : 'text-secondary-text hover:text-dark-text'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login">
              <Button variant="secondary" size="sm">
                Log In
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="primary" size="sm">
                Get started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-secondary-text hover:text-dark-text focus:outline-none p-2 rounded-full cursor-pointer"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Links */}
      {isOpen && (
        <div className="md:hidden bg-surface border-b border-border-custom shadow-medium absolute top-16 left-0 right-0 py-4 px-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `font-semibold text-base transition-colors cursor-pointer ${
                    isActive ? 'text-primary' : 'text-secondary-text'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
          <div className="border-t border-border-custom pt-4 flex flex-col space-y-3">
            <Link to="/login" className="w-full">
              <Button variant="secondary" size="md" fullWidth>
                Log In
              </Button>
            </Link>
            <Link to="/register" className="w-full">
              <Button variant="primary" size="md" fullWidth>
                Get Start
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
