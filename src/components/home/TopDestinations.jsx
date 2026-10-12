import React, { useState, useEffect, useCallback } from 'react';
import { Compass } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useDataSync } from '../../hooks/useDataSync';
import { DestinationCard } from './DestinationCard';
import '../../styles/destinations.css';

export const DESTINATIONS_DATA = {
  column1: {
    id: 'dest-nandi',
    country: 'Karnataka',
    landmark: 'Nandi Hills',
    badge: 'SUNRISE PEAK',
    image: '/destinations/nandi-hills-sunrise.jpg',
    images: [
      '/destinations/nandi-hills-sunrise.jpg',
      '/destinations/nandi-viewpoint.jpg',
      '/destinations/nandi-valley.jpg',
    ],
    directionSequence: ['right', 'left', 'up', 'down'],
    startDelay: 0,
    description: 'Scenic hill destination near Bangalore famous for cloud-bed sunrise vistas, historic fortress walls, and cycling trails.',
  },
  column2_top: {
    id: 'dest-ramanagara',
    country: 'Karnataka',
    landmark: 'Ramanagara',
    badge: 'ADVENTURE',
    image: '/destinations/ramanagara-hills.jpg',
    images: [
      '/destinations/ramanagara-hills.jpg',
      '/destinations/ramanagara-boulders.jpg',
      '/destinations/ramanagara-trek.jpg',
    ],
    directionSequence: ['up', 'right', 'down', 'left'],
    startDelay: 800,
  },
  column2_bottom: {
    id: 'dest-savandurga',
    country: 'Karnataka',
    landmark: 'Savandurga',
    badge: null,
    image: '/destinations/savandurga.jpg',
    images: [
      '/destinations/savandurga.jpg',
      '/destinations/savandurga-rock.jpg',
      '/destinations/savandurga-view.jpg',
    ],
    directionSequence: ['right', 'up', 'left', 'down'],
    startDelay: 1200,
  },
  column3: {
    id: 'dest-mysore',
    country: 'Karnataka',
    landmark: 'Mysore Palace',
    badge: 'POPULAR',
    featured: true,
    image: '/destinations/mysore-palace.jpg',
    images: [
      '/destinations/mysore-palace.jpg',
      '/destinations/mysore-palace-day.jpg',
      '/destinations/mysore-palace-dome.jpg',
    ],
    directionSequence: ['left', 'down', 'right', 'up'],
    startDelay: 1600,
    description: 'Experience the illuminated palace of the Wodeyars, Chamundi Hills, vibrant silk bazaars, and royal cultural legacy.',
  },
  column4_top: {
    id: 'dest-chikmagalur',
    country: 'Karnataka',
    landmark: 'Chikkamagaluru',
    badge: 'COFFEE TRAILS',
    image: '/destinations/chikmagalur-mullayanagiri.jpg',
    images: [
      '/destinations/chikmagalur-mullayanagiri.jpg',
      '/destinations/chikmagalur-coffee.jpg',
      '/destinations/chikmagalur-hills.jpg',
    ],
    directionSequence: ['down', 'left', 'up', 'right'],
    startDelay: 400,
  },
  column4_bottom: {
    id: 'dest-hogenakkal',
    country: 'Karnataka Border',
    landmark: 'Hogenakkal Falls',
    badge: null,
    image: '/destinations/hogenakkal-falls.jpg',
    images: [
      '/destinations/hogenakkal-falls.jpg',
      '/destinations/hogenakkal-coracle.jpg',
      '/destinations/hogenakkal-river.jpg',
    ],
    directionSequence: ['left', 'up', 'right', 'down'],
    startDelay: 2000,
  },
};

export const TopDestinations = ({ onSelectDestination }) => {
  const [destinationsData, setDestinationsData] = useState(DESTINATIONS_DATA);

  const fetchTopDestinations = useCallback(() => {
    api.getOutstationDestinations().then((items) => {
      if (Array.isArray(items) && items.length > 0) {
        const keys = ['column1', 'column2_top', 'column2_bottom', 'column3', 'column4_top', 'column4_bottom'];
        setDestinationsData((prev) => {
          const updated = { ...prev };
          items.slice(0, 6).forEach((item, idx) => {
            const key = keys[idx];
            if (key && updated[key]) {
              updated[key] = {
                ...updated[key],
                id: item.id || updated[key].id,
                landmark: item.name || updated[key].landmark,
                country: item.state || updated[key].country,
                badge: item.tag || item.badge || updated[key].badge,
                image: item.image || item.image_url || updated[key].image,
                images: (item.image || item.image_url) ? [item.image || item.image_url, ...(updated[key].images || [])] : updated[key].images,
                starting_price: item.starting_price,
              };
            }
          });
          return updated;
        });
      }
    }).catch(console.warn);
  }, []);

  useEffect(() => {
    fetchTopDestinations();
  }, [fetchTopDestinations]);

  useDataSync('outstation-destinations', fetchTopDestinations);

  const {
    column1,
    column2_top,
    column2_bottom,
    column3,
    column4_top,
    column4_bottom,
  } = destinationsData;

  return (
    <section id="top-destinations" className="destinations-section" aria-label="Top Karnataka Destinations from Bangalore">
      <div className="destinations-container">
        
        {/* Section Header */}
        <div className="destinations-header reveal-on-scroll">
          <span className="destinations-eyebrow">
            <Compass size={13} />
            <span>EXPLORE KARNATAKA</span>
          </span>
          <h2 className="destinations-title">TOP DESTINATIONS</h2>
          <p className="destinations-subtitle">
            Experience Karnataka’s finest hill stations, royal heritage palaces, waterfalls and nature retreats with private luxury chauffeur services.
          </p>
        </div>

        {/* Asymmetric 4-Column Magazine Grid */}
        <div className="destinations-grid reveal-scale">
          
          {/* Column 1: Tall Nandi Hills Card (Row 1 Big Card in Mobile) */}
          <div className="dest-column dest-col-big">
            <DestinationCard
              destination={column1}
              isTall={true}
              isFeatured={false}
              directionSequence={column1.directionSequence}
              startDelay={column1.startDelay}
              onSelect={onSelectDestination}
            />
          </div>

          {/* Column 2: Stacked Ramanagara & Savandurga (Row 2 Pair in Mobile) */}
          <div className="dest-column dest-col-pair">
            <DestinationCard
              destination={column2_top}
              isTall={false}
              isFeatured={false}
              directionSequence={column2_top.directionSequence}
              startDelay={column2_top.startDelay}
              onSelect={onSelectDestination}
            />
            <DestinationCard
              destination={column2_bottom}
              isTall={false}
              isFeatured={false}
              directionSequence={column2_bottom.directionSequence}
              startDelay={column2_bottom.startDelay}
              onSelect={onSelectDestination}
            />
          </div>

          {/* Column 3: Tall Featured Mysore Palace Card (Row 3 Trio Item 1 in Mobile) */}
          <div className="dest-column dest-col-trio-1">
            <DestinationCard
              destination={column3}
              isTall={true}
              isFeatured={true}
              directionSequence={column3.directionSequence}
              startDelay={column3.startDelay}
              onSelect={onSelectDestination}
            />
          </div>

          {/* Column 4: Stacked Chikkamagaluru & Hogenakkal (Row 3 Trio Items 2 & 3 in Mobile) */}
          <div className="dest-column dest-col-trio-2">
            <DestinationCard
              destination={column4_top}
              isTall={false}
              isFeatured={false}
              directionSequence={column4_top.directionSequence}
              startDelay={column4_top.startDelay}
              onSelect={onSelectDestination}
            />
            <DestinationCard
              destination={column4_bottom}
              isTall={false}
              isFeatured={false}
              directionSequence={column4_bottom.directionSequence}
              startDelay={column4_bottom.startDelay}
              onSelect={onSelectDestination}
            />
          </div>

        </div>

      </div>
    </section>
  );
};
