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

  return (
    <footer
      id="contact"
      className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 transition-colors"
    >
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="flex items-center space-x-2 text-white font-bold text-2xl">
              <div className="p-1.5 bg-emerald-600 text-white rounded-xl">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="tracking-tight font-extrabold">
                Krishi<span className="text-emerald-500">Mitra</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 font-medium leading-relaxed max-w-sm">
              KrishiMitra is your AI-powered smart farming companion, helping farmers make better
              decisions using real-time weather, market prices, crop insights, and intelligent
              guidance.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>HackInMotion 2026 • AI AgriTech Platform</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-extrabold text-white tracking-wider uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <a href="#" className="hover:text-emerald-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-emerald-400 transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-emerald-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#get-started" className="hover:text-emerald-400 transition-colors">
                  Get Started
                </a>
              </li>
            </ul>
          </div>

          {/* Platform & Auth */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-extrabold text-white tracking-wider uppercase mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <Link to="/login" className="hover:text-emerald-400 transition-colors">
                  Farmer Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-emerald-400 transition-colors">
                  Register Account
                </Link>
              </li>
              <li>
                <a href="#problem-solution" className="hover:text-emerald-400 transition-colors">
                  Problem & Solution
                </a>
              </li>
              <li>
                <a href="#tech" className="hover:text-emerald-400 transition-colors">
                  Technologies
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-emerald-400 transition-colors">
                  Why KrishiMitra
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-extrabold text-white tracking-wider uppercase mb-4">
              Stay Informed
            </h4>
            <p className="text-xs text-slate-400 font-medium">
              Subscribe to receive instant weather alerts, mandi price updates, and crop advice.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 px-3.5 text-xs text-white bg-slate-800 border border-slate-700 focus:outline-none focus:border-emerald-500 rounded-xl transition-colors placeholder:text-slate-500"
              />
              <Button
                type="submit"
                variant="primary"
                className="h-10 px-4 shrink-0 font-bold bg-emerald-600 hover:bg-emerald-500"
              >
                <Send size={15} />
              </Button>
            </form>
            <div className="pt-2 space-y-1.5 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <Mail size={14} className="text-emerald-500" /> support@krishimitra.org
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-emerald-500" /> India AgriTech Telemetry Network
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & legal */}
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} KrishiMitra Platform. All rights reserved. Data-driven
            decision making for smart farming.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              Security <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
