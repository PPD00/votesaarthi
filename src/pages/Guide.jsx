import React from 'react';
import { CheckCircle2, UserPlus, ClipboardList, Vote as VoteIcon, ShieldCheck } from 'lucide-react';
import rightsData from '../data/rights.json';
import './guide.css';

const Guide = () => {
  const processSteps = [
    {
      title: 'Registration',
      icon: <UserPlus />,
      content: 'Any Indian citizen who is 18 years or above can register as a voter. You can register online through the National Voters Service Portal (NVSP).',
      details: ['Age: 18+', 'Nationality: Indian', 'Residence: Ordinary resident']
    },
    {
      title: 'Verification',
      icon: <ClipboardList />,
      content: 'Once registered, verify your name in the electoral roll. Ensure all information like EPIC number and address is accurate.',
      details: ['Check EPIC number', 'Verify Address', 'Confirm Polling Booth']
    },
    {
      title: 'Election Day',
      icon: <VoteIcon />,
      content: 'On the day of polling, carry your Voter ID or any approved photo ID to your assigned station.',
      details: ['Carry Photo ID', 'Inking the finger', 'Press the EVM button']
    }
  ];

  return (
    <div className="guide-page container animate-fade-in">
      <header className="page-header">
        <h1>Voter Guide & Rights</h1>
        <p>Stay informed about the voting process and your fundamental rights as an Indian citizen.</p>
      </header>

      <section className="rights-section">
        <div className="section-title-with-icon">
          <ShieldCheck size={28} className="text-accent" />
          <h2>Your Fundamental Voter Rights</h2>
        </div>
        <div className="rights-grid">
          {rightsData.map((right) => (
            <div key={right.id} className="right-card">
              <h3>{right.title}</h3>
              <p>{right.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="process-guide-section">
        <div className="section-title-with-icon">
          <ClipboardList size={28} className="text-accent" />
          <h2>How the Election Process Works</h2>
        </div>
        <div className="guide-steps">
          {processSteps.map((step, index) => (
            <div key={index} className="guide-card">
              <div className="guide-card-header">
                <div className="step-number">{index + 1}</div>
                <div className="step-icon">{step.icon}</div>
                <h2>{step.title}</h2>
              </div>
              <div className="guide-card-body">
                <p>{step.content}</p>
                <ul className="step-details">
                  {step.details.map((detail, i) => (
                    <li key={i}><CheckCircle2 size={16} className="check-icon" /> {detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="documents-section">
        <h3>Accepted Identification Documents</h3>
        <p>If you don't have a Voter ID card, you can use these alternatives:</p>
        <div className="docs-grid">
          <span>Aadhaar Card</span>
          <span>PAN Card</span>
          <span>Driving License</span>
          <span>Passport</span>
          <span>Bank Passbook with Photo</span>
          <span>Pension Document</span>
        </div>
      </section>
    </div>
  );
};

export default Guide;
