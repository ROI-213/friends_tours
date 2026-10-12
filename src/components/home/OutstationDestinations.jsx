import React, { useState, useEffect, useCallback } from 'react';
import { 
  Clock, 
  MapPin, 
  Car, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  Navigation 
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { useDataSync } from '../../hooks/useDataSync';
import '../../styles/outstation.css';

const OUTSTATION_DATA = [
  {
    id: 'outstation-coorg',
    slug: 'coorg-karnataka',
    name: 'Coorg',
    state: 'Karnataka',
    badge: 'COFFEE ESCAPE',
    featured: true,
    image: '/destinations/coorg-abbey-falls.jpg',
    description: 'Plan a relaxed road trip from Bangalore through scenic coffee plantations, misty hill roads, and waterfalls with a dedicated chauffeur.',
    distance: 'Approx 260 km from Bangalore',
    duration: '2–3 Days',
    placesToVisit: 'Abbey Falls, Raja\'s Seat, Dubare Camp, Coffee Estates',
    vehicles: 'Sedan · SUV · Innova Crysta · Tempo',
    category: ['WEEKEND GETAWAYS', 'HILL STATIONS', 'NATURE ESCAPES', 'FAMILY TRIPS'],
  },
  {
    id: 'outstation-mysore',
    slug: 'mysore-karnataka',
    name: 'Mysore',
    state: 'Karnataka',
    badge: 'HERITAGE',
    featured: false,
    image: '/destinations/mysore-palace.jpg',
    description: 'Explore the grand royal palaces, silk bazaars, and historic Chamundi Hills via the new expressway.',
    distance: '145 km from Bangalore',
    duration: '1–2 Days',
    placesToVisit: 'Mysore Palace, Chamundi Hills, Brindavan Gardens',
    vehicles: 'Sedan · SUV · Innova',
    category: ['WEEKEND GETAWAYS', 'HERITAGE', 'FAMILY TRIPS', 'PILGRIMAGE'],
  },
  {
    id: 'outstation-chikmagalur',
    slug: 'chikmagalur-karnataka',
    name: 'Chikkamagaluru',
    state: 'Karnataka',
    badge: 'HILL ESCAPE',
    featured: false,
    image: '/destinations/chikmagalur-mullayanagiri.jpg',
    description: 'Mullayanagiri mountain peaks, coffee estate homestays, and cool mountain breezes.',
    distance: '245 km from Bangalore',
    duration: '2–3 Days',
    placesToVisit: 'Mullayanagiri, Baba Budangiri, Hebbe Falls',
    vehicles: 'SUV · Innova Crysta',
    category: ['WEEKEND GETAWAYS', 'HILL STATIONS', 'NATURE ESCAPES'],
  },
  {
    id: 'outstation-ooty',
    slug: 'ooty-nilgiris',
    name: 'Ooty & Coonoor',
    state: 'Nilgiris',
    badge: 'NILGIRIS',
    featured: false,
    image: '/destinations/ooty-tea-gardens.jpg',
    description: 'Rolling tea gardens, Nilgiri mountain roads, and pine forests just a scenic drive from Bangalore.',
    distance: '280 km from Bangalore',
    duration: '3 Days',
    placesToVisit: 'Botanical Gardens, Doddabetta Peak, Pykara Falls',
    vehicles: 'Innova · Crysta · Tempo',
    category: ['HILL STATIONS', 'FAMILY TRIPS', 'NATURE ESCAPES'],
  },
  {
    id: 'outstation-hampi',
    slug: 'hampi-karnataka',
    name: 'Hampi',
    state: 'Karnataka',
    badge: 'UNESCO',
    featured: false,
    image: 'https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=800&q=80',
    description: 'Ancient stone temples, boulders, and sunset vistas along the Tungabhadra river.',
    distance: '340 km from Bangalore',
    duration: '2–3 Days',
    placesToVisit: 'Virupaksha Temple, Stone Chariot, Lotus Mahal',
    vehicles: 'Innova Crysta · Tempo',
    category: ['HERITAGE', 'PILGRIMAGE', 'FAMILY TRIPS'],
  },
  {
    id: 'outstation-wayanad',
    slug: 'wayanad-kerala',
    name: 'Wayanad',
    state: 'Kerala Border',
    badge: 'RAINFOREST',
    featured: false,
    image: '/destinations/wayanad-hills.jpg',
    description: 'Misty bamboo forests, spice plantations, waterfalls and treehouse stays.',
    distance: '280 km from Bangalore',
    duration: '2–3 Days',
    placesToVisit: 'Edakkal Caves, Banasura Sagar Dam, Soochipara Falls',
    vehicles: 'SUV · Innova Crysta',
    category: ['WEEKEND GETAWAYS', 'HILL STATIONS', 'NATURE ESCAPES'],
  },
  {
    id: 'outstation-kabini',
    slug: 'kabini-karnataka',
    name: 'Kabini & Nagarhole',
    state: 'Karnataka',
    badge: 'WILDLIFE',
    featured: false,
    image: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80',
    description: 'Jungle boat safaris, tiger reserve trails, and riverside eco-resorts.',
    distance: '220 km from Bangalore',
    duration: '2 Days',
    placesToVisit: 'Kabini River Safari, Nagarhole National Park, Forest Lodges',
    vehicles: 'SUV · Innova Crysta',
    category: ['WEEKEND GETAWAYS', 'NATURE ESCAPES', 'FAMILY TRIPS'],
  },
];

const OUTSTATION_FILTERS = ['ALL', 'WEEKEND GETAWAYS', 'HILL STATIONS', 'NATURE ESCAPES', 'HERITAGE', 'FAMILY TRIPS', 'PILGRIMAGE'];

export const OutstationDestinations = ({ onEnquireDestination, onExploreDestination }) => {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isPaused, setIsPaused] = useState(false);
  const [destinations, setDestinations] = useState(OUTSTATION_DATA);

  const fetchDestinations = useCallback(() => {
    api.getOutstationDestinations().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const dynamic = data.map((d, i) => ({
          id: d.id,
          slug: (d.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name: d.name,
          state: d.state || 'Karnataka',
          badge: d.tag || d.badge || 'OUTSTATION',
          featured: i === 0,
          image: d.image || d.image_url || '/destinations/coorg-abbey-falls.jpg',
          description: d.description || `Scenic road trip to ${d.name} (${d.distance_km || 250} km from Bangalore). Starting from ₹${d.starting_price?.toLocaleString ? d.starting_price.toLocaleString('en-IN') : d.starting_price}.`,
          distance: `${d.distance_km || 250} km from Bangalore`,
          duration: d.est_drive_time || '1–2 Days',
          placesToVisit: d.places_to_visit || `${d.name} Sightseeing & Local Trails`,
          vehicles: 'Sedan · SUV · Innova Crysta · Tempo',
          category: ['WEEKEND GETAWAYS', 'HILL STATIONS', 'NATURE ESCAPES', 'FAMILY TRIPS'],
        }));
        setDestinations(dynamic);
      }
    }).catch((err) => {
      console.warn('Notice: Using default outstation data, API fallback active:', err.message);
    });
  }, []);

  useEffect(() => {
    fetchDestinations();
  }, [fetchDestinations]);

  useDataSync('outstation-destinations', fetchDestinations);

  const filteredDestinations = destinations.filter((dest) => {
    if (activeFilter === 'ALL') return true;
    return dest.category.includes(activeFilter);
  });

  // Ensure seamless infinite loop by duplicating list (first half matches second half)
  const baseList = filteredDestinations.length < 5
    ? [...filteredDestinations, ...filteredDestinations]
    : filteredDestinations;
  const slidingDestinations = [...baseList, ...baseList];

  return (
    <section id="outstation" className="outstation-section" aria-label="Popular Outstation Travel Destinations from Bangalore">
      <div className="outstation-container">
        
        {/* Section Header */}
        <div className="outstation-header">
          <span className="outstation-eyebrow">
            <Compass size={13} />
            <span>OUTSTATION TRAVEL</span>
          </span>
          <h2 className="outstation-title">POPULAR OUTSTATION DESTINATIONS FROM BANGALORE</h2>
          <p className="outstation-subtitle">
            From weekend escapes to multi-day Karnataka journeys, discover destinations worth travelling for with certified highway chauffeurs.
          </p>
        </div>

        {/* Filter Navigation Pills */}
        <div className="outstation-filter-wrapper">
          <div className="outstation-filter-row" role="tablist" aria-label="Outstation destination filters">
            {OUTSTATION_FILTERS.map((filter) => (
              <button
                key={filter}
                role="tab"
                aria-selected={activeFilter === filter}
                className={`outstation-filter-pill ${activeFilter === filter ? 'active' : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Continuous Sliding Showcase */}
        {filteredDestinations.length === 0 ? (
          <div className="outstation-empty-state">
            <p style={{ fontSize: '1.05rem', color: 'var(--color-text-muted)' }}>
              No destinations found for this selection.
            </p>
          </div>
        ) : (
          <div className="outstation-slider-container">
            <div 
              key={activeFilter}
              className={`outstation-slider-track ${isPaused ? 'is-paused' : ''}`}
              style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
            >
              {slidingDestinations.map((dest, idx) => (
                <article
                  key={`${dest.id}-${idx}`}
                  className="outstation-card outstation-slide-card"
                  onClick={() => onExploreDestination && onExploreDestination(dest)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onExploreDestination && onExploreDestination(dest);
                    }
                  }}
                  aria-label={`${dest.name}, ${dest.state}`}
                >
                  <img
                    src={dest.image}
                    alt={`${dest.name}, ${dest.state}`}
                    className="outstation-card-media"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/gallery/vidhana_soudha.jpg';
                    }}
                  />
                  <div className="outstation-card-scrim" />

                  {/* Top Glass Badge & Distance */}
                  <div className="outstation-card-top">
                    <span className="outstation-card-badge">{dest.badge}</span>
                    {dest.distance && (
                      <span className="outstation-card-dist">
                        <MapPin size={11} />
                        <span>{dest.distance.replace(/approx\s*/i, '').replace('from Bangalore', '').trim()}</span>
                      </span>
                    )}
                  </div>

                  <div className="outstation-card-content">
                    <div className="outstation-card-location">
                      <h4 className="outstation-card-title">{dest.name}</h4>
                      <span className="outstation-card-state">{dest.state}</span>
                    </div>

                    {dest.description && (
                      <p className="outstation-card-desc">{dest.description}</p>
                    )}

                    <div className="outstation-card-footer">
                      <div className="outstation-card-duration">
                        <Clock size={13} />
                        <span>{dest.duration}</span>
                      </div>
                      <div className="outstation-card-explore">
                        <span>Explore</span>
                        <ArrowRight size={13} />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
