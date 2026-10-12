import React, { useState, useEffect, useCallback } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Camera, 
  Compass 
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { useDataSync } from '../../hooks/useDataSync';
import '../../styles/gallery.css';

export const GALLERY_DATA = [
  {
    id: 'gal-1',
    title: 'Mysore Palace Illuminated Heritage',
    category: 'DESTINATIONS',
    badge: 'FEATURED JOURNEY',
    featured: true,
    layoutClass: 'gallery-item-tall',
    image: 'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1200&q=80',
    description: 'The golden illumination of Mysore Palace during dusk, a centerpiece of our Karnataka heritage tours.',
  },
  {
    id: 'gal-2',
    title: 'Innova Crysta Highway Tour Fleet',
    category: 'VEHICLES',
    badge: 'LUXURY FLEET',
    featured: false,
    layoutClass: '',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    description: 'Spotless, air-conditioned executive Innova Crysta ready for highway outstation travel from Bangalore.',
  },
  {
    id: 'gal-3',
    title: 'Coorg Misty Mountain Pass',
    category: 'JOURNEYS',
    badge: 'SCENIC ROAD',
    featured: false,
    layoutClass: '',
    image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
    description: 'Winding forest roads and coffee plantations in the Western Ghats of Coorg.',
  },
  {
    id: 'gal-4',
    title: 'Chikmagalur Sunrise Estate Trails',
    category: 'DESTINATIONS',
    badge: 'HILL ESCAPE',
    featured: false,
    layoutClass: 'gallery-item-tall',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    description: 'Panoramic mountain viewpoints and morning coffee trail walks in Chikkamagaluru.',
  },
  {
    id: 'gal-5',
    title: 'Bangalore City & Vidhana Soudha',
    category: 'BANGALORE',
    badge: 'CITY LANDMARK',
    featured: false,
    layoutClass: 'gallery-item-wide',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=1200&q=80',
    description: 'Historic architecture and botanical landmarks across Bangalore city tour packages.',
  },
  {
    id: 'gal-6',
    title: 'Travellers Arriving in Comfort',
    category: 'EXPERIENCES',
    badge: 'FAMILY MOMENTS',
    featured: false,
    layoutClass: '',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
    description: 'Hassle-free Kempegowda Airport and hotel pickups with dedicated chauffeur luggage assistance.',
  },
  {
    id: 'gal-7',
    title: 'Executive Corporate Sedan',
    category: 'VEHICLES',
    badge: 'BUSINESS MOBILITY',
    featured: false,
    layoutClass: '',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    description: 'Quiet, premium executive sedans for airport transfers and Bangalore tech park delegations.',
  },
  {
    id: 'gal-8',
    title: 'Ancient Stone Chariot, Hampi',
    category: 'EXPERIENCES',
    badge: 'HERITAGE',
    featured: false,
    layoutClass: 'gallery-item-wide',
    image: 'https://images.unsplash.com/photo-1600100397608-f010f443a504?auto=format&fit=crop&w=1200&q=80',
    description: 'UNESCO World Heritage monuments and historic boulder landscapes in Hampi.',
  },
];

const normalizeCategory = (cat) => {
  const upper = String(cat || '').toUpperCase().trim();
  if (upper === 'FLEET' || upper === 'VEHICLE' || upper === 'VEHICLES' || upper === 'CAR' || upper === 'CARS') return 'VEHICLES';
  if (upper === 'OUTSTATION' || upper === 'DESTINATION' || upper === 'DESTINATIONS') return 'DESTINATIONS';
  if (upper === 'AIRPORT' || upper === 'BANGALORE' || upper === 'LOCAL') return 'BANGALORE';
  if (upper === 'TOUR' || upper === 'TOURS' || upper === 'JOURNEY' || upper === 'JOURNEYS') return 'JOURNEYS';
  if (upper === 'EXPERIENCE' || upper === 'EXPERIENCES' || upper === 'MOMENTS' || upper === 'GENERAL') return 'EXPERIENCES';
  return upper || 'DESTINATIONS';
};

const GALLERY_FILTERS = ['ALL', 'BANGALORE', 'DESTINATIONS', 'VEHICLES', 'JOURNEYS', 'EXPERIENCES'];

export const TravelGallery = () => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [galleryList, setGalleryList] = useState(GALLERY_DATA);

  const fetchGallery = useCallback(() => {
    api.getGallery().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const dynamic = data.map((g, i) => ({
          id: g.id,
          title: g.title || 'Friends Tours & Travels',
          category: normalizeCategory(g.category),
          badge: g.is_featured ? 'FEATURED' : '',
          featured: !!g.is_featured,
          layoutClass: i % 4 === 0 ? 'gallery-item-tall' : (i % 5 === 0 ? 'gallery-item-wide' : ''),
          image: g.image_url || g.image || '',
          description: g.caption || g.title || 'Tour memory with Friends Tours & Travels',
        }));
        const dynamicUrls = new Set(data.map(d => d.image_url));
        const remainingDefaults = GALLERY_DATA.filter(d => !dynamicUrls.has(d.image));
        setGalleryList([...dynamic, ...remainingDefaults]);
      }
    }).catch((err) => {
      console.warn('Notice: Using default gallery data:', err.message);
    });
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  useDataSync('gallery', fetchGallery);

  const filteredItems = galleryList.filter((item) => {
    if (activeFilter === 'ALL') return true;
    return item.category === activeFilter;
  });

  const activeItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  // Keyboard navigation & body scroll lock for Lightbox
  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') setLightboxIndex(null);
        if (e.key === 'ArrowLeft') {
          setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1));
        }
        if (e.key === 'ArrowRight') {
          setLightboxIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1));
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [lightboxIndex, filteredItems.length]);

  return (
    <section id="gallery" className="gallery-section" aria-label="Travel Moments & Gallery">
      <div className="gallery-container">
        
        {/* Section Header */}
        <div className="gallery-header">
          <span className="gallery-eyebrow">
            <Camera size={13} />
            <span>TRAVEL MOMENTS</span>
          </span>
          <h2 className="gallery-title">MEMORIES FROM THE ROAD</h2>
          <p className="gallery-subtitle">
            Explore moments from Bangalore journeys, Karnataka destinations and travel experiences with Friends Tours &amp; Travels.
          </p>
        </div>

        {/* Filter Navigation Pills */}
        <div className="gallery-filter-wrapper">
          <div className="gallery-filter-row" role="tablist" aria-label="Gallery category filters">
            {GALLERY_FILTERS.map((filter) => (
              <button
                key={filter}
                role="tab"
                aria-selected={activeFilter === filter}
                className={`gallery-filter-pill ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => {
                  setActiveFilter(filter);
                  setLightboxIndex(null);
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetric Editorial Masonry Grid */}
        {filteredItems.length === 0 ? (
          <div className="gallery-empty-state">
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)' }}>
              No moments available in this category yet.
            </p>
          </div>
        ) : (
          <div className="gallery-grid">
            {filteredItems.map((item, index) => (
              <article
                key={item.id}
                className={`gallery-card ${activeFilter === 'ALL' ? item.layoutClass : ''}`}
                onClick={() => setLightboxIndex(index)}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setLightboxIndex(index);
                  }
                }}
                aria-label={`View photo: ${item.title}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="gallery-card-img"
                  loading={index > 3 ? 'lazy' : 'eager'}
                />
                <div className="gallery-card-scrim" />

                {item.badge && (
                  <span className={`gallery-badge-pill ${item.featured ? 'gallery-badge-featured' : ''}`}>
                    {item.badge}
                  </span>
                )}

                <div className="gallery-card-overlay">
                  <span className="gallery-card-category">{item.category}</span>
                  <h3 className="gallery-card-title">{item.title}</h3>
                  <div className="gallery-card-action">
                    <span>View Moment</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>

      {/* --- Fullscreen Lightbox Modal --- */}
      {activeItem && (
        <div
          className="gallery-lightbox-backdrop"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label={activeItem.title}
        >
          <div
            className="gallery-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              className="btn-lightbox-close"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close Lightbox"
            >
              <X size={20} />
            </button>

            {/* Previous Button */}
            <button
              className="btn-lightbox-nav btn-lightbox-prev"
              onClick={() => setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : prev - 1))}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Next Button */}
            <button
              className="btn-lightbox-nav btn-lightbox-next"
              onClick={() => setLightboxIndex((prev) => (prev === filteredItems.length - 1 ? 0 : prev + 1))}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>

            {/* Image Wrapper */}
            <div className="gallery-lightbox-img-wrapper">
              <img
                src={activeItem.image}
                alt={activeItem.title}
                className="gallery-lightbox-img"
              />
            </div>

            {/* Caption & Details */}
            <div className="gallery-lightbox-info">
              <h3 className="gallery-lightbox-title">{activeItem.title}</h3>
              <p className="gallery-lightbox-desc">{activeItem.description}</p>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
