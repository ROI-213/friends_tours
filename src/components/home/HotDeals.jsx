import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Sparkles, 
  Utensils, 
  ArrowUpRight,
  ShieldCheck,
  MapPin,
  Car
} from 'lucide-react';
import '../../styles/hotdeals.css';

export const HOT_DEALS_DATA = [
  {
    id: 'deal-nandi',
    slug: 'nandi-hills-sunrise',
    title: 'Nandi Hills Sunrise',
    country: 'Karnataka',
    destination: 'Nandi Hills',
    duration: '1 Day',
    tier: 'Sedan / SUV',
    perk: 'Sunrise & Scenic Drive',
    price: '₹1,999',
    badge: 'BEST SELLER',
    image: '/destinations/nandi-hills-sunrise.jpg',
    description: 'Catch the famous cloud-bed sunrise at Nandi Hills with doorstep 4:30 AM pickup from Bangalore.'
  },
  {
    id: 'deal-mysore',
    slug: 'mysore-heritage-escape',
    title: 'Mysore Heritage Escape',
    country: 'Karnataka',
    destination: 'Mysore',
    duration: '1 Day',
    tier: 'Sedan / SUV / Innova',
    perk: 'Mysore Palace & Chamundi',
    price: '₹3,499',
    badge: 'POPULAR',
    image: '/destinations/mysore-palace.jpg',
    description: 'Expressway journey to the illuminated Mysore Palace, Chamundi Hills, and silk heritage craft centers.'
  },
  {
    id: 'deal-coorg',
    slug: 'coorg-nature-retreat',
    title: 'Coorg Nature Retreat',
    country: 'Karnataka',
    destination: 'Coorg',
    duration: '2 Days / 1 Night',
    tier: 'SUV / Innova / Tempo',
    perk: 'Coffee Estates & Waterfalls',
    price: '₹6,499',
    badge: 'WEEKEND DEAL',
    image: '/destinations/coorg-abbey-falls.jpg',
    description: 'Misty Western Ghats mountain roads, Abbey Falls, Dubare Elephant Camp, and private coffee estates.'
  },
  {
    id: 'deal-chikmagalur',
    slug: 'chikkamagaluru-escape',
    title: 'Chikkamagaluru Escape',
    country: 'Karnataka',
    destination: 'Chikkamagaluru',
    duration: '2 Days / 1 Night',
    tier: 'SUV / Innova / Tempo',
    perk: 'Hills & Coffee Trails',
    price: '₹5,999',
    badge: 'SPECIAL',
    image: '/destinations/chikmagalur-mullayanagiri.jpg',
    description: 'Trek to Mullayanagiri peak, explore Hebbe waterfalls, and stay in lush coffee estates.'
  }
];

export const HotDeals = ({ onSelectDeal }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(4);
  const touchStartXRef = useRef(null);

  // Update visible items count based on window resize
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w <= 640) {
        setVisibleCount(1);
      } else if (w <= 900) {
        setVisibleCount(2);
      } else if (w <= 1200) {
        setVisibleCount(3);
      } else {
        setVisibleCount(4);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, HOT_DEALS_DATA.length - visibleCount);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Touch Swipe handlers
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartXRef.current = null;
  };

  return (
    <section id="hot-deals" className="hotdeals-wrapper" aria-label="Bangalore & Karnataka Hot Travel Deals">
      <div className="hotdeals-container">
        
        <div className="hotdeals-card-panel">
          
          {/* Header Row with Eyebrow, Title & Carousel Buttons */}
          <div className="hotdeals-header">
            <div className="hotdeals-header-left">
              <span className="hotdeals-eyebrow">
                <Sparkles size={13} />
                <span>BANGALORE &amp; KARNATAKA DEALS</span>
              </span>
              <h2 className="hotdeals-title">HOT DEALS</h2>
              <p className="hotdeals-subtitle">
                Exclusive journeys from Bangalore. Exceptional comfort. Better value.
              </p>
            </div>

            {/* Navigation Buttons */}
            <div className="hotdeals-controls" aria-label="Deals Carousel Controls">
              <button
                className="carousel-btn"
                onClick={handlePrev}
                disabled={currentIndex === 0}
                aria-label="Previous Deals"
              >
                <ChevronLeft size={20} />
              </button>

              <button
                className="carousel-btn"
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                aria-label="Next Deals"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Carousel Viewport */}
          <div 
            className="hotdeals-carousel-viewport"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="hotdeals-track"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {HOT_DEALS_DATA.map((deal) => (
                <article 
                  key={deal.id} 
                  className="deal-card"
                  onClick={() => onSelectDeal && onSelectDeal(deal)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectDeal && onSelectDeal(deal);
                    }
                  }}
                  aria-label={`${deal.title}, ${deal.duration}, starting at ${deal.price}`}
                >
                  <img
                    src={deal.image}
                    alt={`${deal.title} - ${deal.country}`}
                    className="deal-card-img"
                    loading="lazy"
                  />
                  <div className="deal-card-scrim" />

                  {/* Top Badge */}
                  {deal.badge && (
                    <span className="deal-card-badge">{deal.badge}</span>
                  )}

                  {/* Lower Content Over Image */}
                  <div className="deal-card-content">
                    <h3 className="deal-card-title">{deal.title}</h3>
                    
                    <div className="deal-card-meta">
                      <span className="deal-meta-item">
                        <Calendar size={13} color="#FA4616" />
                        <span>{deal.duration}</span>
                      </span>
                      <span className="deal-meta-item">
                        <Car size={13} color="#FA4616" />
                        <span>{deal.tier}</span>
                      </span>
                      <span className="deal-meta-item">
                        <Sparkles size={13} color="#FA4616" />
                        <span>{deal.perk}</span>
                      </span>
                    </div>

                    <button 
                      className="btn-discover"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDeal && onSelectDeal(deal);
                      }}
                    >
                      <span>Discover Now</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Dots on mobile / tablet */}
          <div className="hotdeals-dots" aria-hidden="true">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                className={`hotdeals-dot ${currentIndex === idx ? 'active' : ''}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
