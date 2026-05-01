import React, { useMemo } from 'react';
import { Calendar, Clock, CheckCircle, Info, Megaphone, Vote, BarChart, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import timelineData from '../data/timeline.json';
import './timeline.css';

const Timeline = () => {
  const { userData } = useAuth();
  
  // Mapping icons to phase names from JSON
  const getIcon = (name) => {
    switch (name) {
      case 'Voter Registration': return <UserPlus size={24} />;
      case 'Verification': return <Megaphone size={24} />;
      case 'Voting Day': return <Vote size={24} />;
      case 'Counting & Results': return <BarChart size={24} />;
      default: return <Calendar size={24} />;
    }
  };

  // Enhance JSON data with UI logic (status, dates, icons)
  const phases = useMemo(() => {
    const statusMap = ['completed', 'active', 'upcoming', 'upcoming'];
    const dateMap = [
      'Jan 01 - Mar 15, 2024',
      'Mar 16 - Apr 17, 2024',
      'April 19 - June 01, 2024',
      'June 04, 2024'
    ];

    return timelineData.phases.map((phase, index) => ({
      ...phase,
      id: index + 1,
      status: statusMap[index],
      dateRange: dateMap[index],
      icon: getIcon(phase.name)
    }));
  }, []);

  const currentPhaseIndex = phases.findIndex(p => p.status === 'active') || 0;

  return (
    <div className="timeline-page container animate-fade-in">
      <header className="page-header">
        <h1>{timelineData.election} Lifecycle</h1>
        <p>Stay aware of the key phases in the democratic process.</p>
        {userData?.state && (
          <div className="local-info-badge">
            <Info size={14} /> Localized updates for <strong>{userData.state}</strong> are active.
          </div>
        )}
      </header>

      <section className="awareness-section">
        <div className="lifecycle-progress">
          {phases.map((phase, index) => (
            <div key={phase.id} className={`progress-node ${phase.status}`}>
              <div className="node-icon">{phase.icon}</div>
              <span className="node-label">{phase.name}</span>
              {index < phases.length - 1 && <div className="node-connector"></div>}
            </div>
          ))}
        </div>

        <div className="current-phase-highlight">
          <div className="highlight-badge">Current Phase</div>
          <div className="highlight-content">
            <Megaphone className="pulse-icon" />
            <div>
              <h3>{phases[currentPhaseIndex].name}</h3>
              <p>{phases[currentPhaseIndex].description}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="timeline-container vertical">
        {phases.map((phase) => (
          <div key={phase.id} className={`timeline-item ${phase.status}`}>
            <div className="timeline-dot">
              {phase.status === 'completed' ? <CheckCircle size={18} /> : 
               phase.status === 'active' ? <Clock size={18} className="spin-icon" /> : 
               <div className="dot-inner" />}
            </div>
            <div className="timeline-content">
              <div className="event-date">{phase.dateRange}</div>
              <h3>{phase.name}</h3>
              <p>{phase.description}</p>
              {phase.status === 'active' && (
                <div className="active-tag">Active Phase</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="timeline-footer">
        <p><Calendar size={16} /> Official schedule maintained by the Election Commission of India.</p>
      </div>
    </div>
  );
};

export default Timeline;
