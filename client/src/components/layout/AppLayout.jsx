import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-bg-custom selection:bg-primary selection:text-white">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Main Responsive Content Container */}
      <main >
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AppLayout;
