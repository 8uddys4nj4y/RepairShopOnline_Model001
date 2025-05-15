
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Service } from './ShopContext';

// Define types
export interface BookingSlot {
  id: string;
  date: string; // ISO format
  timeStart: string; // HH:MM format
  timeEnd: string; // HH:MM format
  serviceId: string;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  slotId: string;
  serviceId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  additionalNotes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string; // ISO format
}

interface BookingContextProps {
  slots: BookingSlot[];
  bookings: Booking[];
  createSlots: (date: string, startTime: string, endTime: string, interval: number, serviceId: string) => void;
  makeBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => string;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  getAvailableSlots: (date: string, serviceId: string) => BookingSlot[];
  getBookingBySlotId: (slotId: string) => Booking | undefined;
  cancelBooking: (bookingId: string) => void;
  getBookingDetails: (bookingId: string) => Booking | undefined;
}

// Create context
const BookingContext = createContext<BookingContextProps | undefined>(undefined);

// Generate some initial slots for the next 7 days
const generateInitialSlots = (): BookingSlot[] => {
  const slots: BookingSlot[] = [];
  const today = new Date();
  
  // For each day in the next 7 days
  for (let day = 0; day < 7; day++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + day);
    const dateString = currentDate.toISOString().split('T')[0];
    
    // Skip Sundays
    if (currentDate.getDay() === 0) continue;
    
    // Generate slots from 9 AM to 5 PM with 1-hour intervals
    for (let hour = 9; hour < 17; hour++) {
      const timeStart = `${hour.toString().padStart(2, '0')}:00`;
      const timeEnd = `${(hour + 1).toString().padStart(2, '0')}:00`;
      
      // Create slots for different services
      for (let serviceId = 1; serviceId <= 4; serviceId++) {
        slots.push({
          id: `${dateString}-${timeStart}-${serviceId}`,
          date: dateString,
          timeStart,
          timeEnd,
          serviceId: serviceId.toString(),
          isAvailable: Math.random() > 0.3, // 70% chance of being available
        });
      }
    }
  }
  
  return slots;
};

// Sample initial bookings
const initialBookings: Booking[] = [
  {
    id: '1',
    slotId: new Date().toISOString().split('T')[0] + '-10:00-1',
    serviceId: '1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '(555) 123-4567',
    vehicleMake: 'Toyota',
    vehicleModel: 'Camry',
    vehicleYear: '2018',
    additionalNotes: 'Check engine light is on',
    status: 'confirmed',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    slotId: new Date().toISOString().split('T')[0] + '-14:00-2',
    serviceId: '2',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '(555) 987-6543',
    vehicleMake: 'Honda',
    vehicleModel: 'Civic',
    vehicleYear: '2020',
    additionalNotes: 'Squeaking noise when braking',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

// Provider component
export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  useEffect(() => {
    // Load data from localStorage if available
    const savedSlots = localStorage.getItem('bookingSlots');
    const savedBookings = localStorage.getItem('bookings');
    
    if (savedSlots) {
      setSlots(JSON.parse(savedSlots));
    } else {
      const initialSlots = generateInitialSlots();
      setSlots(initialSlots);
    }
    
    if (savedBookings) {
      setBookings(JSON.parse(savedBookings));
    } else {
      setBookings(initialBookings);
    }
  }, []);
  
  // Save to localStorage when data changes
  useEffect(() => {
    localStorage.setItem('bookingSlots', JSON.stringify(slots));
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [slots, bookings]);
  
  // Create new booking slots
  const createSlots = (date: string, startTime: string, endTime: string, interval: number, serviceId: string) => {
    const newSlots: BookingSlot[] = [];
    
    // Convert time strings to minutes
    const startMinutes = parseInt(startTime.split(':')[0]) * 60 + parseInt(startTime.split(':')[1]);
    const endMinutes = parseInt(endTime.split(':')[0]) * 60 + parseInt(endTime.split(':')[1]);
    
    // Generate slots based on interval
    for (let time = startMinutes; time < endMinutes; time += interval) {
      const hour = Math.floor(time / 60);
      const minute = time % 60;
      const timeStart = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      const endTime = time + interval;
      const endHour = Math.floor(endTime / 60);
      const endMinute = endTime % 60;
      const timeEnd = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      
      const slotId = `${date}-${timeStart}-${serviceId}`;
      
      // Check if slot already exists
      const existingSlot = slots.find(slot => slot.id === slotId);
      if (!existingSlot) {
        newSlots.push({
          id: slotId,
          date,
          timeStart,
          timeEnd,
          serviceId,
          isAvailable: true
        });
      }
    }
    
    setSlots([...slots, ...newSlots]);
  };
  
  // Make a new booking
  const makeBooking = (bookingData: Omit<Booking, 'id' | 'createdAt'>): string => {
    // Check if slot is available
    const slot = slots.find(s => s.id === bookingData.slotId);
    if (!slot || !slot.isAvailable) {
      throw new Error('This slot is not available');
    }
    
    // Create new booking
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    
    // Update slot availability
    const updatedSlots = slots.map(s => 
      s.id === bookingData.slotId ? { ...s, isAvailable: false } : s
    );
    
    // Save changes
    setBookings([...bookings, newBooking]);
    setSlots(updatedSlots);
    
    return newBooking.id;
  };
  
  // Update booking status
  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status } : booking
    ));
  };
  
  // Get available slots for a specific date and service
  const getAvailableSlots = (date: string, serviceId: string): BookingSlot[] => {
    return slots.filter(slot => 
      slot.date === date && 
      slot.serviceId === serviceId && 
      slot.isAvailable
    );
  };
  
  // Get booking by slot ID
  const getBookingBySlotId = (slotId: string): Booking | undefined => {
    return bookings.find(booking => booking.slotId === slotId);
  };
  
  // Cancel booking
  const cancelBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;
    
    // Mark booking as cancelled
    updateBookingStatus(bookingId, 'cancelled');
    
    // Make slot available again
    setSlots(slots.map(slot => 
      slot.id === booking.slotId ? { ...slot, isAvailable: true } : slot
    ));
  };
  
  // Get booking details
  const getBookingDetails = (bookingId: string): Booking | undefined => {
    return bookings.find(booking => booking.id === bookingId);
  };
  
  return (
    <BookingContext.Provider value={{
      slots,
      bookings,
      createSlots,
      makeBooking,
      updateBookingStatus,
      getAvailableSlots,
      getBookingBySlotId,
      cancelBooking,
      getBookingDetails
    }}>
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
