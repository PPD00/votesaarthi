import React from 'react';
import AIAssistant from '../components/AIAssistant';
import { Info, ShieldCheck } from 'lucide-react';
import './assistant.css';

const Assistant = () => {
  return (
    <div className="assistant-page container animate-fade-in">
      <div className="assistant-hero">
        <h1>VoteSaarthi <span className="highlight">AI</span></h1>
        <p>Get instant, unbiased answers to all your election and voting queries.</p>
      </div>

      <AIAssistant />

      <div className="assistant-footer-info">
        <div className="info-card">
          <ShieldCheck size={20} className="icon-secure" />
          <div>
            <h4>Privacy Protected</h4>
            <p>Your conversations are secure. We do not store sensitive PII like Aadhaar numbers.</p>
          </div>
        </div>
        <div className="info-card">
          <Info size={20} className="icon-info" />
          <div>
            <h4>Official Information</h4>
            <p>Responses are generated based on ECI guidelines and verified civic datasets.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
