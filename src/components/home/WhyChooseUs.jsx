import React from 'react';
import { 
  ShieldCheck, 
  Car, 
  Clock, 
  Headphones, 
  ArrowRight, 
  Sparkles, 
  HeartHandshake, 
  Check, 
  MessageCircle 
} from 'lucide-react';
import { BRAND } from '../../constants/branding';
import '../../styles/whychoose.css';

export const WHY_CHOOSE_REASONS = [
  {
    num: '01',
    title: 'LOCAL BANGALORE EXPERTISE',
    desc: 'Deep familiarity with Bangalore traffic corridors, airport expressways, and Karnataka highways.',
    featured: false,
  },
  {
    num: '02',
    title: 'PROFESSIONAL DRIVERS',
    desc: 'Experienced, polite, and verified highway chauffeurs dedicated to smooth and safe driving.',
    featured: false,
  },
  {
    num: '03',
    title: 'FLEXIBLE VEHICLE OPTIONS',
    desc: 'Sedans, Innova Crysta, SUVs, and Tempo Travellers tailored for individual, family, and group trips.',
    featured: false,
  },
  {
    num: '04',
    title: 'AIRPORT & CITY TRANSFERS',
    desc: 'Guaranteed on-time pickups for Kempegowda Airport and flexible hourly city rental packages.',
    featured: false,
  },
  {
    num: '05',
    title: 'CUSTOMER-FIRST SERVICE',
    desc: 'Transparent pricing with no hidden charges, clean sanitized interiors, and 24/7 trip coordination.',
    featured: true,
  },
];

export const WhyChooseUs = ({ onPlanJourney, onTalkToUs }) => {
  const microTrustPoints = [
    { label: 'Comfortable Travel' },
    { label: 'Local Bangalore Support' },
    { label: 'Flexible Vehicles' },
    { label: 'Easy Booking' },
  ];

  return (
    <section id="why-choose-us" className="whychoose-section" aria-label="Why Choose Friends Tours and Travels Bangalore">
      <div className="whychoose-container">
        
        {/* Section Header */}
        <div className="whychoose-header reveal-on-scroll">
          <span className="whychoose-eyebrow">
            <Sparkles size={13} />
            <span>WHY CHOOSE US</span>
          </span>
          <h2 className="whychoose-title">
            YOUR BANGALORE JOURNEY
            <span className="whychoose-title-dark">DESERVES THE BEST CARE.</span>
          </h2>
          <p className="whychoose-subtitle">
            From planning to arrival, we make every part of your Bangalore and Karnataka journey simple, comfortable and dependable.
          </p>
        </div>

        {/* Main 2-Column Asymmetric Grid (55% Visual / 45% Content) */}
        <div className="whychoose-main-grid">
          
          {/* Left: Dual-Image & Floating Trust Card (55%) */}
          <div className="whychoose-visual-col reveal-left">
            <div className="whychoose-image-wrapper">
              
              {/* Main Image */}
              <img
                src="/services/why-choose-chauffeur.jpg"
                alt="Friends Tours professional chauffeur with route navigation in Bangalore"
                className="whychoose-img-main"
                loading="lazy"
              />

              {/* Floating Trust Card */}
              <div className="whychoose-floating-card">
                <div className="whychoose-badge-icon">
                  <HeartHandshake size={20} />
                </div>
                <div>
                  <div className="whychoose-badge-title">YOUR JOURNEY. OUR CARE.</div>
                  <span className="whychoose-badge-sub">Bangalore Travel Partner</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right: 5 Reasons List (45%) */}
          <div className="whychoose-content-col reveal-right">
            
            <h3 className="whychoose-section-subhead">WHY TRAVEL WITH US?</h3>

            <div className="whychoose-reasons-list">
              {WHY_CHOOSE_REASONS.map((reason, wIdx) => (
                <div
                  key={reason.num}
                  className={`whychoose-reason-item reveal-on-scroll stagger-${(wIdx % 4) + 1} ${reason.featured ? 'whychoose-reason-featured' : ''}`}
                >
                  <span className="whychoose-reason-num">{reason.num}</span>
                  <div className="whychoose-reason-text">
                    <h4 className="whychoose-reason-title">{reason.title}</h4>
                    <p className="whychoose-reason-desc">{reason.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Row */}
            <div className="whychoose-cta-row">
              <button
                className="btn-whychoose-plan"
                onClick={onPlanJourney}
                aria-label="Plan your journey"
              >
                <span>Plan Your Journey</span>
                <ArrowRight size={15} />
              </button>

              <button
                className="btn-whychoose-talk"
                onClick={onTalkToUs}
                aria-label="Talk to our team"
              >
                <MessageCircle size={15} />
                <span>Talk To Us</span>
              </button>
            </div>

          </div>

        </div>

        {/* Bottom Trust Micro-Row */}
        <div className="whychoose-micro-row" aria-label="Key highlights">
          {microTrustPoints.map((point, idx) => (
            <div key={idx} className="whychoose-micro-item">
              <div className="whychoose-micro-icon">
                <Check size={14} strokeWidth={3} />
              </div>
              <span className="whychoose-micro-text">{point.label}</span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
