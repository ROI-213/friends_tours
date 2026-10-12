import React from 'react';
import { 
  Compass, 
  ArrowRight, 
  PhoneCall, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  HeartHandshake 
} from 'lucide-react';
import '../../styles/finalcta.css';

export const FinalCTA = ({ onBookJourney, onTalkToTeam }) => {
  return (
    <section id="final-cta" className="finalcta-section" aria-label="Book Your Next Bangalore Journey">
      
      {/* Background Image Stage */}
      <div className="finalcta-bg-wrapper">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80"
          alt="Scenic Bangalore outstation highway journey"
          className="finalcta-bg-image"
          loading="lazy"
        />
        <div className="finalcta-overlay" />
        <div className="finalcta-radial-glow" />
      </div>

      {/* Centered Content Container */}
      <div className="finalcta-container reveal-scale">
        
        {/* Small Eyebrow */}
        <span className="finalcta-eyebrow">
          <Sparkles size={13} />
          <span>YOUR JOURNEY STARTS HERE</span>
        </span>

        {/* Main Heading */}
        <h2 className="finalcta-title">WHERE WILL YOU GO FROM BANGALORE?</h2>

        {/* Supporting Text */}
        <p className="finalcta-desc">
          From airport transfers to weekend escapes, we're ready for your next journey.
        </p>

        {/* CTA Buttons Row */}
        <div className="finalcta-btn-row">
          <button
            className="btn-finalcta-primary shimmer-hover"
            onClick={onBookJourney}
            aria-label="Book your journey"
          >
            <span>Book Your Journey</span>
            <ArrowRight size={16} />
          </button>

          <button
            className="btn-finalcta-secondary"
            onClick={onTalkToTeam}
            aria-label="Talk to our team"
          >
            <PhoneCall size={15} />
            <span>Talk to Our Team</span>
          </button>
        </div>

        {/* Trust Micro-Row */}
        <div className="finalcta-trust-row" aria-label="Key Commitments">
          <div className="finalcta-trust-item">
            <Check size={14} color="#FA4616" strokeWidth={3} />
            <span>Comfortable Travel</span>
          </div>

          <span className="finalcta-trust-dot">•</span>

          <div className="finalcta-trust-item">
            <Check size={14} color="#FA4616" strokeWidth={3} />
            <span>Local Bangalore Support</span>
          </div>

          <span className="finalcta-trust-dot">•</span>

          <div className="finalcta-trust-item">
            <Check size={14} color="#FA4616" strokeWidth={3} />
            <span>Flexible Vehicle Options</span>
          </div>
        </div>

      </div>

    </section>
  );
};
