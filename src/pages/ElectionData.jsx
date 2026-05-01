import React, { useState } from 'react';
import { Users, Landmark, BarChart3, PieChart, TrendingUp, Info } from 'lucide-react';
import './electionData.css';

const ElectionData = () => {
  const [activeTab, setActiveTab] = useState('candidates');

  const candidates = [
    { id: 1, name: 'Candidate Alpha', party: 'Party A', symbol: '💠', constituency: 'New Delhi', education: 'Post Graduate', age: 52 },
    { id: 2, name: 'Candidate Beta', party: 'Party B', symbol: '☀️', constituency: 'New Delhi', education: 'Graduate', age: 48 },
    { id: 3, name: 'Candidate Gamma', party: 'Party C', symbol: '🍃', constituency: 'New Delhi', education: 'Doctorate', age: 61 },
    { id: 4, name: 'Candidate Delta', party: 'Independent', symbol: '🚲', constituency: 'New Delhi', education: 'Graduate', age: 35 },
  ];

  const historicalResults = [
    { year: 2019, winner: 'Party A', voteShare: '37.4%', seats: 303 },
    { year: 2014, winner: 'Party A', voteShare: '31.0%', seats: 282 },
    { year: 2009, winner: 'Party B', voteShare: '28.6%', seats: 206 },
  ];

  const turnoutStats = [
    { year: 2019, turnout: '67.4%', male: '67.0%', female: '67.2%' },
    { year: 2014, turnout: '66.4%', male: '67.1%', female: '65.6%' },
    { year: 2009, turnout: '58.2%', male: '60.2%', female: '55.8%' },
    { year: 2004, turnout: '58.1%', male: '61.7%', female: '53.6%' },
  ];

  return (
    <div className="election-data-page container animate-fade-in">
      <header className="page-header">
        <h1>Candidate & Election Data</h1>
        <p>Comprehensive, unbiased information on candidates and historical election statistics.</p>
      </header>

      <div className="data-tabs">
        <button 
          className={`tab-btn ${activeTab === 'candidates' ? 'active' : ''}`}
          onClick={() => setActiveTab('candidates')}
        >
          <Users size={18} /> Candidates
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <Landmark size={18} /> Past Results
        </button>
        <button 
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <BarChart3 size={18} /> Turnout Stats
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'candidates' && (
          <div className="candidates-section">
            <div className="section-header">
              <h3>Candidates for New Delhi (2024)</h3>
              <span className="source-note"><Info size={14} /> Data as per latest nominations</span>
            </div>
            <div className="candidate-grid">
              {candidates.map(c => (
                <div key={c.id} className="candidate-card">
                  <div className="candidate-symbol">{c.symbol}</div>
                  <div className="candidate-info">
                    <h4>{c.name}</h4>
                    <p className="party-name">{c.party}</p>
                    <div className="candidate-meta">
                      <span>Age: {c.age}</span>
                      <span>Edu: {c.education}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-section">
            <div className="section-header">
              <h3>General Election Trends</h3>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Election Year</th>
                    <th>Leading Party</th>
                    <th>Vote Share</th>
                    <th>Seats Won</th>
                  </tr>
                </thead>
                <tbody>
                  {historicalResults.map(r => (
                    <tr key={r.year}>
                      <td>{r.year}</td>
                      <td><strong>{r.winner}</strong></td>
                      <td>{r.voteShare}</td>
                      <td>{r.seats}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-section">
            <div className="section-header">
              <h3>Voter Turnout Trends</h3>
            </div>
            <div className="stats-grid">
              {turnoutStats.map(s => (
                <div key={s.year} className="stats-card">
                  <div className="stats-year">{s.year}</div>
                  <div className="stats-main">
                    <TrendingUp size={20} className="trend-icon" />
                    <span className="percentage">{s.turnout}</span>
                  </div>
                  <div className="gender-split">
                    <div><span>Male:</span> {s.male}</div>
                    <div><span>Female:</span> {s.female}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="data-insight">
              <PieChart size={18} />
              <p>Voter turnout has shown a steady increase over the last two decades, reflecting growing democratic participation.</p>
            </div>
          </div>
        )}
      </div>

      <div className="data-disclaimer">
        <p><strong>Note:</strong> All data provided is for educational and awareness purposes only. No predictions or political biases are intended. Source: Election Commission of India (ECI).</p>
      </div>
    </div>
  );
};

export default ElectionData;
