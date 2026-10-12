import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';

export const DestinationCard = ({
  destination,
  isTall = false,
  isFeatured = false,
  directionSequence = ['right', 'left', 'up', 'down'],
  startDelay = 0,
  interval = 4200,
  onSelect,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [currentDirection, setCurrentDirection] = useState('right');
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  const images = destination.images && destination.images.length > 0
    ? destination.images
    : [destination.image];

  const seqIndexRef = useRef(0);
  const timerRef = useRef(null);
  const transitionTimeoutRef = useRef(null);

  // Preload all destination images on mount
  useEffect(() => {
    images.forEach((imgUrl) => {
      const img = new Image();
      img.src = imgUrl;
    });
  }, [images]);

  // Main automatic image rotation timer with staggered start
  useEffect(() => {
    if (images.length <= 1 || isHovered) {
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const startTimer = () => {
      timerRef.current = setTimeout(() => {
        setPrevIndex(currentIndex);
        setIsTransitioning(true);

        const nextDir = directionSequence[seqIndexRef.current % directionSequence.length];
        seqIndexRef.current += 1;
        setCurrentDirection(nextDir);

        setCurrentIndex((prev) => (prev + 1) % images.length);
        setProgressKey((prev) => prev + 1);

        if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
        transitionTimeoutRef.current = setTimeout(() => {
          setIsTransitioning(false);
        }, 1600);
      }, startDelay > 0 && prevIndex === null ? startDelay + interval : interval);
    };

    startTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current);
    };
  }, [currentIndex, isHovered, images.length, interval, startDelay, directionSequence, prevIndex]);

  // Directional transform classes
  const getDirectionClass = (dir) => {
    switch (dir) {
      case 'left': return 'dir-left';
      case 'up': return 'dir-up';
      case 'down': return 'dir-down';
      case 'right':
      default: return 'dir-right';
    }
  };

  return (
    <article
      className={`dest-grid-card ${isTall ? 'dest-grid-card-tall' : 'dest-grid-card-small'} ${isFeatured ? 'dest-card-featured' : ''} ${isHovered ? 'dest-card-hovered' : ''}`}
      onClick={() => onSelect && onSelect(destination)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect && onSelect(destination);
        }
      }}
      aria-label={`${destination.landmark}, ${destination.country}`}
    >
      {/* Dynamic Image Layer Stack */}
      <div className="dest-card-media-viewport">
        {images.map((imgUrl, idx) => {
          const isActive = idx === currentIndex;
          const isPrev = idx === prevIndex && isTransitioning;

          if (!isActive && !isPrev) return null;

          let animClass = '';
          if (isActive) {
            animClass = `dest-img-active ${getDirectionClass(currentDirection)}`;
          } else if (isPrev) {
            animClass = `dest-img-exit ${getDirectionClass(currentDirection)}`;
          }

          return (
            <img
              key={`${destination.id}-${idx}-${imgUrl}`}
              src={imgUrl}
              alt={`${destination.landmark} - view ${idx + 1}`}
              className={`dest-card-media ${animClass}`}
              loading="lazy"
            />
          );
        })}
      </div>

      {/* Dark Scrim Gradient Overlay */}
      <div className="dest-card-gradient" />

      {/* Top Glass Badge */}
      {destination.badge && (
        <span className="dest-card-pill-badge">{destination.badge}</span>
      )}

      {/* Static Card Content Overlay */}
      <div className="dest-card-info">
        <div className="dest-card-country-title">{destination.country}</div>
        <div className="dest-card-landmark">{destination.landmark}</div>
        {destination.description && (
          <p className="dest-card-desc">{destination.description}</p>
        )}
        <div className="dest-card-explore">
          <span>Explore</span>
          <ArrowRight size={13} className="dest-card-explore-icon" />
        </div>
      </div>

      {/* Subtle Micro Progress Bar Line */}
      {images.length > 1 && (
        <div className="dest-card-progress-track">
          <div
            key={progressKey}
            className={`dest-card-progress-bar ${isHovered ? 'dest-progress-paused' : ''}`}
            style={{ animationDuration: `${interval}ms` }}
          />
        </div>
      )}
    </article>
  );
};
