import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Send, Mail, MapPin, ArrowUpRight } from 'lucide-react';
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
    toast.success('Successfully subscribed to KrishiMitra newsletter!');
    setEmail('');
  };

  const handleSmoothScroll = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      if (!targetId) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer id="contact" className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 sm:pt-16 pb-10 transition-colors">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-10 sm:mb-12">
          
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <Link to="/" onClick={(e) => handleSmoothScroll(e, '#')} className="inline-flex items-center space-x-2.5 text-white font-bold text-2xl group">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-md group-hover:scale-105 transition-transform">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="tracking-tight font-extrabold text-2xl text-white">
                Krishi<span className="text-emerald-500">Mitra</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 font-medium leading-relaxed max-w-sm">
              KrishiMitra is your AI-powered smart farming companion, helping farmers make better decisions using real-time weather, market prices, crop insights, and intelligent guidance.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>HackInMotion 2026 • AI AgriTech Platform</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="sm:col-span-1 lg:col-span-2 space-y-4">
            <h4 className="text-xs font-extrabold text-white tracking-wider uppercase">Quick Links</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><a href="#" onClick={(e) => handleSmoothScroll(e, '#')} className="hover:text-emerald-400 transition-colors inline-block">Home</a></li>
              <li><a href="#features" onClick={(e) => handleSmoothScroll(e, '#features')} className="hover:text-emerald-400 transition-colors inline-block">Features</a></li>
              <li><a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, '#how-it-works')} className="hover:text-emerald-400 transition-colors inline-block">How It Works</a></li>
              <li><a href="#about" onClick={(e) => handleSmoothScroll(e, '#about')} className="hover:text-emerald-400 transition-colors inline-block">About Us</a></li>
              <li><a href="#get-started" onClick={(e) => handleSmoothScroll(e, '#get-started')} className="hover:text-emerald-400 transition-colors inline-block">Get Started</a></li>
            </ul>
          </div>

          {/* Platform & Auth */}
          <div className="sm:col-span-1 lg:col-span-2 space-y-4">
            <h4 className="text-xs font-extrabold text-white tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li><Link to="/login" className="hover:text-emerald-400 transition-colors inline-block">Farmer Login</Link></li>
              <li><Link to="/register" className="hover:text-emerald-400 transition-colors inline-block">Register Account</Link></li>
              <li><a href="#problem-solution" onClick={(e) => handleSmoothScroll(e, '#problem-solution')} className="hover:text-emerald-400 transition-colors inline-block">Problem & Solution</a></li>
              <li><a href="#tech" onClick={(e) => handleSmoothScroll(e, '#tech')} className="hover:text-emerald-400 transition-colors inline-block">Technologies</a></li>
              <li><a href="#why-us" onClick={(e) => handleSmoothScroll(e, '#why-us')} className="hover:text-emerald-400 transition-colors inline-block">Why KrishiMitra</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-4">
            <h4 className="text-xs font-extrabold text-white tracking-wider uppercase">Stay Informed</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Subscribe to receive instant weather alerts, mandi price updates, and crop advice.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3.5 text-xs text-white bg-slate-800 border border-slate-700 focus:outline-none focus:border-emerald-500 rounded-xl transition-colors placeholder:text-slate-500"
              />
              <Button type="submit" variant="primary" className="h-10 px-4 shrink-0 font-bold bg-emerald-600 hover:bg-emerald-500 justify-center">
                <Send size={15} />
              </Button>
            </form>
            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-emerald-500 shrink-0" /> support@krishimitra.org
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-emerald-500 shrink-0" /> India AgriTech Telemetry Network
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright & legal */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4 text-center sm:text-left">
          <p>&copy; {new Date().getFullYear()} KrishiMitra Platform. All rights reserved. Data-driven decision making for smart farming.</p>
          <div className="flex items-center space-x-6 shrink-0">
            <a href="#" onClick={(e) => handleSmoothScroll(e, '#')} className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" onClick={(e) => handleSmoothScroll(e, '#')} className="hover:text-emerald-400 transition-colors">Terms of Service</a>
            <a href="#" onClick={(e) => handleSmoothScroll(e, '#')} className="hover:text-emerald-400 transition-colors flex items-center gap-1">Security <ArrowUpRight size={12} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
