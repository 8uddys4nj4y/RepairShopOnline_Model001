
import { useState, useEffect } from 'react';
import { useBooking } from '../contexts/BookingContext';
import { cn } from '@/lib/utils';

interface TimeSlotsProps {
  date: Date | undefined;
  serviceId: string;
  onSelectSlot: (slotId: string | null) => void;
  selectedSlotId: string | null;
}

const TimeSlots = ({ date, serviceId, onSelectSlot, selectedSlotId }: TimeSlotsProps) => {
  const { getAvailableSlots } = useBooking();
  const [slots, setSlots] = useState<Array<{ id: string, timeStart: string }>>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }
    
    setLoading(true);
    
    // Format date as YYYY-MM-DD
    const dateString = date.toISOString().split('T')[0];
    
    // Get available slots for this date and service
    const availableSlots = getAvailableSlots(dateString, serviceId);
    
    // Sort slots by time
    const sortedSlots = availableSlots
      .map(slot => ({
        id: slot.id,
        timeStart: slot.timeStart
      }))
      .sort((a, b) => {
        return a.timeStart.localeCompare(b.timeStart);
      });
    
    setSlots(sortedSlots);
    setLoading(false);
  }, [date, serviceId, getAvailableSlots]);
  
  // Format time for display (convert 24h to 12h format)
  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };
  
  if (!date) {
    return (
      <div className="text-center py-8 text-gray-500">
        Please select a date first to view available time slots.
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">
        Loading available time slots...
      </div>
    );
  }
  
  if (slots.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No available time slots for the selected date. Please select another date.
      </div>
    );
  }
  
  return (
    <div className="py-2">
      <h3 className="font-medium mb-4">Select a Time:</h3>
      <div className="grid grid-cols-3 gap-3">
        {slots.map((slot) => (
          <button
            key={slot.id}
            onClick={() => onSelectSlot(slot.id)}
            className={cn(
              "booking-slot py-2 px-3 rounded-lg border transition-all flex items-center justify-center",
              selectedSlotId === slot.id
                ? "border-garage-blue bg-blue-50 text-garage-blue font-medium shadow-sm"
                : "border-gray-200 hover:border-garage-blue"
            )}
          >
            {formatTime(slot.timeStart)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlots;
