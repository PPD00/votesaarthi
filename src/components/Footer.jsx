import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-info">
          <h3>VoteSaarthi</h3>
          <p>Your Smart Election Guide for a better democracy.</p>
        </div>
        <div className="footer-links">
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/guide">Election Guide</a></li>
              <li><a href="/timeline">Key Dates</a></li>
              <li><a href="/helpline">Contact Support</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Official Resources</h4>
            <ul>
              <li><a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer">ECI Website</a></li>
              <li><a href="https://voters.eci.gov.in" target="_blank" rel="noopener noreferrer">Voter Portal</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} VoteSaarthi. Independent Voter Assistant.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
