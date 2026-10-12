import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, 
  Menu, 
  X, 
  Phone, 
  MessageCircle, 
  Plane, 
  Briefcase, 
  Compass, 
  MapPin, 
  Sparkles,
  ArrowRight,
  Car,
  Users,
  FileText
} from 'lucide-react';
import { BRAND } from '../../constants/branding';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import '../../styles/navbar.css';

export const Navbar = ({ onBookNowClick, activeSection = 'home', onNavClick, onOpenTariffModal }) => {
  const { getSetting } = useSiteSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);

  const phone = getSetting('phone', BRAND.phoneRaw);
  const whatsapp = getSetting('whatsapp', BRAND.whatsappRaw);
  const cleanPhone = phone.replace(/[^\d+]/g, '');
  const cleanWhatsapp = whatsapp.replace(/[^\d]/g, '');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setServicesDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setServicesDropdownOpen(false);
    }, 180);
  };

  const handleLinkClick = (targetPath) => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
    if (onNavClick) {
      onNavClick(targetPath);
    }
  };

  const handleBookClick = () => {
    setMobileMenuOpen(false);
    if (onBookNowClick) {
      onBookNowClick();
    }
  };

  const servicesList = [
    {
      id: 'employee-transportation',
      path: '/services/corporate-travel',
      title: 'Employee Transportation',
      desc: 'Tech park daily commute, shift cabs & monthly billing',
      icon: Briefcase,
    },
    {
      id: 'airport-transport',
      path: '/services/airport-transfer',
      title: 'Airport Transport',
      desc: 'Kempegowda Airport pickup & flight delay tracking',
      icon: Plane,
    },
    {
      id: 'local-outstation-rentals',
      path: '/local-packages',
      title: 'Local & Outstation Rentals',
      desc: '4hr/8hr local city packages & min 300km/day outstation',
      icon: Compass,
    },
    {
      id: 'shuttle-services',
      path: '/rental-cars',
      title: 'Shuttle Services & Fleet',
      desc: 'Tempo Travellers, sedans & event group shuttles',
      icon: Users,
    },
  ];

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

  const isHomeActive = activeSection === 'home' || currentPath === '/';
  const isAboutActive = activeSection === 'about' || currentPath === '/about';
  const isServicesActive = activeSection === 'services' || 
    currentPath.startsWith('/services') || 
    currentPath.startsWith('/rental-cars') || 
    currentPath === '/local-packages' || 
    currentPath === '/outstation';
  const isGalleryActive = activeSection === 'gallery' || currentPath === '/gallery';
  const isTestimonialsActive = activeSection === 'testimonials' || currentPath === '/testimonials';
  const isContactActive = activeSection === 'contact' || currentPath.startsWith('/contact');

  return (
    <>
      <header className={`site-header ${isScrolled ? 'header-scrolled' : 'header-transparent'}`}>
        <div className="header-container">
          
          {/* Brand Logo */}
          <a 
            href="/" 
            className="brand-logo"
            onClick={(e) => { e.preventDefault(); handleLinkClick('/'); }}
            aria-label="Friends Tours & Travels Home"
          >
            <img 
              src="/logo-icon.png" 
              alt="Friends Tours & Travels Logo" 
              style={{ width: 44, height: 44, objectFit: 'contain', borderRadius: '50%', background: 'rgba(255,255,255,0.95)', padding: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            />
            <div>
              <div className="brand-logo-text" style={{ display: 'flex', alignItems: 'baseline' }}>
                <span style={{ color: '#FA4616', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Montserrat', 'Plus Jakarta Sans', sans-serif", letterSpacing: '0.02em', fontSize: '1.25rem' }}>FRIENDS</span>
              </div>
              <span className="brand-logo-tagline" style={{ color: '#0D256C', fontStyle: 'italic', fontWeight: 900, fontFamily: "'Montserrat', 'Plus Jakarta Sans', sans-serif", letterSpacing: '0.04em', fontSize: '0.6875rem' }}>
                TOURS AND TRAVELS
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav aria-label="Main Navigation">
            <ul className="desktop-nav">
              
              {/* Home */}
              <li className="nav-item">
                <button
                  className={`nav-link ${isHomeActive ? 'active' : ''}`}
                  onClick={() => handleLinkClick('/')}
                >
                  Home
                  {isHomeActive && <span className="active-indicator" />}
                </button>
              </li>

              {/* About Us */}
              <li className="nav-item">
                <button
                  className={`nav-link ${isAboutActive ? 'active' : ''}`}
                  onClick={() => handleLinkClick('/about')}
                >
                  About Us
                  {isAboutActive && <span className="active-indicator" />}
                </button>
              </li>

              {/* Services with Dropdown */}
              <li 
                className={`nav-item dropdown-wrapper ${servicesDropdownOpen ? 'dropdown-open' : ''}`}
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  className={`nav-link ${isServicesActive ? 'active' : ''}`}
                  onClick={() => handleLinkClick('/services')}
                  aria-expanded={servicesDropdownOpen}
                >
                  <span>Services</span>
                  <ChevronDown size={14} className="dropdown-icon" />
                  {isServicesActive && <span className="active-indicator" />}
                </button>

                {/* Floating Dropdown Panel */}
                <div className="services-dropdown">
                  {servicesList.map((service) => {
                    const IconComponent = service.icon;
                    return (
                      <div
                        key={service.id}
                        className="dropdown-item"
                        onClick={() => handleLinkClick(service.path)}
                      >
                        <div className="dropdown-item-icon">
                          <IconComponent size={17} />
                        </div>
                        <div>
                          <div className="dropdown-item-title">{service.title}</div>
                          <div className="dropdown-item-desc">{service.desc}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </li>

              {/* Gallery */}
              <li className="nav-item">
                <button
                  className={`nav-link ${isGalleryActive ? 'active' : ''}`}
                  onClick={() => handleLinkClick('/gallery')}
                >
                  Gallery
                  {isGalleryActive && <span className="active-indicator" />}
                </button>
              </li>

              {/* Testimonials */}
              <li className="nav-item">
                <button
                  className={`nav-link ${isTestimonialsActive ? 'active' : ''}`}
                  onClick={() => handleLinkClick('/testimonials')}
                >
                  Testimonials
                  {isTestimonialsActive && <span className="active-indicator" />}
                </button>
              </li>

              {/* Contact Us */}
              <li className="nav-item">
                <button
                  className={`nav-link ${isContactActive ? 'active' : ''}`}
                  onClick={() => handleLinkClick('/contact')}
                >
                  Contact Us
                  {isContactActive && <span className="active-indicator" />}
                </button>
              </li>

            </ul>
          </nav>

          {/* Right Actions */}
          <div className="header-actions">
            
            {/* Quick Call */}
            <a
              href={`tel:${cleanPhone}`}
              className="btn btn-secondary btn-header-call"
              style={{
                display: 'none',
                lgDisplay: 'inline-flex',
                textDecoration: 'none',
                fontSize: '0.8125rem',
                padding: '8px 14px',
                borderRadius: 999
              }}
              title={`Call ${phone}`}
            >
              <Phone size={14} color="var(--color-primary)" />
              <span>{phone}</span>
            </a>

            {/* Desktop Book Now Button */}
            <button
              className="btn-book-now btn-book-now-desktop"
              onClick={handleBookClick}
              aria-label="Book a Journey"
            >
              <Sparkles size={15} />
              <span>Book Now</span>
            </button>

            {/* Mobile Quick Actions & Hamburger */}
            <div className="mobile-controls">
              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hi Friends Tours, I would like to book a cab.')}`}
                target="_blank"
                rel="noreferrer"
                className="btn-hamburger"
                aria-label="WhatsApp Quick Connect"
                style={{ width: 38, height: 38, borderRadius: 10, background: '#25D366', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <MessageCircle size={18} />
              </a>

              <button
                className="btn-hamburger"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>

          </div>

        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      <div 
        className={`mobile-drawer-backdrop ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Drawer Panel */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        
        {/* Drawer Header */}
        <div className="mobile-drawer-header">
          <div className="brand-logo" style={{ cursor: 'default' }}>
            <img 
              src="/logo-icon.png" 
              alt="Friends Tours & Travels Logo" 
              style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: '50%', background: '#EBF2FF', padding: 2 }}
            />
            <div>
              <div className="brand-logo-text" style={{ color: '#FA4616', fontWeight: 900, fontStyle: 'italic', fontFamily: "'Montserrat', 'Plus Jakarta Sans', sans-serif", letterSpacing: '0.02em', fontSize: '1.25rem' }}>FRIENDS</div>
              <span className="brand-logo-tagline" style={{ color: '#0D256C', fontStyle: 'italic', fontWeight: 900, fontFamily: "'Montserrat', 'Plus Jakarta Sans', sans-serif", letterSpacing: '0.04em', fontSize: '0.6875rem' }}>TOURS AND TRAVELS</span>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="btn-hamburger"
            style={{ color: '#333', background: '#EBF2FF', border: '1px solid #DCE8FA', width: 36, height: 36 }}
            aria-label="Close Mobile Menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Drawer Nav Links */}
        <nav>
          <ul className="mobile-nav-list">
            <li>
              <button
                className={`mobile-nav-link ${isHomeActive ? 'active' : ''}`}
                style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
                onClick={() => handleLinkClick('/')}
              >
                <span>Home</span>
                {isHomeActive && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#0D256C' }} />}
              </button>
            </li>

            <li>
              <button
                className={`mobile-nav-link ${isAboutActive ? 'active' : ''}`}
                style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
                onClick={() => handleLinkClick('/about')}
              >
                <span>About Us</span>
              </button>
            </li>

            {/* Mobile Services Accordion */}
            <li>
              <button
                className={`mobile-nav-link ${isServicesActive ? 'active' : ''}`}
                style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              >
                <span>Services (4 Core Pillars)</span>
                <ChevronDown 
                  size={18} 
                  style={{ transform: mobileServicesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 200ms ease' }} 
                />
              </button>

              {mobileServicesOpen && (
                <div className="mobile-services-sublist">
                  <button
                    className="mobile-sub-link"
                    style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontWeight: 800, color: 'var(--color-primary)' }}
                    onClick={() => handleLinkClick('/services')}
                  >
                    <span>All Services Overview</span>
                    <ArrowRight size={13} />
                  </button>

                  {servicesList.map((service) => {
                    const IconComp = service.icon;
                    return (
                      <button
                        key={service.id}
                        className="mobile-sub-link"
                        style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer' }}
                        onClick={() => handleLinkClick(service.path)}
                      >
                        <IconComp size={15} color="#0D256C" />
                        <span>{service.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </li>

            <li>
              <button
                className={`mobile-nav-link ${isGalleryActive ? 'active' : ''}`}
                style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
                onClick={() => handleLinkClick('/gallery')}
              >
                <span>Gallery</span>
              </button>
            </li>

            <li>
              <button
                className={`mobile-nav-link ${isTestimonialsActive ? 'active' : ''}`}
                style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
                onClick={() => handleLinkClick('/testimonials')}
              >
                <span>Testimonials</span>
              </button>
            </li>

            <li>
              <button
                className={`mobile-nav-link ${isContactActive ? 'active' : ''}`}
                style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
                onClick={() => handleLinkClick('/contact')}
              >
                <span>Contact Us</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Drawer Footer */}
        <div className="mobile-drawer-footer">
          <button
            className="btn-book-now"
            style={{ width: '100%', padding: '14px 20px', fontSize: '0.9375rem' }}
            onClick={handleBookClick}
          >
            <Sparkles size={16} />
            <span>Book Now</span>
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            <a
              href={`tel:${cleanPhone}`}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '10px 14px',
                borderRadius: 12,
                backgroundColor: 'var(--color-pink-soft, #EBF2FF)',
                color: 'var(--color-primary, #0D256C)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <Phone size={15} />
              <span>{phone}</span>
            </a>

            <a
              href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hi Friends Tours, I would like to book a cab.')}`}
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                padding: '10px 14px',
                borderRadius: 12,
                backgroundColor: '#25D366',
                color: '#FFFFFF',
                fontSize: '0.8125rem',
                fontWeight: 600,
                textDecoration: 'none'
              }}
            >
              <MessageCircle size={15} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </>
  );
};
