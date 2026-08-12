import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Button from '../ui/Button';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter an email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Successfully subscribed to newsletter!');
    setEmail('');
  };

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-border-custom dark:border-slate-800 text-secondary-text dark:text-slate-400 py-16 transition-colors">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          {/* Brand */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-primary font-bold text-xl">
              <Sprout className="w-6 h-6" />
              <span className="text-dark-text dark:text-slate-100 tracking-tight font-extrabold">
                Krishi<span className="text-primary">Mitra</span>
              </span>
            </Link>
            <p className="text-sm font-medium">
              Empowering farmers with smart insights and data-driven crop decisions for a sustainable future.
            </p>
            <div className="flex space-x-4 text-secondary-text dark:text-slate-400 pt-2">
              <a href="#" className="hover:text-primary transition-colors cursor-pointer" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-primary transition-colors cursor-pointer" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-primary transition-colors cursor-pointer" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-primary transition-colors cursor-pointer" aria-label="Linkedin">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-dark-text dark:text-slate-200 tracking-wider uppercase mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/solutions" className="hover:text-primary transition-colors">Solutions</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-dark-text dark:text-slate-200 tracking-wider uppercase mb-4">Company</h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-sm font-bold text-dark-text dark:text-slate-200 tracking-wider uppercase mb-4">Newsletter</h4>
            <p className="text-sm font-medium">Subscribe to receive agricultural weather alerts and farming tips.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3 text-sm text-dark-text bg-white dark:bg-slate-850 border border-border-custom dark:border-slate-700 focus:outline-none focus:border-primary rounded-input transition-colors dark:text-slate-100"
              />
              <Button type="submit" variant="primary" className="h-10 px-4 shrink-0 font-bold">
                <Send size={16} />
              </Button>
            </form>
          </div>

        </div>

        <div className="border-t border-border-custom dark:border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
          <p>&copy; {new Date().getFullYear()} KrishiMitra. All rights reserved. Crafted for smart agriculture.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
