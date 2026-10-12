import React, { useState, useEffect, useCallback } from 'react';
import { Clock, MapPin, Car, ArrowRight, Sparkles, Compass, Users } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useDataSync } from '../../hooks/useDataSync';
import { PACKAGES_DATA } from '../../data/packagesData.js';
import '../../styles/packages.css';

const FILTERS = ['ALL', 'DAY TRIPS', 'WEEKEND', 'FAMILY', 'NATURE', 'HERITAGE', 'CORPORATE'];

const INITIAL_PACKAGES = (PACKAGES_DATA || []).map(p => ({
  ...p,
  image: p.hero_image || p.heroImage || p.image_url || p.image || '/destinations/default.jpg',
  description: p.short_description || p.shortDescription || p.overview || '',
  placesCovered: Array.isArray(p.highlights) ? p.highlights.slice(0, 4).join(' • ') : (p.places_covered || p.placesCovered || ''),
  vehicles: p.default_vehicle || p.defaultVehicle || (Array.isArray(p.vehicle_options || p.vehicleOptions) ? (p.vehicle_options || p.vehicleOptions).slice(0, 2).join(', ') : ''),
  category: Array.isArray(p.category) ? p.category : (p.travelType ? [p.travelType] : []),
  travel_type: p.travel_type || p.travelType || '',
  badge: p.badge || '',
  best_for: p.best_for || p.bestFor || '',
  price_starting: p.price_starting || p.priceStarting || 'Custom Quote',
  duration: p.duration || '',
  group_size: p.group_size || p.groupSize || ''
}));

export const PopularPackages = ({ onEnquirePackage, onViewPackage }) => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [packages, setPackages] = useState(INITIAL_PACKAGES);

  const fetchPackages = useCallback(() => {
    api.getPackages({ enabled: true }).then(data => {
      const raw = Array.isArray(data) ? data : data?.packages || [];
      if (raw.length > 0) {
        const normalized = raw.map(p => ({
          ...p,
          image: p.hero_image || p.heroImage || p.image_url || p.image || '/destinations/default.jpg',
          description: p.short_description || p.overview || '',
          placesCovered: Array.isArray(p.highlights) ? p.highlights.slice(0, 4).join(' • ') : (p.places_covered || ''),
          vehicles: p.default_vehicle || (Array.isArray(p.vehicle_options) ? p.vehicle_options.slice(0, 2).join(', ') : ''),
          category: Array.isArray(p.category) ? p.category : [],
        }));
        setPackages(normalized);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  useDataSync('packages', fetchPackages);

  const filteredPackages = packages.filter((pkg) => {
    if (activeFilter === 'ALL') return true;
    // Match filter against travel_type or badge or category
    const haystack = [
      ...(Array.isArray(pkg.category) ? pkg.category : []),
      pkg.travel_type || '',
      pkg.badge || '',
      pkg.best_for || '',
    ].join(' ').toUpperCase();
    return haystack.includes(activeFilter);
  });

  const featuredPackage = filteredPackages.find(p => p.featured) || filteredPackages[0];
  const stackedPackages = filteredPackages.filter(p => p.id !== featuredPackage?.id).slice(0, 2);
  const lowerPackages = filteredPackages.filter(p => p.id !== featuredPackage?.id).slice(2);

  const renderCard = (pkg, cardTypeClass = 'pkg-card-supporting') => {
    if (!pkg) return null;
    const isFeatured = cardTypeClass === 'pkg-card-featured';
    return (
      <article
        key={pkg.id}
        className={`pkg-card ${cardTypeClass}`}
        onClick={() => onViewPackage && onViewPackage(pkg)}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onViewPackage && onViewPackage(pkg); } }}
        aria-label={`${pkg.name}, ${pkg.destination}`}
        style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, cursor: 'pointer' }}
      >
        {/* Place Image */}
        <img
          src={pkg.image}
          alt={`${pkg.destination} Karnataka travel`}
          className="pkg-card-media"
          loading="lazy"
          onError={e => { e.target.src = '/destinations/mysore-palace.jpg'; }}
        />

        {/* Gradient scrim */}
        <div className="pkg-card-scrim" />

        {/* Badge */}
        {pkg.badge && (
          <span className={`pkg-badge-pill ${pkg.featured ? 'pkg-badge-featured' : ''}`}>
            {pkg.badge}
          </span>
        )}

        {/* PLACE NAME — prominent overlay at top of image */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          padding: isFeatured ? '20px 20px 60px' : '14px 14px 40px',
          background: 'linear-gradient(to bottom, rgba(10,25,56,0.75) 0%, transparent 100%)',
          zIndex: 3,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 5,
            color: 'rgba(255,255,255,0.85)', fontSize: isFeatured ? '0.8rem' : '0.7rem',
            fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            <MapPin size={isFeatured ? 13 : 11} />
            <span>Karnataka, India</span>
          </div>
          <div style={{
            color: '#ffffff',
            fontSize: isFeatured ? '2rem' : '1.35rem',
            fontWeight: 900,
            lineHeight: 1.1,
            marginTop: 4,
            textShadow: '0 2px 12px rgba(0,0,0,0.6)',
            fontFamily: '"Poppins", sans-serif',
          }}>
            {pkg.destination}
          </div>
          {pkg.travel_type && (
            <div style={{
              color: 'rgba(255,200,80,0.95)', fontSize: isFeatured ? '0.78rem' : '0.68rem',
              fontWeight: 700, marginTop: 4, letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              {pkg.travel_type}
            </div>
          )}
        </div>

        {/* Card bottom content */}
        <div className="pkg-card-content">
          <h3 className="pkg-title" style={{ marginTop: 0, marginBottom: 6 }}>{pkg.name}</h3>

          {pkg.description && (
            <p style={{
              color: 'rgba(255,255,255,0.85)', fontSize: isFeatured ? '0.875rem' : '0.78rem',
              lineHeight: 1.5, margin: '0 0 10px', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            }}>
              {pkg.description}
            </p>
          )}

          <div className="pkg-meta-row">
            <span className="pkg-meta-item">
              <Clock size={12} />
              <span>{pkg.duration}</span>
            </span>
            {pkg.group_size && (
              <span className="pkg-meta-item">
                <Users size={12} />
                <span>{pkg.group_size}</span>
              </span>
            )}
            {pkg.vehicles && (
              <span className="pkg-meta-item">
                <Car size={12} />
                <span>{pkg.vehicles}</span>
              </span>
            )}
          </div>

          <div className="pkg-action-row" onClick={(e) => e.stopPropagation()}>
            <div>
              <span className="pkg-price-text">Starting from</span>
              <span className="pkg-price-val">{pkg.price_starting || 'Custom Quote'}</span>
            </div>
            <div className="pkg-cta-btns">
              <button className="btn-pkg-view" onClick={() => onViewPackage && onViewPackage(pkg)}>
                <span>View Details</span>
                <ArrowRight size={12} />
              </button>
              <button className="btn-pkg-enquire" onClick={() => onEnquirePackage && onEnquirePackage(pkg)}>
                Enquire Now
              </button>
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <section id="packages" className="packages-section" aria-label="Popular Bangalore Getaways and Tour Packages">
      <div className="packages-container">

        {/* Section Header */}
        <div className="packages-header reveal-on-scroll">
          <span className="packages-eyebrow">
            <Compass size={13} />
            <span>EXPLORE DAY TRIPS &amp; GETAWAYS</span>
          </span>
          <h2 className="packages-title">POPULAR BANGALORE GETAWAYS</h2>
          <p className="packages-subtitle">
            Thoughtfully planned Karnataka road trips with private luxury chauffeur cabs from Bangalore.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="packages-filter-wrapper">
          <div className="packages-filter-row" role="tablist">
            {FILTERS.map((filter) => (
              <button key={filter} role="tab" aria-selected={activeFilter === filter}
                className={`packages-filter-pill ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}>
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Package Grid */}
        {filteredPackages.length === 0 ? (
          <div className="packages-empty-state">
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)' }}>
              No packages for this filter. Try "ALL".
            </p>
          </div>
        ) : (
          <div className="packages-editorial-layout reveal-scale">
            <div className="packages-top-tier">
              {renderCard(featuredPackage, 'pkg-card-featured')}
              {stackedPackages.length > 0 && (
                <div className="packages-stacked-col">
                  {stackedPackages.map(pkg => renderCard(pkg, 'pkg-card-supporting'))}
                </div>
              )}
            </div>
            {lowerPackages.length > 0 && (
              <div className="packages-bottom-tier">
                {lowerPackages.map(pkg => renderCard(pkg, 'pkg-card-row'))}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
