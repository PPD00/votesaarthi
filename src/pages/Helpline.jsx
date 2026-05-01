import React, { useState, useMemo, useCallback } from 'react';
import { 
  Phone, 
  ShieldAlert, 
  Volume2, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  MessageCircle,
  Mail,
  Scale
} from 'lucide-react';
import helplineData from '../data/helpline.json';
import flowsData from '../data/flows.json';
import './helpline.css';

const Helpline = () => {
  const [activeIssue, setActiveIssue] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Transform flowsData into common issues for the UI
  const commonIssues = useMemo(() => {
    return flowsData
      .filter(flow => flow.steps) // Only those with steps
      .map((flow, index) => ({
        id: index + 1,
        title: flow.intent.replace(/_/g, ' '),
        explanation: flow.helplineRecommended ? 
          `This issue is high priority. ${helplineData.label} is recommended.` : 
          "Follow these steps for a quick resolution.",
        steps: flow.steps
      }));
  }, []);

  const handleSpeak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onstart = () => setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    }
  }, [isSpeaking]);

  const handleCall = () => {
    window.location.href = `tel:${helplineData.number}`;
  };

  return (
    <div className="helpline-page container animate-fade-in">
      <header className="page-header">
        <h1>Help & Support</h1>
        <p>Expert guidance and direct support for all your election-related concerns.</p>
      </header>

      <section className="primary-actions">
        <div className="call-hero-card">
          <div className="call-info">
            <div className="pulse-circle"><Phone size={32} /></div>
            <div>
              <h2>{helplineData.label}</h2>
              <p>{helplineData.description}</p>
              <span className="phone-num">{helplineData.number}</span>
            </div>
          </div>
          <button className="btn btn-primary btn-lg call-btn" onClick={handleCall}>
            <Phone size={20} /> Call Support Now
          </button>
        </div>
      </section>

      <section className="common-issues-section">
        <div className="section-title">
          <Info size={24} className="text-accent" />
          <h2>Common Issues & Guidance</h2>
        </div>
        
        <div className="issues-list">
          {commonIssues.map((issue) => (
            <div key={issue.id} className={`issue-item ${activeIssue === issue.id ? 'active' : ''}`}>
              <div 
                className="issue-header" 
                onClick={() => setActiveIssue(activeIssue === issue.id ? null : issue.id)}
              >
                <h3 style={{ textTransform: 'capitalize' }}>{issue.title.toLowerCase()}</h3>
                <div className="header-actions">
                  <button 
                    className={`tts-btn ${isSpeaking ? 'speaking' : ''}`} 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(`${issue.title}. ${issue.explanation}. Steps: ${issue.steps.join('. ')}`);
                    }}
                    title="Read Aloud"
                  >
                    <Volume2 size={18} />
                  </button>
                  {activeIssue === issue.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
              
              {activeIssue === issue.id && (
                <div className="issue-body animate-slide-down">
                  <p className="explanation">{issue.explanation}</p>
                  <div className="guidance-steps">
                    <h4>Resolution Steps:</h4>
                    <ul>
                      {issue.steps.map((step, idx) => (
                        <li key={idx}>
                          <span className="step-count">{idx + 1}</span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="secondary-support-grid">
        <div className="support-card">
          <MessageCircle size={32} className="card-icon" />
          <h3>WhatsApp Support</h3>
          <p>Get quick automated responses for voter registration and booth details.</p>
          <a href="https://wa.me/919111111950" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            Open WhatsApp
          </a>
        </div>
        <div className="support-card">
          <Mail size={32} className="card-icon" />
          <h3>Email Grievance</h3>
          <p>For formal complaints or reporting electoral malpractice.</p>
          <a href="mailto:complaints@eci.gov.in" className="btn btn-outline">
            Send Email
          </a>
        </div>
        <div className="support-card">
          <Scale size={32} className="card-icon" />
          <h3>Know Your Rights</h3>
          <p>Review the comprehensive Voter's Guide to stay empowered.</p>
          <button className="btn btn-outline" onClick={() => handleSpeak("Voter Rights: Review your fundamental rights as an Indian citizen.")}>
            Listen to Rights <Volume2 size={16} />
          </button>
        </div>
      </div>

      <footer className="support-footer">
        <p><ShieldAlert size={14} /> In case of immediate emergency or threat, please contact local law enforcement (100) or use the cVIGIL app.</p>
      </footer>
    </div>
  );
};

export default Helpline;
