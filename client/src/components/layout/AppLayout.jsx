import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import KrishiMitraFloatingButton from '../ui/KrishiMitraFloatingButton';

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-custom selection:bg-primary selection:text-white">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Responsive Content Container */}
      <main className="flex-1">{children}</main>

      {/* Floating KrishiMitra Voice Companion Button */}
      <KrishiMitraFloatingButton />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AppLayout;
