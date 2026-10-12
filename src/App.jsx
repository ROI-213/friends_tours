import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/home/Hero';
import { SecondHero } from './components/home/SecondHero';
import { TopDestinations } from './components/home/TopDestinations';
import { AboutSection } from './components/home/AboutSection';
import { ServicesSection } from './components/home/ServicesSection';
import { FleetSection } from './components/home/FleetSection';
import { OfficialTariffSection } from './components/home/OfficialTariffSection';
import { PopularPackages } from './components/home/PopularPackages';
import { OutstationDestinations } from './components/home/OutstationDestinations';
import { OurResponsibilities } from './components/home/OurResponsibilities';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { CorporateClientsSection } from './components/home/CorporateClientsSection';
import { TestimonialsSection } from './components/home/TestimonialsSection';
import { TravelGallery } from './components/home/TravelGallery';
import { ContactSection } from './components/home/ContactSection';
import { FinalCTA } from './components/home/FinalCTA';
import { Footer } from './components/layout/Footer';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Modal } from './components/ui/Modal';
import { TariffTableModal } from './components/ui/TariffTableModal';
import { Button } from './components/ui/Button';
import { ToastProvider, useToast } from './context/ToastContext';
import { SiteSettingsProvider, useSiteSettings } from './context/SiteSettingsContext';
import { BRAND } from './constants/branding';
import { redirectToWhatsAppEnquiry } from './lib/whatsapp';

// Dedicated Page Components
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { AirportTransferPage } from './pages/AirportTransferPage';
import { CorporateTravelPage } from './pages/CorporateTravelPage';
import { LocalPackagesPage } from './pages/LocalPackagesPage';
import { OutstationPage } from './pages/OutstationPage';
import { RentalCarsPage } from './pages/RentalCarsPage';
import { VehicleDetailPage } from './pages/VehicleDetailPage';
import { PackageDetailPage } from './pages/PackageDetailPage';
import { GalleryPage } from './pages/GalleryPage';
import { TestimonialsPage } from './pages/TestimonialsPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import AdminPanel from './pages/AdminPanel';

import { CheckCircle2, Sparkles, Phone, MessageCircle } from 'lucide-react';
import { useScrollAnimations } from './hooks/useScrollAnimations';
import { api } from './lib/api.js';

function MainApp() {
  const { addToast } = useToast();
  const { getSetting } = useSiteSettings();
  const phone = getSetting('phone', BRAND.phoneRaw);
  const whatsapp = getSetting('whatsapp', BRAND.whatsappRaw);
  const cleanPhone = phone.includes('/') ? phone.split('/')[0].replace(/[^\d+]/g, '') : phone.replace(/[^\d+]/g, '');
  const cleanWhatsapp = whatsapp.replace(/[^\d]/g, '');

  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isTariffModalOpen, setIsTariffModalOpen] = useState(false);
  const [tariffDefaultTab, setTariffDefaultTab] = useState('local');
  const [selectedItem, setSelectedItem] = useState(null);
  const [legalModalContent, setLegalModalContent] = useState(null);
  const [homepagePrefilledBooking, setHomepagePrefilledBooking] = useState(null);

  // Initialize global cinematic scroll animations
  useScrollAnimations(currentPath);

  // Global live database synchronization across all browser sessions and devices
  useEffect(() => {
    const unsubscribe = api.subscribeToSync((event) => {
      window.dispatchEvent(new CustomEvent('ft:data-change', { detail: event }));
    });
    return unsubscribe;
  }, []);

  // Sync state with browser URL (popstate listener)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (rawPath) => {
    let cleanPath = rawPath || '/';
    if (cleanPath === 'home') cleanPath = '/';
    if (!cleanPath.startsWith('/')) cleanPath = '/' + cleanPath;
    cleanPath = cleanPath.replace(/\/+/g, '/');
    window.history.pushState({}, '', cleanPath);
    setCurrentPath(cleanPath.split('?')[0]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dedicated Route Matchers
  const packageMatch = currentPath.match(/^\/packages\/([a-zA-Z0-9_-]+)/);
  const activePackageSlug = packageMatch ? packageMatch[1] : null;

  const vehicleMatch = currentPath.match(/^\/rental-cars\/([a-zA-Z0-9_-]+)/);
  const activeVehicleSlug = vehicleMatch ? vehicleMatch[1] : null;

  const handleBookNow = () => {
    navigateTo('/contact?intent=booking');
    addToast({
      message: 'Opening journey reservation concierge...',
      type: 'info',
    });
  };

  const handleOpenTariff = (tab = 'local') => {
    setTariffDefaultTab(tab);
    setIsTariffModalOpen(true);
  };

  const handleSelectDestination = (dest) => {
    navigateTo('/outstation');
    addToast({
      message: `Selected Destination: ${dest.landmark || dest.country}`,
      type: 'info',
    });
  };

  const handleEnquireService = (service) => {
    if (service.id === 'srv-employee' || service.id === 'srv-corporate') {
      navigateTo('/services/corporate-travel');
    } else if (service.id === 'srv-airport') {
      navigateTo('/services/airport-transfer');
    } else if (service.id === 'srv-local-outstation' || service.id === 'srv-local') {
      navigateTo('/local-packages');
    } else if (service.id === 'srv-shuttle') {
      navigateTo('/rental-cars');
    } else {
      navigateTo('/outstation');
    }
  };

  const handleViewServiceDetails = (service) => {
    handleEnquireService(service);
  };

  const handleEnquireVehicle = (vehicle) => {
    const pkgText = vehicle.package8hr80km 
      ? `Local 8hr/80km: ₹${vehicle.package8hr80km.toLocaleString('en-IN')}` 
      : 'Custom Tariff';
      
    const extraRates = vehicle.extraKm 
      ? ` | Extra KM: ₹${vehicle.extraKm}/km | Extra Hr: ₹${vehicle.extraHour}/hr` 
      : '';

    setHomepagePrefilledBooking({
      tripType: 'Local Rental',
      travelType: 'Local Rental',
      vehiclePreference: vehicle.name,
      localPackage: '8 hrs / 80 km',
      passengers: vehicle.passengerCount || 4,
      pickupLocation: 'J.P. Nagar, Bangalore',
      destination: 'Bangalore Local Sightseeing & City Travel',
      message: `Enquiry for booking ${vehicle.name} (${vehicle.category} • ${vehicle.passengerCapacity} • ${vehicle.airConditioning}). Tariff: ${pkgText}${extraRates}.`
    });

    addToast({
      message: `Enquiring for ${vehicle.name} (${vehicle.category})`,
      type: 'info',
    });

    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
      const nameInput = contactEl.querySelector('#enquiry-name') || contactEl.querySelector('input');
      if (nameInput) setTimeout(() => nameInput.focus(), 600);
    } else {
      navigateTo('/contact');
    }
  };

  const handleViewVehicleDetails = (vehicle) => {
    if (vehicle.slug) {
      navigateTo(`/rental-cars/${vehicle.slug}`);
    } else {
      navigateTo('/rental-cars');
    }
  };

  const handlePlanJourney = () => {
    navigateTo('/contact?intent=booking');
  };

  const handleTalkToUs = () => {
    window.open(`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent('Hi Friends Tours & Travels, I would like to speak with your travel team.')}`, '_blank');
  };

  const handleExploreAbout = () => {
    navigateTo('/about');
  };

  const handleExploreServices = () => {
    navigateTo('/services');
  };

  const handleLegalClick = (type) => {
    if (type === 'privacy') {
      setLegalModalContent({
        title: 'Privacy Policy',
        text: 'At Friends Tours & Travels Bangalore (#18, 24th Main, 5th Phase, J.P. Nagar), we are committed to safeguarding your privacy. Your personal information, travel itineraries, and contact details are treated with strict confidentiality. We never sell or share your data with third parties.',
      });
    } else {
      setLegalModalContent({
        title: 'Terms & Conditions',
        text: 'All car rentals and bookings with Friends Tours & Travels Bangalore are subject to our official 2026 tariff card. Rates effective 01 Jan 2026. For Local rentals, exceeding 6 hours is billed as full day (8 hours). Outstation requires minimum 300 KM/day. Tolls, state permits, and parking are payable at actual receipts.',
      });
    }
  };

  const handleNewsletterSubmit = (email, message) => {
    if (email) {
      addToast({ message, type: 'success' });
    } else {
      addToast({ message, type: 'error' });
    }
  };

  const handleOpenBookingConciergeContext = (enquiryDetails) => {
    setSelectedItem(enquiryDetails);
    setIsBookingModalOpen(true);
    addToast({
      message: `Checking availability for ${enquiryDetails.title}...`,
      type: 'info',
    });
  };

  // =========================================================================
  // DEDICATED ROUTE DISPATCHER
  // =========================================================================

  // 1. /about
  if (currentPath === '/about') {
    return (
      <AboutPage
        onNavigate={navigateTo}
        onBookNowClick={handleBookNow}
      />
    );
  }

  // 2. /services
  if (currentPath === '/services') {
    return (
      <ServicesPage
        onNavigate={navigateTo}
        onBookNowClick={handleBookNow}
        onOpenTariffModal={handleOpenTariff}
      />
    );
  }

  // 3. /services/airport-transfer
  if (currentPath === '/services/airport-transfer') {
    return (
      <AirportTransferPage
        onNavigate={navigateTo}
        onBookNowClick={handleBookNow}
        onOpenBookingModal={handleOpenBookingConciergeContext}
      />
    );
  }

  // 4. /services/corporate-travel
  if (currentPath === '/services/corporate-travel') {
    return (
      <CorporateTravelPage
        onNavigate={navigateTo}
        onBookNowClick={handleBookNow}
        onOpenBookingModal={handleOpenBookingConciergeContext}
      />
    );
  }

  // 5. /local-packages & /services/local-packages & /packages
  if (currentPath === '/local-packages' || currentPath === '/services/local-packages' || currentPath === '/packages') {
    return (
      <LocalPackagesPage
        onNavigate={navigateTo}
        onBookNowClick={handleBookNow}
        onSelectPackage={(pkg) => navigateTo(`/packages/${pkg.slug}`)}
        onOpenBookingModal={handleOpenBookingConciergeContext}
      />
    );
  }

  // 6. /outstation & /services/outstation-travel
  if (currentPath === '/outstation' || currentPath === '/services/outstation-travel') {
    return (
      <OutstationPage
        onNavigate={navigateTo}
        onBookNowClick={handleBookNow}
        onEnquireRoute={() => navigateTo('/outstation')}
        onOpenBookingModal={handleOpenBookingConciergeContext}
      />
    );
  }

  // 7. /rental-cars
  if (currentPath === '/rental-cars' || currentPath === '/rental-cars/') {
    return (
      <RentalCarsPage
        onSelectVehicle={(vehicle) => navigateTo(`/rental-cars/${vehicle.slug}`)}
        onEnquireVehicle={handleEnquireVehicle}
        onNavClick={navigateTo}
        onBookNowClick={handleBookNow}
      />
    );
  }

  // 8. /rental-cars/:slug
  if (activeVehicleSlug) {
    return (
      <VehicleDetailPage
        slug={activeVehicleSlug}
        onBackToFleet={() => navigateTo('/rental-cars')}
        onOpenBookingConcierge={handleOpenBookingConciergeContext}
        onSelectAnotherVehicle={(slug) => navigateTo(`/rental-cars/${slug}`)}
        onNavigate={navigateTo}
        onBookNowClick={handleBookNow}
      />
    );
  }

  // 9. /packages/:slug
  if (activePackageSlug) {
    return (
      <PackageDetailPage
        slug={activePackageSlug}
        onBackToHome={() => navigateTo('/local-packages')}
        onOpenBookingConcierge={handleOpenBookingConciergeContext}
        onSelectAnotherPackage={(slug) => navigateTo(`/packages/${slug}`)}
        onNavigate={navigateTo}
        onBookNowClick={handleBookNow}
      />
    );
  }

  // 10. /gallery
  if (currentPath === '/gallery') {
    return (
      <GalleryPage
        onNavigate={navigateTo}
        onBookNowClick={handleBookNow}
      />
    );
  }

  // 11. /testimonials
  if (currentPath === '/testimonials') {
    return (
      <TestimonialsPage
        onNavigate={navigateTo}
        onBookNowClick={handleBookNow}
      />
    );
  }

  // 12. /contact
  if (currentPath === '/contact') {
    return (
      <ContactPage
        onNavigate={navigateTo}
        onBookNowClick={handleBookNow}
        onSubmitSuccess={(data) => {
          addToast({
            message: `Enquiry sent for ${data.travelType}! We will call you shortly at ${data.phone}.`,
            type: 'success',
          });
        }}
      />
    );
  }

  // 13-A. /admin - Admin Panel (full-page, no navbar/footer)
  const cleanLowerPath = (currentPath || '').toLowerCase().split('?')[0].replace(/\/+$/, '') || '/';
  if (cleanLowerPath === '/admin' || (currentPath || '').toLowerCase().startsWith('/admin')) {
    return <AdminPanel />;
  }

  // 13. Homepage (/)
  if (currentPath === '/' || currentPath === '') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
        
        {/* 1. HEADER */}
        <Navbar
          activeSection="home"
          onNavClick={navigateTo}
          onBookNowClick={handleBookNow}
          onOpenTariffModal={handleOpenTariff}
        />

        {/* Main Content Flow */}
        <main id="main-content" style={{ flex: 1 }}>
          
          {/* 2. HERO */}
          <Hero
            onBookClick={handleBookNow}
            onExploreServicesClick={handleExploreServices}
          />

          {/* 3. OUR SERVICES (Employee Transportation, Airport, Local/Outstation, Shuttle, Corporate Transfer) */}
          <ServicesSection
            onEnquireService={handleEnquireService}
            onViewDetails={handleViewServiceDetails}
          />

          {/* 4. BANGALORE RENTAL CARS & SHUTTLES (Moved before Tariff Card) */}
          <FleetSection
            onEnquireVehicle={handleEnquireVehicle}
            onViewVehicleDetails={handleViewVehicleDetails}
            onOpenTariffModal={handleOpenTariff}
          />

          {/* 5. OFFICIAL TARIFF CARD */}
          <OfficialTariffSection
            onBookVehicle={(data) => {
              handleOpenBookingConciergeContext(data);
            }}
          />

          {/* 6. ABOUT FRIENDS TOURS & TRAVELS */}
          <AboutSection onExploreClick={handleExploreAbout} />

          {/* 7. TOP DESTINATIONS */}
          <TopDestinations onSelectDestination={handleSelectDestination} />

          {/* 8. OUR RESPONSIBILITIES (Moved right below TOP DESTINATIONS) */}
          <OurResponsibilities />

          {/* 9. POPULAR OUTSTATION DESTINATIONS */}
          <OutstationDestinations
            onExploreDestination={() => navigateTo('/outstation')}
            onEnquireDestination={() => navigateTo('/outstation')}
          />

          {/* 10. WHY CHOOSE US */}
          <WhyChooseUs
            onPlanJourney={handlePlanJourney}
            onTalkToUs={handleTalkToUs}
          />

          {/* 11. CORPORATE CLIENTS & PARTNERS */}
          <CorporateClientsSection onContactClick={handleBookNow} />

          {/* 12. TESTIMONIALS */}
          <TestimonialsSection />

          {/* 12. CONTACT / ENQUIRY */}
          <ContactSection
            prefilledData={homepagePrefilledBooking}
            onSubmitSuccess={(data) => {
              addToast({
                message: `Enquiry sent for ${data.destination}! We will call you shortly.`,
                type: 'success',
              });
            }}
          />

          {/* 13. FINAL CTA */}
          <FinalCTA
            onBookJourney={handleBookNow}
            onTalkToTeam={handleTalkToUs}
          />

        </main>

        {/* 14. FOOTER */}
        <Footer
          onNavClick={navigateTo}
          onBookClick={handleBookNow}
          onLegalClick={handleLegalClick}
          onNewsletterSubmit={handleNewsletterSubmit}
          onOpenTariffModal={handleOpenTariff}
        />

        {/* Official Tariff Modal */}
        <TariffTableModal
          isOpen={isTariffModalOpen}
          onClose={() => setIsTariffModalOpen(false)}
          defaultTab={tariffDefaultTab}
        />

        {/* Global Concierge Modal */}
        <Modal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          title={selectedItem ? `Reserve: ${selectedItem.title}` : 'Book Your Journey'}
          subtitle={`${BRAND.name} • ${BRAND.locality}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {selectedItem && (
              <div style={{
                display: 'flex',
                gap: 14,
                padding: 12,
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-pink-soft)',
                border: '1px solid var(--color-border-subtle)',
                alignItems: 'center'
              }}>
                {selectedItem.image && (
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.title}
                    style={{ width: 70, height: 70, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }}
                  />
                )}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {selectedItem.badge && (
                      <span className="badge badge-magenta" style={{ fontSize: '0.6875rem' }}>{selectedItem.badge}</span>
                    )}
                    {selectedItem.price && (
                      <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-primary)' }}>Starting {selectedItem.price}</span>
                    )}
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '4px 0 2px' }}>{selectedItem.title}</h4>
                  <p className="body-xs" style={{ color: 'var(--color-text-muted)' }}>{selectedItem.description}</p>
                </div>
              </div>
            )}

            <p className="body-main" style={{ fontSize: '0.9375rem' }}>
              Connect directly with our 24/7 travel desk at J.P. Nagar, Bangalore:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <a
                href={`tel:${cleanPhone}`}
                className="btn btn-secondary"
                style={{ textDecoration: 'none', justifyContent: 'center' }}
              >
                <Phone size={16} />
                <span>Call {phone}</span>
              </a>

              <a
                href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(selectedItem ? `Hi Friends Tours, I am interested in reserving ${selectedItem.title}.` : 'Hi Friends Tours, I would like to book a journey.')}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-whatsapp"
                style={{ textDecoration: 'none', justifyContent: 'center' }}
              >
                <MessageCircle size={16} />
                <span>WhatsApp</span>
              </a>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
              <Button variant="secondary" onClick={() => setIsBookingModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                icon={Sparkles}
                onClick={() => {
                  setIsBookingModalOpen(false);
                  addToast({ message: 'Redirecting to WhatsApp (82773 93089)...', type: 'success' });
                  redirectToWhatsAppEnquiry({
                    name: 'Guest',
                    tripType: selectedItem?.travelType || selectedItem?.type || 'Cab Booking',
                    vehiclePreference: selectedItem?.vehiclePreference || selectedItem?.title,
                    packageName: selectedItem?.title,
                    specialRequests: selectedItem?.description || selectedItem?.title,
                  });
                }}
              >
                Confirm &amp; Send to WhatsApp
              </Button>
            </div>
          </div>
        </Modal>

        {/* Legal Modal */}
        <Modal
          isOpen={Boolean(legalModalContent)}
          onClose={() => setLegalModalContent(null)}
          title={legalModalContent?.title || ''}
          subtitle={`${BRAND.name} Official Policy`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p className="body-main" style={{ lineHeight: 1.7 }}>
              {legalModalContent?.text}
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
              <Button variant="primary" onClick={() => setLegalModalContent(null)}>
                Understood
              </Button>
            </div>
          </div>
        </Modal>

      </div>
    );
  }

  // 14. 404 Catch-All Page
  return (
    <NotFoundPage
      onNavigate={navigateTo}
      onBookNowClick={handleBookNow}
    />
  );
}

export default function App() {
  return (
    <ToastProvider>
      <SiteSettingsProvider>
        <MainApp />
      </SiteSettingsProvider>
    </ToastProvider>
  );
}
