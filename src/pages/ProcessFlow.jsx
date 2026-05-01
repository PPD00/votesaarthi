import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserPlus, 
  ShieldCheck, 
  MapPin, 
  Vote as VoteIcon, 
  BarChart3, 
  ChevronRight, 
  ArrowLeft,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import './processFlow.css';

const ProcessFlow = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      title: 'Register as Voter',
      icon: <UserPlus />,
      description: 'The first step to participating in democracy is getting registered in the electoral roll.',
      details: [
        'Check eligibility (18+ years)',
        'Fill Form 6 on NVSP portal',
        'Upload photo and address proof',
        'Receive EPIC (Voter ID) card'
      ],
      suggestion: 'Ready to register? Visit the official voter portal.',
      link: 'https://voters.eci.gov.in',
      linkText: 'Register Now'
    },
    {
      id: 2,
      title: 'Verify Identity',
      icon: <ShieldCheck />,
      description: 'Ensure your name exists in the current electoral roll to avoid surprises on election day.',
      details: [
        'Search name in Electoral Roll',
        'Verify EPIC details are correct',
        'Check for your polling station name',
        'Update details if necessary via Form 8'
      ],
      suggestion: 'Already registered? Check your name in the list.',
      link: 'https://electoralsearch.eci.gov.in',
      linkText: 'Search Electoral Roll'
    },
    {
      id: 3,
      title: 'Find Polling Booth',
      icon: <MapPin />,
      description: 'Locate exactly where you need to go to cast your vote.',
      details: [
        'Identify your Polling Station',
        'Check booth number',
        'Locate the station on map',
        'Check for transport or parking if needed'
      ],
      suggestion: 'Not sure where to go? Use our Booth Finder.',
      link: '/booth-finder',
      linkText: 'Find my Booth',
      isInternal: true
    },
    {
      id: 4,
      title: 'Cast Vote',
      icon: <VoteIcon />,
      description: 'Make your voice heard at the polling station.',
      details: [
        'Carry your EPIC or valid Photo ID',
        'Get finger marked with indelible ink',
        'Proceed to voting compartment',
        'Press button next to your candidate on EVM'
      ],
      suggestion: 'Need help at the booth? Call the helpline.',
      link: '/helpline',
      linkText: 'View Helpline',
      isInternal: true
    },
    {
      id: 5,
      title: 'Track Results',
      icon: <BarChart3 />,
      description: 'Follow the counting process and see the outcome of the elections.',
      details: [
        'Stay updated on Counting Day',
        'Follow official ECI result portal',
        'Check constituency-wise trends',
        'Verify final winning candidates'
      ],
      suggestion: 'Want to know when results are out? Check the timeline.',
      link: '/timeline',
      linkText: 'Election Timeline',
      isInternal: true
    }
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
  };

  const handlePrev = () => {
    if (activeStep > 0) setActiveStep(activeStep - 1);
  };

  return (
    <div className="process-flow-page container animate-fade-in">
      <header className="page-header">
        <h1>Voter Journey</h1>
        <p>A simple 5-step guide to exercising your democratic right.</p>
      </header>

      <div className="process-tracker">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className={`tracker-step ${index <= activeStep ? 'active' : ''} ${index < activeStep ? 'completed' : ''}`}
            onClick={() => setActiveStep(index)}
          >
            <div className="step-bubble">
              {index < activeStep ? <CheckCircle2 size={20} /> : step.icon}
            </div>
            <span className="step-label">{step.title}</span>
            {index < steps.length - 1 && <div className="step-line"></div>}
          </div>
        ))}
      </div>

      <div className="active-step-content">
        <div className="step-card">
          <div className="step-card-header">
            <span className="step-number-tag">Step {steps[activeStep].id}</span>
            <h2>{steps[activeStep].title}</h2>
          </div>
          <p className="step-desc">{steps[activeStep].description}</p>
          
          <div className="step-checklist">
            <h3>Key Tasks</h3>
            <ul>
              {steps[activeStep].details.map((detail, idx) => (
                <li key={idx}><CheckCircle2 size={16} className="task-icon" /> {detail}</li>
              ))}
            </ul>
          </div>

          <div className="step-suggestion">
            <p>{steps[activeStep].suggestion}</p>
            {steps[activeStep].isInternal ? (
              <Link to={steps[activeStep].link} className="suggestion-link">
                {steps[activeStep].linkText} <ArrowRight size={16} />
              </Link>
            ) : (
              <a href={steps[activeStep].link} target="_blank" rel="noopener noreferrer" className="suggestion-link">
                {steps[activeStep].linkText} <ChevronRight size={16} />
              </a>
            )}
          </div>

          <div className="step-navigation">
            <button 
              className="btn btn-outline" 
              onClick={handlePrev} 
              disabled={activeStep === 0}
            >
              <ArrowLeft size={18} /> Previous
            </button>
            <button 
              className="btn btn-primary" 
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
            >
              Next Step <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
      
      {activeStep === steps.length - 1 && (
        <div className="congrats-banner">
          <CheckCircle2 size={40} />
          <div>
            <h3>You're informed and ready!</h3>
            <p>Following these steps ensures a smooth voting experience. Share this guide with others.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessFlow;
