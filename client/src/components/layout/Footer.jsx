import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-border-custom text-secondary-text py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-primary font-bold text-xl">
              <Sprout className="w-6 h-6" />
              <span className="text-dark-text tracking-tight font-extrabold">
                Krishi<span className="text-primary">Mitra</span>
              </span>
            </Link>
            <p className="text-sm font-medium">
              Empowering farmers with smart insights and data-driven crop decisions for a sustainable future.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-dark-text tracking-wider uppercase mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/profile/setup" className="hover:text-primary transition-colors">Profile Setup</Link>
              </li>
            </ul>
          </div>

          {/* Modules */}
          <div>
            <h4 className="text-sm font-bold text-dark-text tracking-wider uppercase mb-4">Decision Engines</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-primary transition-colors cursor-pointer">Soil Advisor</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Crop Prediction</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Market Analytics</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Smart Alerts</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold text-dark-text tracking-wider uppercase mb-4">Contact & Support</h4>
            <p className="text-sm mb-2">support@krishimitra.org</p>
            <p className="text-sm">+1 (555) 019-2834</p>
          </div>
        </div>

        <div className="border-t border-border-custom mt-8 pt-8 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} KrishiMitra. All rights reserved. Crafted for smart agriculture.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
