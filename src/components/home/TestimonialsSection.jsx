import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Heart
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { useDataSync } from '../../hooks/useDataSync';
import { TESTIMONIALS_DATA } from '../../data/testimonialsData.js';
import '../../styles/testimonials.css';

export const TestimonialsSection = () => {
  const [allTestimonials, setAllTestimonials] = useState(TESTIMONIALS_DATA);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSliderPaused, setIsSliderPaused] = useState(false);
  const touchStartXRef = useRef(null);

  const fetchTestimonials = useCallback(() => {
    api.getTestimonials().then(data => {
      const raw = Array.isArray(data) ? data : data?.testimonials || [];
      if (raw.length > 0) {
        const normalized = raw.map(t => ({
          ...t,
          customerName: t.customer_name || t.customerName || 'Guest',
          quote: t.review || t.quote || '',
          tripType: t.trip_type || t.tripType || '',
          destination: [t.location, t.vehicle_used].filter(Boolean).join(' • ') || t.destination || '',
          tag: t.tag || t.trip_type || (t.vehicle_used ? t.vehicle_used : 'REVIEW'),
          rating: t.rating || 5,
          featured: t.is_featured || t.featured || false,
          image: t.image_url || t.image || null,
        }));
        setAllTestimonials(normalized);
      }
    }).catch(console.error);
  }, []);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  useDataSync('testimonials', fetchTestimonials);

  const featuredStories = allTestimonials.filter(item => item.featured);
  const supportingStories = allTestimonials.filter(item => !item.featured);
  const stories = featuredStories.length > 0 ? featuredStories : allTestimonials;
  const currentFeatured = stories[featuredIndex % stories.length] || stories[0];

  // Continuous auto-sliding one after another every 4.5 seconds
  useEffect(() => {
    if (stories.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % stories.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [stories.length, isPaused]);

  const handlePrev = () => {
    if (stories.length <= 1) return;
    setFeaturedIndex(prev => (prev === 0 ? stories.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (stories.length <= 1) return;
    setFeaturedIndex(prev => (prev === stories.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    setIsPaused(true);
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartXRef.current - touchEndX;
      // Swipe threshold 35px
      if (Math.abs(diff) > 35) {
        if (diff > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
      touchStartXRef.current = null;
    }
    // Resume auto-sliding after user interaction finishes
    setTimeout(() => setIsPaused(false), 2000);
  };

  if (!currentFeatured) return null;

  const AVATAR_COLORS = ['#0A1938', '#1e3a8a', '#1d4ed8', '#0369a1', '#0f766e'];
  const avatarBg = AVATAR_COLORS[featuredIndex % AVATAR_COLORS.length];
  const initial = (currentFeatured.customerName || 'G')[0].toUpperCase();

  return (
    <section id="testimonials" className="testimonials-section" aria-label="Customer Experiences and Testimonials">
      <div className="testimonials-container">
        <div className="testimonials-header reveal-on-scroll">
          <span className="testimonials-eyebrow">
            <Sparkles size={13} />
            <span>TRAVELLERS LOVE THE JOURNEY</span>
          </span>
          <h2 className="testimonials-title">WHAT OUR TRAVELLERS SAY</h2>
          <p className="testimonials-subtitle">Real experiences help us make every journey better.</p>
        </div>

        <div 
          className="testimonials-featured-panel reveal-scale"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div key={`content-${featuredIndex}`} className="test-featured-content test-slide-animate">
            <div className="test-quote-icon-large">&ldquo;</div>
            <div className="test-stars-row" aria-label={currentFeatured.rating + " Star Rating"}>
              {[...Array(currentFeatured.rating || 5)].map((_, i) => (
                <Star key={i} size={18} fill="#F59E0B" stroke="#F59E0B" />
              ))}
            </div>
            <p className="test-featured-quote">&ldquo;{currentFeatured.quote}&rdquo;</p>
            <div className="test-author-row">
              <div className="test-author-info">
                <div className="test-author-name">{currentFeatured.customerName}</div>
                <div className="test-author-meta">
                  {currentFeatured.tripType && <span>{currentFeatured.tripType}</span>}
                  {currentFeatured.tripType && currentFeatured.destination && <span> • </span>}
                  {currentFeatured.destination && <span>{currentFeatured.destination}</span>}
                </div>
              </div>
              {stories.length > 1 && (
                <div className="test-controls-row">
                  <div className="test-dots-indicator" aria-label="Slide indicators">
                    {stories.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`test-dot-btn ${idx === (featuredIndex % stories.length) ? 'active' : ''}`}
                        onClick={() => setFeaturedIndex(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                  <div className="test-nav-arrows">
                    <button className="btn-test-nav" onClick={handlePrev} aria-label="Previous testimonial">
                      <ChevronLeft size={20} />
                    </button>
                    <button className="btn-test-nav" onClick={handleNext} aria-label="Next testimonial">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div key={`vis-${featuredIndex}`} className="test-featured-visual test-slide-animate">
            {currentFeatured.image ? (
              <img src={currentFeatured.image} alt={currentFeatured.customerName}
                className="test-featured-img" loading="lazy"
                onError={e => { e.target.style.display = 'none'; }} />
            ) : (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '100%', height: '100%', minHeight: 240,
                background: 'linear-gradient(135deg, ' + avatarBg + ' 0%, #FA4616 100%)',
                borderRadius: 16, flexDirection: 'column', gap: 14,
              }}>
                <div style={{
                  width: 88, height: 88, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2.75rem', fontWeight: 900, color: '#fff',
                  border: '3px solid rgba(255,255,255,0.35)',
                }}>{initial}</div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: '1.05rem', textAlign: 'center', padding: '0 16px' }}>
                  {currentFeatured.customerName}
                </div>
                {currentFeatured.tripType && (
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8125rem', fontWeight: 600 }}>
                    {currentFeatured.tripType}
                  </div>
                )}
                <div style={{ display: 'flex', gap: 4 }}>
                  {[...Array(currentFeatured.rating || 5)].map((_, i) => (
                    <Star key={i} size={17} fill="#F59E0B" stroke="#F59E0B" />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Continuous Sliding Testimonials Marquee Showcase */}
        {(() => {
          const cardList = supportingStories.length > 0 ? supportingStories : allTestimonials;
          const baseList = cardList.length < 5 ? [...cardList, ...cardList] : cardList;
          const slidingCards = [...baseList, ...baseList];

          if (slidingCards.length === 0) return null;

          return (
            <div className="testimonials-slider-container">
              <div 
                className={`testimonials-slider-track ${isSliderPaused ? 'is-paused' : ''}`}
                style={{ animationPlayState: isSliderPaused ? 'paused' : 'running' }}
                onMouseEnter={() => setIsSliderPaused(true)}
                onMouseLeave={() => setIsSliderPaused(false)}
                onTouchStart={() => setIsSliderPaused(true)}
                onTouchEnd={() => setIsSliderPaused(false)}
              >
                {slidingCards.map((story, idx) => (
                  <div key={`test-slide-${story.id}-${idx}`} className="test-card test-slide-card">
                    <div>
                      <div className="test-card-stars">
                        {[...Array(story.rating || 5)].map((_, i) => (
                          <Star key={i} size={15} fill="#F59E0B" stroke="#F59E0B" />
                        ))}
                      </div>
                      <p className="test-card-quote">&ldquo;{story.quote}&rdquo;</p>
                    </div>
                    <div className="test-card-footer">
                      <div>
                        <div className="test-card-author">{story.customerName}</div>
                        {story.tripType && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 2 }}>
                            {story.tripType}
                          </div>
                        )}
                      </div>
                      {story.tag && <span className="test-card-tag">{story.tag}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        <div className="testimonials-trust-statement reveal-fade">
          <Heart size={16} fill="var(--color-primary, #0D256C)" color="var(--color-primary, #0D256C)" />
          <span>Every journey gives us another opportunity to serve better.</span>
        </div>
      </div>
    </section>
  );
};
