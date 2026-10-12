import React from 'react';
import { 
  ShieldCheck, 
  Car, 
  Clock, 
  Headphones, 
  ArrowRight, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { BRAND } from '../../constants/branding';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import '../../styles/about.css';

export const AboutSection = ({ onExploreClick }) => {
  const { getSetting } = useSiteSettings();
  const aboutTitle = getSetting('about_title', 'MORE THAN A RIDE. A BETTER WAY TO TRAVEL.');
  const aboutStory = getSetting('about_story', 'Friends Tours & Travels is a Bangalore-based travel and transportation service focused on making local journeys, airport transfers, weekend escapes and outstation trips simple and comfortable.');
  const statYears = getSetting('stat_years_exp', '15+');
  const statTrips = getSetting('stat_trips_completed', '50,000+');
  const statRating = getSetting('stat_client_rating', '4.9 / 5');

  let titleLine1 = aboutTitle;
  let titleLine2 = '';
  if (aboutTitle.includes('.')) {
    const parts = aboutTitle.split('.');
    titleLine1 = parts[0].trim() + (parts.length > 1 && parts[1].trim() ? '.' : '');
    titleLine2 = parts.slice(1).join('.').trim();
  } else {
    const words = aboutTitle.trim().split(/\s+/);
    if (words.length > 2) {
      const splitIdx = Math.ceil(words.length / 2);
      titleLine1 = words.slice(0, splitIdx).join(' ');
      titleLine2 = words.slice(splitIdx).join(' ');
    }
  }

  const serviceHighlights = [
    {
      num: '01',
      title: 'AIRPORT TRANSFERS',
      desc: 'Reliable pickup and drop between Kempegowda International Airport and Bangalore.',
    },
    {
      num: '02',
      title: 'CORPORATE TRAVEL',
      desc: 'Professional transportation solutions for Bangalore businesses, employees and client visits.',
    },
    {
      num: '03',
      title: 'LOCAL TOURS',
      desc: 'Flexible hourly and full-day rental packages for Bangalore city exploration.',
    },
    {
      num: '04',
      title: 'OUTSTATION JOURNEYS',
      desc: 'Comfortable road trips from Bangalore to Mysore, Coorg, Chikkamagaluru and beyond.',
    },
  ];

  const trustPoints = [
    { label: 'Experienced Local Drivers', icon: ShieldCheck },
    { label: 'Well-Maintained Fleet', icon: Car },
    { label: 'On-Time Guaranteed', icon: Clock },
    { label: '24/7 Support Desk', icon: Headphones },
  ];

  return (
    <section id="about" className="about-section" aria-label="About Friends Tours and Travels Bangalore">
      <div className="about-container">
        
        {/* Main 2-Column Grid (55% Visual / 45% Content) */}
        <div className="about-main-grid">
          
          {/* Left: Editorial Dual-Image Composition (55%) */}
          <div className="about-visual-col reveal-left">
            <div className="about-image-wrapper">
              
              {/* Main Large Image */}
              <img
                src="/about/about-hospitality.jpg"
                alt="Friends Tours & Travels chauffeur welcoming executive client in Bangalore"
                className="about-img-main"
                loading="lazy"
              />
            </div>
          </div>

          {/* Right: Editorial About Content (45%) */}
          <div className="about-content-col reveal-right">
            
            <span className="about-eyebrow">
              <Sparkles size={13} />
              <span>ABOUT FRIENDS TOURS &amp; TRAVELS</span>
            </span>

            <h2 className="about-heading">
              {titleLine1}{' '}
              {titleLine2 && <span className="about-heading-dark">{titleLine2}</span>}
            </h2>

            <p className="about-text" style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-primary, #0D256C)', marginBottom: 12 }}>
              {aboutStory}
            </p>

            {/* Dynamic Verified Stats Strip */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 10,
              margin: '16px 0 20px',
              padding: '14px 16px',
              background: '#f8fafc',
              borderRadius: 12,
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary, #0D256C)', lineHeight: 1.1 }}>{statYears}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 4 }}>Years Exp.</div>
              </div>
              <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FA4616', lineHeight: 1.1 }}>{statTrips}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 4 }}>Trips Done</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary, #0D256C)', lineHeight: 1.1 }}>{statRating}</div>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 4 }}>Client Rating</div>
              </div>
            </div>

            <p className="about-text">
              Whether you need punctual pickup at Kempegowda International Airport, seamless daily employee mobility across Bangalore’s major tech corridors, or a customized outstation getaway across Karnataka, our priority is always your safety, comfort, and peace of mind.
            </p>

            <p className="about-text">
              With clean air-conditioned vehicles, experienced highway chauffeurs, and transparent fixed billing with zero hidden surcharges, we ensure every mile from Bangalore is pleasant and memorable.
            </p>

            {/* Numbered Service Highlights (01 - 04) */}
            <div className="about-highlights-grid">
              {serviceHighlights.map((item, hIdx) => (
                <div key={item.num} className={`about-highlight-item reveal-scale stagger-${hIdx + 1}`}>
                  <span className="about-highlight-num">{item.num}</span>
                  <div>
                    <h3 className="about-highlight-name">{item.title}</h3>
                    <p className="about-highlight-desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="about-cta-row">
              <button
                className="btn-about-story"
                onClick={onExploreClick}
                aria-label="Discover our services"
              >
                <span>Explore Services</span>
                <ArrowRight size={15} />
              </button>
            </div>

          </div>

        </div>

        {/* Bottom Trust Strip (Continuously Sliding Marquee) */}
        <div className="about-trust-strip" aria-label="Core Travel Commitments">
          <div className="about-trust-fade-left" aria-hidden="true" />
          
          <div className="about-trust-marquee">
            {/* Group 1 */}
            <div className="about-trust-group">
              {[...trustPoints, ...trustPoints].map((point, idx) => {
                const IconComp = point.icon;
                return (
                  <div key={`t1-${idx}`} className="about-trust-item">
                    <div className="about-trust-icon">
                      <IconComp size={15} />
                    </div>
                    <span className="about-trust-text">{point.label}</span>
                  </div>
                );
              })}
            </div>

            {/* Group 2 (Clone for seamless infinite loop) */}
            <div className="about-trust-group" aria-hidden="true">
              {[...trustPoints, ...trustPoints].map((point, idx) => {
                const IconComp = point.icon;
                return (
                  <div key={`t2-${idx}`} className="about-trust-item">
                    <div className="about-trust-icon">
                      <IconComp size={15} />
                    </div>
                    <span className="about-trust-text">{point.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="about-trust-fade-right" aria-hidden="true" />
        </div>

      </div>
    </section>
  );
};
