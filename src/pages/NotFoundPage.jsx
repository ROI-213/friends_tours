import React, { useEffect } from 'react';
import { Sparkles, ArrowRight, Compass, Home } from 'lucide-react';
import { BRAND } from '../constants/branding';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const NotFoundPage = ({ onNavigate, onBookNowClick }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `404 — Page Not Found | ${BRAND.name}`;
  }, []);

  return (
    <div className="page-container" aria-label="404 Page Not Found">
      <Navbar
        activeSection=""
        onNavClick={onNavigate}
        onBookNowClick={onBookNowClick}
      />

      <main className="notfound-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="notfound-code">404</div>
        <h1 className="notfound-title">JOURNEY NOT FOUND</h1>
        <p className="notfound-desc">
          The travel route or page you are looking for has taken a detour or does not exist. Let's get you back on track.
        </p>

        <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            className="btn-page-cta-primary"
            style={{ background: 'var(--color-primary)', color: '#FFFFFF' }}
            onClick={() => onNavigate('/')}
          >
            <Home size={16} />
            <span>Back to Home</span>
          </button>

          <button
            className="btn-vehichero-secondary"
            style={{ color: '#0A1938', borderColor: 'var(--color-border-subtle)', background: '#FFFFFF' }}
            onClick={() => onNavigate('/services')}
          >
            <Compass size={16} color="var(--color-primary)" />
            <span>Explore Services</span>
          </button>
        </div>
      </main>

      <Footer
        onNavClick={onNavigate}
        onBookClick={onBookNowClick}
      />
    </div>
  );
};
