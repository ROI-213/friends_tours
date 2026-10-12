import React from 'react';
import { Clock, MapPin, Compass, ShieldCheck, Sparkles } from 'lucide-react';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import '../../styles/responsibilities.css';

export const RESPONSIBILITIES_DATA = [
  {
    id: 'resp-1',
    icon: Clock,
    title: 'AVAILABLE WHEN YOU NEED US',
    description: '24/7 responsive travel desk for airport pickups, corporate mobility, and emergency bookings.',
  },
  {
    id: 'resp-2',
    icon: MapPin,
    title: 'BANGALORE & OUTSTATION COVERAGE',
    description: 'Comprehensive mobility across Bangalore tech corridors and all major Karnataka highway routes.',
  },
  {
    id: 'resp-3',
    icon: Compass,
    title: 'FLEXIBLE TRAVEL OPTIONS',
    description: 'Customizable one-way drops, round trips, hourly rentals, and multi-city sightseeing getaways.',
  },
  {
    id: 'resp-4',
    icon: ShieldCheck,
    title: 'COMFORTABLE & SAFE JOURNEYS',
    description: 'Clean, sanitized air-conditioned vehicles with senior highway-certified and courteous chauffeurs.',
  },
];

export const OurResponsibilities = () => {
  const { getSetting } = useSiteSettings();
  const sGps = getSetting('safety_gps');
  const sPolice = getSetting('safety_police');
  const sSanitized = getSetting('safety_sanitized');
  const sBilling = getSetting('safety_billing');

  const items = [
    {
      id: 'resp-1',
      icon: Clock,
      title: 'GPS & FLEET SAFETY',
      description: sGps || '100% GPS Fleet Tracking & Speed Governors across all vehicles.',
    },
    {
      id: 'resp-2',
      icon: ShieldCheck,
      title: 'VERIFIED CHAUFFEURS',
      description: sPolice || 'Police Verified & Background Checked Chauffeurs.',
    },
    {
      id: 'resp-3',
      icon: Compass,
      title: 'HYGIENIC & SANITIZED',
      description: sSanitized || 'Deep Cleaned & Sanitized Cabins Before Every Trip.',
    },
    {
      id: 'resp-4',
      icon: MapPin,
      title: 'TRANSPARENT BILLING',
      description: sBilling || 'Transparent Computerized / Printed Receipt Billing.',
    },
  ];

  return (
    <section id="responsibilities" className="responsibilities-section" aria-label="Our Responsibilities & Commitments">
      <div className="responsibilities-container">
        
        {/* Panoramic Background Travel Panel */}
        <div className="responsibilities-panel">
          
          {/* Scenic Travel Photography Background */}
          <img
            src="/hero/hillstation-hero.jpg"
            alt="Scenic Karnataka Travel Highway"
            className="responsibilities-bg-image"
            loading="lazy"
          />
          <div className="responsibilities-scrim-overlay" />

          {/* Centered Heading */}
          <div className="responsibilities-header reveal-on-scroll">
            <span className="resp-eyebrow">
              <Sparkles size={12} />
              <span>CORE COMMITMENTS</span>
            </span>
            <h2 className="responsibilities-title">OUR RESPONSIBILITIES</h2>
            <p className="responsibilities-subtitle">
              Committed to making every journey from Bangalore comfortable, dependable, and stress-free.
            </p>
          </div>

          {/* Four Frosted Glass Responsibility Cards */}
          <div className="responsibilities-grid">
            {items.map((item, rIdx) => {
              const IconComp = item.icon;
              return (
                <article key={item.id} className={`responsibility-glass-card reveal-scale stagger-${rIdx + 1}`}>
                  <div className="resp-icon-circle" aria-hidden="true">
                    <IconComp size={22} strokeWidth={2.5} />
                  </div>
                  <h3 className="resp-card-title">{item.title}</h3>
                  <p className="resp-card-desc">{item.description}</p>
                </article>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
