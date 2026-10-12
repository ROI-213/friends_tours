import React, { useState } from 'react';
import { 
  Phone, 
  MessageCircle, 
  Mail, 
  MapPin, 
  Clock, 
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
  Briefcase,
  Plane,
  Compass,
  Users
} from 'lucide-react';
import { BRAND } from '../../constants/branding';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import { LOCAL_TRANSFER_FAQS } from '../../data/localTransferData';
import { OUTSTATION_FAQS } from '../../data/outstationCorporateData';
import { MobileBottomNav } from './MobileBottomNav';
import '../../styles/footer.css';

// SVG Social Icons
const FacebookIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const YoutubeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const GLOBAL_FAQS = [
  ...LOCAL_TRANSFER_FAQS.slice(0, 3),
  ...OUTSTATION_FAQS.slice(0, 2)
];

export const Footer = ({ onNavClick, onBookClick, onLegalClick, onOpenTariffModal }) => {
  const { getSetting } = useSiteSettings();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  const phone = getSetting('phone', BRAND.phoneRaw);
  const whatsapp = getSetting('whatsapp', BRAND.whatsappRaw);
  const email = getSetting('email', BRAND.email);
  const address = getSetting('address', BRAND.address);
  const googleMapsUrl = getSetting('google_maps_url', BRAND.googleMapsUrl);
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  const cleanWhatsapp = whatsapp.replace(/[^\d]/g, '');

  const quickLinks = [
    { label: 'Home', shortLabel: 'Home', path: '/' },
    { label: 'About Us', shortLabel: 'About Us', path: '/about' },
    { label: 'Our Services', shortLabel: 'Our Services', path: '/services' },
    { label: 'Travel Gallery', shortLabel: 'Gallery', path: '/gallery' },
    { label: 'Testimonials', shortLabel: 'Reviews', path: '/testimonials' },
    { label: 'Contact Us', shortLabel: 'Contact Us', path: '/contact' },
  ];

  const serviceLinks = [
    { label: 'Employee Transportation', shortLabel: 'Employee Transport', path: '/services/corporate-travel' },
    { label: 'Airport Transport', shortLabel: 'Airport Transport', path: '/services/airport-transfer' },
    { label: 'Local & Outstation Rentals', shortLabel: 'Local & Outstation', path: '/local-packages' },
    { label: 'Shuttle Services & Fleet', shortLabel: 'Shuttle & Fleet', path: '/rental-cars' },
    { label: 'Karnataka Outstation', shortLabel: 'Karnataka Outstation', path: '/outstation' },
  ];

  return (
    <>
    <footer className="site-footer" aria-label="Global Site Footer">
      
      {/* GLOBAL FAQ SECTION ABOVE FOOTER LINKS */}
      <div style={{ background: '#F7FAFF', borderBottom: '1px solid rgba(13, 37, 108, 0.12)', paddingTop: 'clamp(40px, 5vw, 64px)', paddingBottom: 'clamp(40px, 5vw, 64px)' }}>
        <div className="footer-container" style={{ maxWidth: 960 }}>
          
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FFFFFF', background: 'var(--color-primary, #0D256C)', padding: '5px 16px', borderRadius: 999, marginBottom: 10 }}>
              <HelpCircle size={13} />
              <span>FREQUENTLY ASKED QUESTIONS</span>
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, color: '#0A1938', margin: 0 }}>
              Got Questions? We Have Answers.
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {GLOBAL_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} style={{ background: '#FFFFFF', borderRadius: 16, border: '1px solid var(--color-border-subtle, #E2ECF8)', overflow: 'hidden', boxShadow: '0 2px 8px rgba(13, 37, 108, 0.03)' }}>
                  <div
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    style={{ padding: '16px 20px', fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 700, color: '#0A1938', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' }}
                  >
                    <span>{faq.question}</span>
                    {isOpen ? <ChevronUp size={18} color="var(--color-primary, #0D256C)" /> : <ChevronDown size={18} color="#888888" />}
                  </div>
                  {isOpen && (
                    <div style={{ padding: '0 20px 16px 20px', fontSize: '0.875rem', color: '#555555', lineHeight: 1.6, borderTop: '1px dashed #E2ECF8', paddingTop: 12 }}>
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </div>

      <div className="footer-container">
        
        {/* Main 4-Column Footer */}
        <div className="footer-main">
          
          {/* Column 1: Company Profile */}
          <div className="footer-col footer-col-brand">
            <a 
              href="/" 
              className="footer-brand-logo"
              onClick={(e) => { e.preventDefault(); onNavClick && onNavClick('/'); }}
              aria-label="Friends Tours and Travels"
              style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', marginBottom: 16 }}
            >
              <img 
                src="/logo-icon.png" 
                alt="Friends Tours & Travels Logo" 
                style={{ width: 48, height: 48, objectFit: 'contain', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.95)', padding: 3 }}
              />
              <div>
                <div className="footer-brand-name" style={{ color: '#FA4616', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Montserrat', 'Plus Jakarta Sans', sans-serif", fontSize: '1.25rem', letterSpacing: '0.02em' }}>FRIENDS</div>
                <span className="footer-brand-tagline" style={{ color: '#0D256C', fontStyle: 'italic', fontWeight: 900, fontFamily: "'Montserrat', 'Plus Jakarta Sans', sans-serif", fontSize: '0.75rem', letterSpacing: '0.04em' }}>TOURS AND TRAVELS</span>
              </div>
            </a>

            <p className="footer-desc">
              Bangalore's trusted travel partner for employee transportation, Kempegowda Airport transfers, local city rentals, shuttle services, and Karnataka outstation journeys.
            </p>

            {/* Social Icons */}
            <div className="footer-social-row" aria-label="Social Media Channels">
              <a
                href={BRAND.social.facebook}
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="Facebook Page"
              >
                <FacebookIcon size={16} />
              </a>

              <a
                href={BRAND.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="Instagram Profile"
              >
                <InstagramIcon size={16} />
              </a>

              <a
                href={BRAND.social.youtube}
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="YouTube Channel"
              >
                <YoutubeIcon size={16} />
              </a>

              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hi Friends Tours, I would like to make an enquiry.')}`}
                target="_blank"
                rel="noreferrer"
                className="footer-social-btn"
                aria-label="WhatsApp Direct Chat"
                style={{ color: '#25D366' }}
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col footer-col-links footer-col-quicklinks">
            <h3 className="footer-col-title">
              <span className="footer-title-prefix">Quick </span>Links
            </h3>
            <ul className="footer-links-list">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <button
                    type="button"
                    className="footer-nav-link"
                    onClick={() => onNavClick && onNavClick(link.path)}
                  >
                    <span className="footer-link-indicator">›</span>
                    <span className="footer-link-text-full">{link.label}</span>
                    <span className="footer-link-text-short">{link.shortLabel || link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: 4 Core Services */}
          <div className="footer-col footer-col-links footer-col-services">
            <h3 className="footer-col-title">
              <span className="footer-title-prefix">Our </span>Services
            </h3>
            <ul className="footer-links-list">
              {serviceLinks.map((link) => (
                <li key={link.path}>
                  <button
                    type="button"
                    className="footer-nav-link"
                    onClick={() => onNavClick && onNavClick(link.path)}
                  >
                    <span className="footer-link-indicator">›</span>
                    <span className="footer-link-text-full">{link.label}</span>
                    <span className="footer-link-text-short">{link.shortLabel || link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Office Details */}
          <div className="footer-col footer-col-contact">
            <h3 className="footer-col-title">Contact &amp; Office</h3>
            
            <div className="footer-contact-info">
              <div className="footer-contact-item">
                <MapPin size={15} className="footer-contact-icon" style={{ flexShrink: 0, marginTop: 3 }} />
                <span>
                  <a 
                    href={googleMapsUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ color: 'inherit', textDecoration: 'none' }}
                  >
                    {address}
                  </a>
                </span>
              </div>

              <div className="footer-contact-item">
                <Phone size={15} className="footer-contact-icon" />
                <div>
                  <a href={`tel:${cleanPhone}`}>{phone}</a>
                </div>
              </div>

              <div className="footer-contact-item">
                <MessageCircle size={15} className="footer-contact-icon" style={{ color: '#25D366' }} />
                <a 
                  href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hi Friends Tours, I would like to book a cab.')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp: {whatsapp}
                </a>
              </div>

              <div className="footer-contact-item">
                <Mail size={15} className="footer-contact-icon" />
                <a href={`mailto:${email}`}>{email}</a>
              </div>

              <div className="footer-contact-item">
                <Clock size={15} className="footer-contact-icon" />
                <span>24/7 Operations Desk</span>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Bar: Copyright, Legal & Developer Credit */}
        <div className="footer-bottom">
          <div className="footer-bottom-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <p className="footer-copyright" style={{ margin: 0, fontSize: '0.8125rem', color: '#64748b' }}>
                © {new Date().getFullYear()} {BRAND.name}. All rights reserved. J.P. Nagar, Bangalore – 560078. Rates effective {BRAND.ratesEffectiveDate}.
              </p>
              <div className="footer-legal-links" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  className="footer-legal-btn"
                  onClick={() => onLegalClick && onLegalClick('privacy')}
                  style={{ background: 'none', border: 'none', padding: 0, color: '#64748b', fontSize: '0.8125rem', cursor: 'pointer' }}
                >
                  Privacy Policy
                </button>
                <span className="footer-legal-divider" style={{ color: '#cbd5e1' }}>•</span>
                <button
                  className="footer-legal-btn"
                  onClick={() => onLegalClick && onLegalClick('terms')}
                  style={{ background: 'none', border: 'none', padding: 0, color: '#64748b', fontSize: '0.8125rem', cursor: 'pointer' }}
                >
                  Terms of Service
                </button>
              </div>
            </div>

            <div className="footer-developer-credit" style={{ marginLeft: 'auto' }}>
              <a
                href="https://wa.me/919945379333?text=Hi%20ROI%20Infotech%2C%20I%20am%20contacting%20you%20regarding%20website%20development."
                target="_blank"
                rel="noreferrer"
                className="footer-developer-link"
                title="Contact ROI Infotech on WhatsApp: 9945379333"
              >
                Developed By <span className="footer-developer-name">ROI Infotech</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
    <MobileBottomNav
      currentPath={window.location.pathname}
      onNavClick={onNavClick}
      onBookNowClick={onBookClick}
    />
    </>
  );
};
