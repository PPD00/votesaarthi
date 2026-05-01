import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import './layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout-wrapper">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
