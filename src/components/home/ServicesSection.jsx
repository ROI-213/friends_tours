import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plane, 
  Briefcase, 
  MapPin, 
  Compass, 
  Sparkles, 
  Users,
  Building2
} from 'lucide-react';
import { api } from '../../lib/api.js';
import { useDataSync } from '../../hooks/useDataSync';
import { ServiceFlipCard } from './ServiceFlipCard';
import '../../styles/services.css';

export const SERVICES_DATA = [
  {
    id: 'srv-employee',
    title: 'Employee Transportation',
    category: 'CORPORATE MOBILITY',
    badge: 'BANGALORE TECH PARKS',
    image: '/services/employee-transport.jpg',
    description: 'Safe, punctual scheduled employee pickups and drops for IT corridors, BPOs, and tech park corporate campuses with monthly GST billing and MIS reporting.',
    icon: Briefcase,
    featured: true,
    path: '/services/corporate-travel'
  },
  {
    id: 'srv-airport',
    title: 'Airport Transport',
    category: '24/7 AIRPORT RUNS',
    badge: 'KEMPEGOWDA AIRPORT (BLR)',
    image: '/services/airport.jpg',
    description: 'Prompt transfers between Kempegowda International Airport and Bangalore city with live flight delay tracking, zero waiting fees, and toll expressway management.',
    icon: Plane,
    featured: false,
    path: '/services/airport-transfer'
  },
  {
    id: 'srv-local-outstation',
    title: 'Local And Outstation Rentals',
    category: 'HOURLY & HIGHWAY CABS',
    badge: '4HR/8HR & 300KM/DAY',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    description: 'Transparent 4hr/40km and 8hr/80km local city packages, plus outstation trips (min 300 km/day) to Mysore, Coorg, Ooty, Chikmagalur and South India.',
    icon: Compass,
    featured: false,
    path: '/local-packages'
  },
  {
    id: 'srv-shuttle',
    title: 'Shuttle Services',
    category: 'POINT-TO-POINT TRANSIT',
    badge: 'GROUP & EVENT SHUTTLES',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
    description: 'Dedicated corporate shift shuttles, conference transport, wedding delegations, and 12–17 seater Tempo Traveller rentals with experienced drivers.',
    icon: Users,
    featured: false,
    path: '/rental-cars'
  },
  {
    id: 'srv-corporate',
    title: 'Corporate Transfer',
    category: 'BUSINESS MOBILITY',
    badge: 'GST INVOICE & RETAINERS',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    description: 'Executive sedan & luxury MPV mobility for corporate client visits, tech park delegations, business summits, and monthly dedicated travel retainers.',
    icon: Building2,
    featured: false,
    path: '/services/corporate-travel'
  },
];

export const ServicesSection = ({ onEnquireService, onViewDetails }) => {
  const [servicesList, setServicesList] = useState(SERVICES_DATA);
  const [flippedCardId, setFlippedCardId] = useState(null);

  const fetchServices = useCallback(() => {
    api.getServices().then((data) => {
      if (Array.isArray(data)) {
        const iconMap = {
          'srv-employee': Briefcase,
          'srv-airport': Plane,
          'srv-local-outstation': Compass,
          'srv-shuttle': Users,
          'srv-corporate': Building2,
        };
        const dynamic = data.map((s, idx) => ({
          id: s.id,
          title: s.title,
          category: (s.category || 'MOBILITY').toUpperCase(),
          badge: s.badge || '',
          image: s.image || s.image_url || '/services/employee-transport.jpg',
          description: s.short_desc || s.full_desc || '',
          icon: iconMap[s.id] || (idx === 0 ? Briefcase : idx === 1 ? Plane : idx === 2 ? Compass : Users),
          featured: s.sort_order === 1 || idx === 0,
          path: s.target_route || '/services/corporate-travel',
          features: Array.isArray(s.features) ? s.features : []
        }));
        setServicesList(dynamic);
      }
    }).catch((err) => {
      console.warn('Notice: Using default services data, API fallback active:', err.message);
    });
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useDataSync('services', fetchServices);

  const featuredService = servicesList.find((s) => s.featured) || servicesList[0];
  const standardServices = servicesList.filter((s) => s.id !== featuredService?.id);

  return (
    <section id="services" className="services-section" aria-label="Our Premier Services">
      <div className="services-container">
        
        {/* Section Header */}
        <div className="services-header reveal-on-scroll">
          <span className="services-eyebrow">
            <Sparkles size={13} />
            <span>TRAVEL &amp; MOBILITY SERVICES</span>
          </span>
          <h2 className="services-title">FRIENDS TOURS &amp; TRAVELS SERVICES</h2>
          <p className="services-subtitle">
            Bangalore's complete mobility partner for Employee Transportation, Airport Transport, Local &amp; Outstation Rentals, Shuttle Services, and Corporate Transfers. Click <strong>ENQUIRE →</strong> to open instant custom quotes.
          </p>
        </div>

        {/* Asymmetric Editorial Services Grid with 3D Flip Interaction */}
        <div className="services-grid">
          
          {/* Featured Service: Employee Transportation */}
          {featuredService && (
            <div className={`services-grid-item service-featured-grid-item reveal-scale stagger-1 ${flippedCardId === featuredService.id ? 'is-grid-item-flipped' : ''}`}>
              <ServiceFlipCard
                key={featuredService.id}
                service={featuredService}
                isFeatured={true}
                onViewDetails={onViewDetails}
                onFlipChange={(flipped) => setFlippedCardId(flipped ? featuredService.id : null)}
              />
            </div>
          )}

          {/* Standard Service Cards (Airport Transport, Local/Outstation, Shuttle, Corporate Transfer) */}
          {standardServices.map((service, sIdx) => (
            <div 
              key={service.id} 
              className={`services-grid-item service-standard-grid-item reveal-on-scroll stagger-${(sIdx % 4) + 2} ${flippedCardId === service.id ? 'is-grid-item-flipped' : ''}`}
            >
              <ServiceFlipCard
                service={service}
                isFeatured={false}
                onViewDetails={onViewDetails}
                onFlipChange={(flipped) => setFlippedCardId(flipped ? service.id : null)}
              />
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};
