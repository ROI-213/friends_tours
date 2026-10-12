import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Camera, 
  MapPin, 
  ArrowRight,
  Eye,
  Compass
} from 'lucide-react';
import { BRAND } from '../constants/branding';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

const GALLERY_ITEMS = [
  {
    id: 1,
    title: 'Nandi Hills Cloudbed Sunrise',
    category: 'BANGALORE',
    spanClass: 'span-large',
    image: '/gallery/nandi_hills_sunrise.jpg',
    caption: 'Early dawn panorama above mist-covered valleys at Nandi Hills near Bangalore.'
  },
  {
    id: 2,
    title: 'Innova Crysta Highway Tour',
    category: 'VEHICLES',
    spanClass: 'span-standard',
    image: '/gallery/innova_crysta_highway.jpg',
    caption: 'Comfortable family cruising on the Bangalore–Mysore expressway.'
  },
  {
    id: 3,
    title: 'Mysore Royal Palace Illumination',
    category: 'DESTINATIONS',
    spanClass: 'span-tall',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
    caption: 'Dazzling night illumination at the historic Mysore Palace heritage complex.'
  },
  {
    id: 5,
    title: 'Executive Sedan Kempegowda Airport Transit',
    category: 'VEHICLES',
    spanClass: 'span-standard',
    image: '/gallery/etios_airport.jpg',
    caption: 'Punctual corporate executive transit to Kempegowda International Airport (BLR).'
  },
  {
    id: 9,
    title: 'Vidhana Soudha Architecture',
    category: 'BANGALORE',
    spanClass: 'span-standard',
    image: '/gallery/vidhana_soudha.jpg',
    caption: 'Neo-Dravidian state legislative landmark in the heart of Bangalore.'
  }
];

import { api } from '../lib/api.js';
import { useDataSync } from '../hooks/useDataSync';

const CATEGORIES = ['ALL', 'BANGALORE', 'DESTINATIONS', 'VEHICLES', 'JOURNEYS', 'EXPERIENCES'];

export const GalleryPage = ({ onNavigate, onBookNowClick }) => {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [galleryItems, setGalleryItems] = useState(GALLERY_ITEMS);

  const fetchGallery = React.useCallback(() => {
    api.getGallery().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const dynamic = data.map((g, idx) => ({
          id: g.id || idx,
          title: g.title || 'Friends Tours Gallery',
          category: (g.category || 'DESTINATIONS').toUpperCase(),
          spanClass: idx % 3 === 0 ? 'span-large' : (idx % 2 === 0 ? 'span-tall' : 'span-standard'),
          image: g.image_url || g.image || '',
          caption: g.caption || g.title || ''
        }));
        setGalleryItems(dynamic);
      }
    }).catch((err) => {
      console.warn('Notice: Using default gallery on GalleryPage:', err.message);
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = `Travel Moments & Photo Gallery | ${BRAND.name}`;
    fetchGallery();
  }, [fetchGallery]);

  useDataSync('gallery', fetchGallery);

  const filtered = activeCategory === 'ALL' 
    ? galleryItems 
    : galleryItems.filter((item) => (item.category || '').toUpperCase() === activeCategory);

  // Gallery keyboard navigation & scroll lock
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setLightboxIndex(null);
        if (e.key === 'ArrowLeft') {
          setLightboxIndex((prev) => (prev === 0 ? filtered.length - 1 : prev - 1));
        }
        if (e.key === 'ArrowRight') {
          setLightboxIndex((prev) => (prev === filtered.length - 1 ? 0 : prev + 1));
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [lightboxIndex, filtered.length]);

  return (
    <div className="page-container" aria-label="Bangalore Travel Photo Gallery">
      <Navbar
        activeSection="gallery"
        onNavClick={onNavigate}
        onBookNowClick={onBookNowClick}
      />

      {/* 1. CINEMATIC HERO */}
      <header className="page-hero">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=80"
          alt="Travel moments gallery"
          className="page-hero-bg"
        />
        <div className="page-hero-scrim" />

        <div className="page-hero-content">
          <nav className="page-breadcrumbs" aria-label="Breadcrumb">
            <span className="page-breadcrumb-link" onClick={() => onNavigate('/')}>Home</span>
            <span>/</span>
            <span style={{ color: '#FFFFFF', fontWeight: 800 }}>Gallery</span>
          </nav>

          <div className="page-eyebrow">
            <Camera size={11} />
            <span>TRAVEL MOMENTS</span>
          </div>

          <h1 className="page-title">
            THE JOURNEY<br />BEYOND THE DESTINATION.
          </h1>

          <p className="page-subtitle">
            Explore Bangalore, Karnataka roads, destinations, vehicles and moments from journeys with Friends Tours &amp; Travels.
          </p>
        </div>
      </header>

      {/* 2. FLOATING CATEGORY FILTER BAR */}
      <section className="rentalcars-controls-section">
        <div className="rentalcars-controls-container">
          <div className="rentalcars-filter-row" role="tablist" aria-label="Gallery categories">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`btn-rental-filter ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. EDITORIAL MASONRY GALLERY */}
      <main className="page-main-section" style={{ paddingTop: 20 }}>
        <div className="page-max-width">
          
          <div className="editorial-gallery-grid">
            {filtered.slice(0, 5).map((item, idx) => (
              <div
                key={item.id}
                className={`editorial-gallery-card ${item.spanClass}`}
                onClick={() => setLightboxIndex(idx)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setLightboxIndex(idx);
                  }
                }}
              >
                <img src={item.image} alt={item.title} className="editorial-gallery-img" loading="lazy" />
                <div className="editorial-gallery-scrim" />
                <div className="editorial-gallery-info">
                  <span className="editorial-gallery-cat">{item.category}</span>
                  <h3 className="editorial-gallery-title">{item.title}</h3>
                  <span className="editorial-gallery-action">
                    <Eye size={12} />
                    <span>View Fullscreen →</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 4. FEATURED TRAVEL STORY STRIP */}
          <div className="gallery-story-block">
            <div>
              <span className="service-block-badge">EDITORIAL SPOTLIGHT</span>
              <h2 className="page-section-title" style={{ fontSize: '1.85rem' }}>
                A ROAD THAT STARTS IN BANGALORE
              </h2>
              <p style={{ fontSize: '0.9375rem', lineHeight: 1.7, color: 'var(--color-text-main)', marginBottom: 20 }}>
                "Some journeys are about reaching a destination. Others are about everything you discover along the way — the roadside filter coffee stalls on the Mysore expressway, mist descending over the coffee slopes of Coorg, and twilight falling over historic granite boulders."
              </p>
              <button
                className="btn-page-cta-primary"
                style={{ background: 'var(--color-primary)', color: '#FFFFFF', width: 'fit-content' }}
                onClick={() => onNavigate('/outstation')}
              >
                <span>Explore Destinations</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="service-block-img-wrap" style={{ borderRadius: 20, minHeight: 260 }}>
              <img
                src="/gallery/innova_crysta_highway.jpg"
                alt="Scenic Karnataka roadway"
                className="service-block-img"
              />
            </div>
          </div>

          {/* Remaining Gallery Items */}
          <div className="editorial-gallery-grid" style={{ marginTop: 0 }}>
            {filtered.slice(5).map((item, idx) => (
              <div
                key={item.id}
                className={`editorial-gallery-card ${item.spanClass}`}
                onClick={() => setLightboxIndex(idx + 5)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setLightboxIndex(idx + 5);
                  }
                }}
              >
                <img src={item.image} alt={item.title} className="editorial-gallery-img" loading="lazy" />
                <div className="editorial-gallery-scrim" />
                <div className="editorial-gallery-info">
                  <span className="editorial-gallery-cat">{item.category}</span>
                  <h3 className="editorial-gallery-title">{item.title}</h3>
                  <span className="editorial-gallery-action">
                    <Eye size={12} />
                    <span>View Fullscreen →</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 5. GALLERY FINAL CTA */}
          <div className="page-cta-banner">
            <div>
              <h3 className="page-cta-title">WHERE WILL YOUR NEXT JOURNEY TAKE YOU?</h3>
              <p className="page-cta-desc">
                From airport transfers to multi-day Karnataka escapes, we are ready to plan your next memory on the road.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                className="btn-page-cta-primary"
                onClick={() => onNavigate('/contact?intent=booking')}
              >
                <span>Book Your Journey</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* 6. FULLSCREEN LIGHTBOX */}
      {lightboxIndex !== null && (
        <div
          className="gallery-lightbox-backdrop"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="gallery-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn-lightbox-close"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <button
              className="btn-lightbox-nav btn-lightbox-prev"
              onClick={() => setLightboxIndex((prev) => (prev === 0 ? filtered.length - 1 : prev - 1))}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              className="btn-lightbox-nav btn-lightbox-next"
              onClick={() => setLightboxIndex((prev) => (prev === filtered.length - 1 ? 0 : prev + 1))}
            >
              <ChevronRight size={24} />
            </button>

            <div className="gallery-lightbox-img-wrapper">
              <img
                src={filtered[lightboxIndex].image}
                alt={filtered[lightboxIndex].title}
                className="gallery-lightbox-img"
              />
            </div>
            
            <div className="gallery-lightbox-info">
              <span className="gallery-category-pill" style={{ color: 'var(--color-lavender)' }}>
                {filtered[lightboxIndex].category}
              </span>
              <h3 className="gallery-lightbox-title">{filtered[lightboxIndex].title}</h3>
              <p className="gallery-lightbox-desc">{filtered[lightboxIndex].caption}</p>
            </div>
          </div>
        </div>
      )}

      <Footer
        onNavClick={onNavigate}
        onBookClick={onBookNowClick}
      />
    </div>
  );
};
