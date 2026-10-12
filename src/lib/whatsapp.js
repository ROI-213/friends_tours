import { BRAND } from '../constants/branding';

export const WHATSAPP_ENQUIRY_NUMBER = '918277393089';

/**
 * Builds a clean, professional WhatsApp reservation message
 * with all customer details and booking parameters.
 */
export function buildEnquiryWhatsAppMessage(data = {}, bookingRef = '') {
  const parts = [];

  parts.push(`*NEW BOOKING ENQUIRY - FRIENDS TOURS & TRAVELS*`);
  if (bookingRef) {
    parts.push(`*Booking Ref:* #${bookingRef}`);
  }
  parts.push('');

  // Customer Contact
  const name = data.name || data.customerName || 'Customer';
  const phone = data.phone || data.mobile || 'Not specified';
  parts.push(`👤 *Customer:* ${name}`);
  parts.push(`📞 *Phone:* ${phone}`);
  if (data.email) {
    parts.push(`📧 *Email:* ${data.email}`);
  }
  parts.push('');

  // Journey Details
  const tripType = data.trip_type || data.tripType || 'Cab Booking';
  parts.push(`🚗 *Trip Type:* ${tripType}`);

  if (data.vehicle_preference || data.vehiclePreference) {
    parts.push(`🚘 *Vehicle:* ${data.vehicle_preference || data.vehiclePreference}`);
  }
  if (data.passengers) {
    parts.push(`👥 *Passengers:* ${data.passengers}`);
  }
  if (data.package_name || data.localPackage || data.packageName) {
    parts.push(`📦 *Package:* ${data.package_name || data.localPackage || data.packageName}`);
  }
  if (data.airportDirection) {
    parts.push(`✈️ *Direction:* ${data.airportDirection === 'toAirport' ? 'To BLR Airport (Drop)' : 'From BLR Airport (Pickup)'}`);
  }
  if (data.airportTerminal) {
    parts.push(`🏢 *Airport Terminal:* ${data.airportTerminal}`);
  }
  if (data.flightNumber) {
    parts.push(`🛫 *Flight No:* ${data.flightNumber}`);
  }

  parts.push('');
  // Route & Timings
  const pickup = data.pickup_location || data.pickupLocation || 'Bangalore';
  const destination = data.drop_location || data.destination || data.dropLocation || 'City Tour / Outstation';
  parts.push(`📍 *Pickup Location:* ${pickup}`);
  parts.push(`🏁 *Destination:* ${destination}`);

  if (data.travel_date || data.travelDate) {
    parts.push(`📅 *Travel Date:* ${data.travel_date || data.travelDate}`);
  }
  if (data.travelTime) {
    parts.push(`⏰ *Pickup Time:* ${data.travelTime}`);
  }
  if (data.return_date || data.returnDate) {
    const retTime = data.returnTime ? ` at ${data.returnTime}` : '';
    parts.push(`🔄 *Return Date:* ${data.return_date || data.returnDate}${retTime}`);
  }

  // Notes
  if (data.special_requests || data.specialRequests) {
    parts.push('');
    parts.push(`📋 *Route Specs:* ${data.special_requests || data.specialRequests}`);
  }
  if (data.message) {
    parts.push('');
    parts.push(`💬 *Customer Notes:* ${data.message}`);
  }

  return parts.join('\n');
}

/**
 * Returns the full wa.me direct URL for the official enquiry number (82773 93089).
 */
export function getWhatsAppEnquiryUrl(data = {}, bookingRef = '') {
  const message = buildEnquiryWhatsAppMessage(data, bookingRef);
  return `https://wa.me/${WHATSAPP_ENQUIRY_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Redirects the user to WhatsApp (82773 93089) with full enquiry details pre-filled.
 */
export function redirectToWhatsAppEnquiry(data = {}, bookingRef = '') {
  const url = getWhatsAppEnquiryUrl(data, bookingRef);
  
  try {
    const win = window.open(url, '_blank');
    if (!win || win.closed || typeof win.closed === 'undefined') {
      window.location.href = url;
    }
  } catch (e) {
    window.location.href = url;
  }

  return url;
}
