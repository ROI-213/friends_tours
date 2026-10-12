import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Phone,
  MessageCircle,
  ChevronDown,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { BRAND } from '../../constants/branding';
import { useSiteSettings } from '../../context/SiteSettingsContext';
import '../../styles/hero.css';

// Maps `value` from [inMin, inMax] to [outMin, outMax], clamped to the output range.
function mapRange(value, inMin, inMax, outMin, outMax) {
  if (inMax === inMin) return outMax;
  const t = (value - inMin) / (inMax - inMin);
  const clamped = Math.min(1, Math.max(0, t));
  return outMin + clamped * (outMax - outMin);
}

export const Hero = ({ onBookClick, onExploreServicesClick }) => {
  const wrapperRef = useRef(null);
  const stageRef = useRef(null);
  const bgImageRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const contentRef = useRef(null);
  const scrollHintRef = useRef(null);

  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const handler = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  function updateMotion(progress) {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) return;
    const setStyle = (el, opacity, translateY, extra = '') => {
      if (!el) return;
      el.style.opacity = String(opacity);
      el.style.transform = `translateY(${translateY}px)${extra}`;
    };

    // Hero text and CTA buttons are immediately 100% visible on load (progress 0)
    setStyle(eyebrowRef.current, 1, 0);
    setStyle(headingRef.current, 1, 0);
    setStyle(descRef.current, 1, 0);
    setStyle(ctaRef.current, 1, 0);

    // Cinematic slow zoom & subtle parallax depth on background image
    if (bgImageRef.current) {
      const zoom = mapRange(progress, 0, 1, 1.02, 1.15);
      const yOffset = mapRange(progress, 0, 1, 0, 36);
      bgImageRef.current.style.transform = `scale(${zoom}) translateY(${yOffset}px)`;
    }

    // Gently ease as user scrolls deep into the scroll stage
    const fadeOut = mapRange(progress, 0.75, 0.95, 1, 0.5);
    const moveUp = mapRange(progress, 0.75, 0.95, 0, -20);
    if (contentRef.current) {
      contentRef.current.style.opacity = String(fadeOut);
      contentRef.current.style.transform = `translateY(${moveUp}px)`;
    }

    if (scrollHintRef.current) {
      scrollHintRef.current.style.opacity = String(mapRange(progress, 0, 0.15, 1, 0));
    }
  }

  function updatePin(rectTop, scrollableDistance) {
    const stage = stageRef.current;
    if (!stage) return;
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      stage.style.position = 'relative';
      stage.style.top = '0px';
      return;
    }
    if (scrollableDistance <= 0 || rectTop > 0) {
      stage.style.position = 'absolute';
      stage.style.top = '0px';
    } else if (rectTop > -scrollableDistance) {
      stage.style.position = 'fixed';
      stage.style.top = '0px';
    } else {
      stage.style.position = 'absolute';
      stage.style.top = `${scrollableDistance}px`;
    }
  }

  function computeProgress() {
    const wrapper = wrapperRef.current;
    if (!wrapper) return 0;
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      updatePin(0, 0);
      return 0;
    }
    const rect = wrapper.getBoundingClientRect();
    const scrollableDistance = wrapper.offsetHeight - window.innerHeight;
    updatePin(rect.top, scrollableDistance);
    if (scrollableDistance <= 0) return 0;
    return Math.min(1, Math.max(0, -rect.top / scrollableDistance));
  }

  function onScrollOrResize() {
    const progress = computeProgress();
    updateMotion(progress);
  }

  useEffect(() => {
    if (reducedMotion) return;

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    onScrollOrResize(); // initial call

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section id="home" className="hero-section hero-section--static" aria-label="Welcome to Friends Tours and Travels Bangalore">
        <div className="hero-bg-container">
          <img src="/hero-flower-car-front-white.jpg" alt="White car facing front on flower street" className="hero-static-image" loading="eager" fetchPriority="high" />
          <div className="hero-scrim-overlay" />
        </div>
        <HeroContent onBookClick={onBookClick} onExploreServicesClick={onExploreServicesClick} static />
      </section>
    );
  }

  return (
    <section id="home" className="hero-scroll-wrapper" ref={wrapperRef} aria-label="Welcome to Friends Tours and Travels Bangalore">
      <div className="hero-sticky-stage" ref={stageRef}>
        <div className="hero-canvas-container">
          <div className="hero-ambient-glow" />
          <img
            ref={bgImageRef}
            src="/hero-flower-car-front-white.jpg"
            alt="White car facing front on flower street"
            className="hero-static-image hero-cinematic-bg"
            loading="eager"
            fetchPriority="high"
          />
          <div className="hero-scrim-overlay" />
        </div>

        <div className="hero-container" ref={contentRef}>
          <HeroContent
            onBookClick={onBookClick}
            onExploreServicesClick={onExploreServicesClick}
            eyebrowRef={eyebrowRef}
            headingRef={headingRef}
            descRef={descRef}
            ctaRef={ctaRef}
          />
        </div>

        <div className="hero-scroll-indicator" ref={scrollHintRef} aria-hidden="true">
          <span>Scroll To Explore</span>
          <ChevronDown size={16} className="scroll-arrow-bounce" />
        </div>
      </div>
    </section>
  );
};

function HeroContent({ onBookClick, onExploreServicesClick, eyebrowRef, headingRef, descRef, ctaRef, static: isStatic }) {
  const { getSetting } = useSiteSettings();
  const baseStyle = { opacity: 1 };

  const heroEyebrow = getSetting('hero_eyebrow', 'FRIENDS TOURS & TRAVELS • J.P. NAGAR, BANGALORE');
  const heroTitle = getSetting('hero_title', 'YOUR JOURNEY. OUR PRIORITY.');
  const heroSubtitle = getSetting('hero_subtitle', "Bangalore's trusted partner for Employee Transportation, Airport Transport, Local & Outstation Rentals, and Shuttle Services.");
  const phone = getSetting('phone', BRAND.phoneRaw);
  const whatsapp = getSetting('whatsapp', BRAND.whatsappRaw);
  const primaryPhone = phone.includes('/') ? phone.split('/')[0].trim() : phone;
  const cleanPhone = primaryPhone.replace(/[^\d+]/g, '');
  const cleanWhatsapp = whatsapp.replace(/[^\d]/g, '');

  let titlePart1 = heroTitle;
  let titlePart2 = '';
  if (heroTitle.includes('.')) {
    const parts = heroTitle.split('.');
    titlePart1 = parts[0] + '.';
    titlePart2 = parts.slice(1).join('.').trim();
  }

  return (
    <div className="hero-left">
      <div className="hero-eyebrow" ref={eyebrowRef} style={baseStyle}>
        <span className="hero-eyebrow-line" />
        <span>{heroEyebrow}</span>
      </div>

      <h1 className="hero-heading" ref={headingRef} style={baseStyle}>
        {titlePart1}{' '}
        {titlePart2 && <span className="hero-heading-highlight">{titlePart2}</span>}
      </h1>

      <p className="hero-description" ref={descRef} style={baseStyle}>
        {heroSubtitle}
      </p>

      {/* Floating Trust Pills */}
      <div className="hero-trust-row" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        <div className="hero-floating-badge">
          <Sparkles size={13} color="#FA4616" />
          <span>4.9★ Rated • 15K+ Happy Journeys</span>
        </div>
        <div className="hero-floating-badge badge-delay">
          <ShieldCheck size={13} color="#0D256C" />
          <span>Sanitized Cabs • Vetted Drivers</span>
        </div>
      </div>

      <div className="hero-cta-group" ref={ctaRef} style={baseStyle}>
        <button className="btn-hero-primary shimmer-hover" onClick={onBookClick} aria-label="Book Your Journey">
          <span>Book Your Journey</span>
          <ArrowRight size={17} />
        </button>
      </div>

      <div className="hero-quick-contacts">
        <a href={`tel:${cleanPhone}`} className="hero-contact-pill shimmer-hover" aria-label={`Call ${phone}`}>
          <span className="hero-contact-icon-circle">
            <Phone size={14} />
          </span>
          <span className="hero-contact-text">
            <span className="hero-contact-full">Call: {phone}</span>
            <span className="hero-contact-short">Call Now</span>
          </span>
        </a>

        <a 
          href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hi Friends Tours, I would like to book a journey from Bangalore.')}`} 
          target="_blank" 
          rel="noreferrer" 
          className="hero-contact-pill hero-whatsapp-pill shimmer-hover"
          aria-label={`WhatsApp ${whatsapp}`}
        >
          <span className="hero-contact-icon-circle" style={{ backgroundColor: '#25D366' }}>
            <MessageCircle size={14} color="#FFFFFF" />
          </span>
          <span className="hero-contact-text">
            <span className="hero-contact-full">WhatsApp: {whatsapp}</span>
            <span className="hero-contact-short">WhatsApp</span>
          </span>
        </a>
      </div>
    </div>
  );
}
