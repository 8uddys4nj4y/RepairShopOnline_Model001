
import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { useBooking } from '../contexts/BookingContext';
import { useShopData } from '../contexts/ShopContext';

interface BookingCalendarProps {
  serviceId: string;
  onSelectDate: (date: Date | undefined) => void;
  selectedDate?: Date;
}

const BookingCalendar = ({ serviceId, onSelectDate, selectedDate }: BookingCalendarProps) => {
  const { getAvailableSlots } = useBooking();
  const { hours } = useShopData();
  const [availableDates, setAvailableDates] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    // Check available dates for the next 30 days
    const checkDates = () => {
      const dates: Record<string, boolean> = {};
      const today = new Date();
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dateString = date.toISOString().split('T')[0];
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ...
        
        // Check if shop is open on this day
        const dayInfo = hours[dayOfWeek === 0 ? 6 : dayOfWeek - 1]; // Adjust for array index
        
        if (dayInfo.isOpen) {
          // Check if there are available slots
          const slots = getAvailableSlots(dateString, serviceId);
          dates[dateString] = slots.length > 0;
        } else {
          dates[dateString] = false;
        }
      }
      
      setAvailableDates(dates);
    };
    
    checkDates();
  }, [serviceId, hours, getAvailableSlots]);
  
  // Function to disable dates in the calendar
  const disabledDays = (date: Date) => {
    // Disable dates in the past
    if (date < new Date(new Date().setHours(0, 0, 0, 0))) {
      return true;
    }
    
    const dateString = date.toISOString().split('T')[0];
    
    // Disable dates that have no available slots or when shop is closed
    return availableDates[dateString] === false;
  };
  
  return (
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={onSelectDate}
      disabled={disabledDays}
      className="rounded-md border shadow"
      initialFocus
    />
  );
};

export default BookingCalendar;
