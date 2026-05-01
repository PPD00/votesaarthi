import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Info, 
  Calendar, 
  Search, 
  Phone, 
  ChevronRight, 
  ArrowRight, 
  CheckCircle2, 
  Users,
  ShieldCheck,
  MapPin,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './home.css';

const Home = () => {
  const { currentUser, userData } = useAuth();
  
  const features = useMemo(() => [
    {
      title: 'Voter Journey',
      description: 'Follow our 5-step guide to become a fully prepared voter.',
      icon: <ArrowRight className="feature-icon journey" />,
      link: '/process',
      color: 'blue'
    },
    {
      title: 'Candidates',
      description: 'View candidates, party symbols, and historical election data.',
      icon: <Users className="feature-icon candidates-icon" />,
      link: '/data',
      color: 'navy'
    },
    {
      title: 'Smart Assistant',
      description: 'Get instant answers to your election queries with our guided flows.',
      icon: <MessageSquare className="feature-icon assistant" />,
      link: '/assistant',
      color: 'saffron'
    },
    {
      title: 'Election Guide',
      description: 'Learn about registration, voting rules, and your democratic rights.',
      icon: <Info className="feature-icon guide" />,
      link: '/guide',
      color: 'blue'
    },
    {
      title: 'Election Timeline',
      description: 'Stay updated with important dates and polling phases in your area.',
      icon: <Calendar className="feature-icon timeline" />,
      link: '/timeline',
      color: 'green'
    },
    {
      title: 'Booth Finder',
      description: 'Locate your polling station and get turn-by-turn directions.',
      icon: <Search className="feature-icon finder" />,
      link: '/booth-finder',
      color: 'navy'
    },
    {
      title: 'Helpline',
      description: 'Direct support and reporting for any election-related issues.',
      icon: <Phone className="feature-icon helpline-icon" />,
      link: '/helpline',
      color: 'saffron'
    }
  ], []);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container hero-container animate-fade-in">
          <div className="hero-content">
            <span className="badge">Official Voter Support</span>
            {currentUser ? (
              <>
                <h1>Namaste, <span className="highlight">{userData?.state || 'Voter'}</span>!</h1>
                <p>Welcome to your personalized dashboard. {userData?.onboardingComplete ? 
                  `Currently following elections in ${userData.district}, ${userData.state}.` : 
                  "Complete your profile to get localized election updates."}
                </p>
                {!userData?.onboardingComplete && (
                  <Link to="/onboarding" className="personalize-banner">
                    <Sparkles size={18} /> Complete your Profile for local updates
                  </Link>
                )}
              </>
            ) : (
              <>
                <h1>Empowering Every <span className="highlight">Indian</span> Voter</h1>
                <p>VoteSaarthi is your digital companion for the world's largest democratic process. Simple, accessible, and smart.</p>
              </>
            )}
            <div className="hero-actions">
              <Link to="/assistant" className="btn btn-primary">
                Talk to Assistant <ArrowRight size={18} />
              </Link>
              {!currentUser && <Link to="/login" className="btn btn-outline">Join Now</Link>}
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-card-stack">
              <div className="hero-card c1"><ShieldCheck size={40} /><span>Secure Voting</span></div>
              <div className="hero-card c2"><Users size={40} /><span>Community First</span></div>
              <div className="hero-card c3"><MapPin size={40} /><span>Easy Access</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-grid">
        <div className="container">
          <h2 className="section-title text-center">How can we help you today?</h2>
          <div className="grid">
            {features.map((feature, index) => (
              <Link to={feature.link} key={index} className={`feature-card ${feature.color}`}>
                <div className="card-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <span className="card-link">Explore <ArrowRight size={16} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="info-strip">
        <div className="container strip-content">
          <div className="strip-item">
            <span className="strip-number">900M+</span>
            <span className="strip-label">Eligible Voters</span>
          </div>
          <div className="strip-item">
            <span className="strip-number">1M+</span>
            <span className="strip-label">Polling Stations</span>
          </div>
          <div className="strip-item">
            <span className="strip-number">100%</span>
            <span className="strip-label">Digital Support</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
