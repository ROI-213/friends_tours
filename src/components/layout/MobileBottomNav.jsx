import React from 'react';
import { 
  Home, 
  Car, 
  Plane, 
  Compass, 
  Phone, 
  MessageCircle,
  CalendarCheck
} from 'lucide-react';
import { BRAND } from '../../constants/branding';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import '../../styles/mobile-nav.css';

export const MobileBottomNav = ({ currentPath, onNavClick, onBookNowClick }) => {
  const { getSetting } = useSiteSettings();
  const whatsapp = getSetting('whatsapp', BRAND.whatsapp);
  const cleanWhatsapp = whatsapp.replace(/[^\d]/g, '');

  const handleNav = (path) => {
    if (onNavClick) {
      onNavClick(path);
    }
  };

  const isCurrent = (path) => {
    if (path === '/' && (currentPath === '/' || currentPath === '' || currentPath === '/home')) return true;
    if (path !== '/' && currentPath && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      <div className="mobile-bottom-nav-container">
        
        {/* 1. HOME */}
        <button
          type="button"
          className={`mobile-nav-item ${isCurrent('/') ? 'active' : ''}`}
          onClick={() => handleNav('/')}
          aria-label="Home"
        >
          <div className="mobile-nav-icon-wrap">
            <Home size={20} />
          </div>
          <span className="mobile-nav-label">Home</span>
        </button>

        {/* 2. FLEET / CABS */}
        <button
          type="button"
          className={`mobile-nav-item ${isCurrent('/rental-cars') ? 'active' : ''}`}
          onClick={() => handleNav('/rental-cars')}
          aria-label="Cabs & Fleet"
        >
          <div className="mobile-nav-icon-wrap">
            <Car size={20} />
          </div>
          <span className="mobile-nav-label">Cabs</span>
        </button>

        {/* 3. AIRPORT TAXI */}
        <button
          type="button"
          className={`mobile-nav-item ${isCurrent('/services/airport-transfer') ? 'active' : ''}`}
          onClick={() => handleNav('/services/airport-transfer')}
          aria-label="Airport Taxi"
        >
          <div className="mobile-nav-icon-wrap">
            <Plane size={20} />
          </div>
          <span className="mobile-nav-label">Airport</span>
        </button>

        {/* 4. LOCAL PACKAGES */}
        <button
          type="button"
          className={`mobile-nav-item ${isCurrent('/local-packages') ? 'active' : ''}`}
          onClick={() => handleNav('/local-packages')}
          aria-label="Local Packages"
        >
          <div className="mobile-nav-icon-wrap">
            <Compass size={20} />
          </div>
          <span className="mobile-nav-label">Local</span>
        </button>

        {/* 5. BOOK NOW / CALL */}
        <button
          type="button"
          className="mobile-nav-item mobile-nav-cta"
          onClick={() => {
            if (onBookNowClick) {
              onBookNowClick();
            } else {
              window.open(`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hi Friends Tours, I would like to book a cab in Bangalore.')}`, '_blank');
            }
          }}
          aria-label="Book Cab Now"
        >
          <div className="mobile-nav-icon-wrap mobile-cta-badge">
            <CalendarCheck size={20} />
          </div>
          <span className="mobile-nav-label mobile-cta-label">Book Now</span>
        </button>

      </div>
    </nav>
  );
};
