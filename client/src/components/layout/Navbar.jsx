import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, Sprout, X } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Features', path: '/#features' },
  { name: 'How it works', path: '/#how-it-works' },
  { name: 'Contact', path: '/#contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  useEffect(() => { const onScroll = () => setIsScrolled(window.scrollY > 10); window.addEventListener('scroll', onScroll); return () => window.removeEventListener('scroll', onScroll); }, []);
  useEffect(() => setIsOpen(false), [location]);
  const actions = user ? <><Link to="/dashboard"><Button variant="secondary" size="sm">Dashboard</Button></Link><Button variant="primary" size="sm" onClick={logout}>Log out</Button></> : <><Link to="/login"><Button variant="secondary" size="sm">Log in</Button></Link><Link to="/register"><Button variant="primary" size="sm">Get started</Button></Link></>;
  return <nav className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-surface/85 backdrop-blur-md border-b border-border-custom shadow-small' : 'bg-transparent border-b border-transparent'}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="h-16 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 text-primary"><Sprout className="w-8 h-8" /><span className="text-dark-text tracking-tight font-extrabold text-2xl">Krishi<span className="text-primary">Mitra</span></span></Link>
      <div className="hidden md:flex items-center gap-7">{navLinks.map((link) => <NavLink key={link.name} to={link.path} className="text-sm font-semibold text-secondary-text hover:text-primary transition-colors">{link.name}</NavLink>)}</div>
      <div className="hidden md:flex items-center gap-3">{actions}</div>
      <button onClick={() => setIsOpen((open) => !open)} className="md:hidden p-2 text-secondary-text hover:text-primary rounded-full" aria-label="Toggle navigation">{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
    </div></div>
    {isOpen && <div className="md:hidden bg-surface border-b border-border-custom shadow-medium px-6 py-5 space-y-5"><div className="flex flex-col gap-4">{navLinks.map((link) => <NavLink key={link.name} to={link.path} className="font-semibold text-secondary-text hover:text-primary">{link.name}</NavLink>)}</div><div className="border-t border-border-custom pt-4 flex flex-col gap-3">{actions}</div></div>}
  </nav>;
};
export default Navbar;
