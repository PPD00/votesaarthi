import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Globe, CheckCircle2, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import './onboarding.css';

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    state: '',
    district: '',
    area: '',
    pincode: '',
    language: 'English'
  });
  
  const { currentUser, updatePreferences } = useAuth();
  const navigate = useNavigate();

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updatePreferences(currentUser.uid, {
        ...formData,
        onboardingComplete: true,
        updatedAt: new Date().toISOString()
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error("Error saving preferences:", err);
    } finally {
      setLoading(false);
    }
  };

  const states = ['Delhi', 'Maharashtra', 'Karnataka', 'Uttar Pradesh', 'Tamil Nadu'];
  const languages = ['English', 'Hindi', 'Marathi', 'Kannada', 'Tamil', 'Telugu', 'Bengali'];

  if (success) {
    return (
      <div className="onboarding-page container animate-fade-in">
        <div className="onboarding-card success-view">
          <CheckCircle2 size={80} className="success-icon" />
          <h1>Profile Ready!</h1>
          <p>Redirecting you to your personalized dashboard...</p>
          <div className="loader-bar"><div className="loader-fill"></div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="onboarding-page container animate-fade-in">
      <div className="onboarding-card" role="main" aria-label="Onboarding Progress">
        <div className="progress-bar" role="progressbar" aria-valuenow={step} aria-valuemin="1" aria-valuemax="3">
          <div className="progress" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        {step === 1 && (
          <div className="step-content">
            <div className="step-header">
              <div className="icon-wrapper" aria-hidden="true"><Globe /></div>
              <h1>Preferred Language</h1>
              <p>Select the language you'd like to use for your election guide.</p>
            </div>
            <div className="language-grid" role="radiogroup" aria-label="Choose Language">
              {languages.map(lang => (
                <button 
                  key={lang}
                  role="radio"
                  aria-checked={formData.language === lang}
                  className={`lang-btn ${formData.language === lang ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, language: lang})}
                >
                  {lang}
                </button>
              ))}
            </div>
            <button 
              className="btn btn-primary next-btn" 
              onClick={handleNext}
              aria-label="Continue to location selection"
            >
              Continue <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="step-content">
            <div className="step-header">
              <div className="icon-wrapper" aria-hidden="true"><MapPin /></div>
              <h1>Your Location</h1>
              <p>This helps us show you relevant timelines and nearby booths.</p>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="state-select">State</label>
                <select 
                  id="state-select"
                  value={formData.state} 
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                  aria-required="true"
                >
                  <option value="">Select State</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="district-input">District</label>
                <input 
                  id="district-input"
                  type="text" 
                  placeholder="Enter District"
                  value={formData.district}
                  onChange={(e) => setFormData({...formData, district: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label htmlFor="area-input">Area / Locality</label>
                <input 
                  id="area-input"
                  type="text" 
                  placeholder="Enter Area"
                  value={formData.area}
                  onChange={(e) => setFormData({...formData, area: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label htmlFor="pincode-input">Pincode</label>
                <input 
                  id="pincode-input"
                  type="text" 
                  placeholder="6-digit Pincode"
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                  aria-required="true"
                />
              </div>
            </div>
            <div className="step-actions">
              <button className="btn-text" onClick={handleBack} aria-label="Go back to language selection">
                <ArrowLeft size={16} /> Back
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleNext} 
                disabled={!formData.state || !formData.pincode}
                aria-label="Continue to summary"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <div className="step-header">
              <div className="icon-wrapper success" aria-hidden="true"><CheckCircle2 /></div>
              <h1>All Set!</h1>
              <p>Your profile is ready. We'll personalize your experience based on your preferences.</p>
            </div>
            <div className="summary-card" aria-label="Profile Summary">
              <div className="summary-item"><strong>Language:</strong> {formData.language}</div>
              <div className="summary-item"><strong>Location:</strong> {formData.area || 'N/A'}, {formData.district || 'N/A'}, {formData.state}</div>
            </div>
            <div className="step-actions">
              <button className="btn-text" onClick={handleBack} disabled={loading} aria-label="Go back to location selection">
                <ArrowLeft size={16} /> Back
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handleSubmit}
                disabled={loading}
                aria-label="Finalize setup and get started"
              >
                {loading ? <Loader2 className="spin-icon" size={18} /> : 'Get Started'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
