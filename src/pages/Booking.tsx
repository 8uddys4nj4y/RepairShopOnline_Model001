
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { useShopData } from '../contexts/ShopContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import BookingCalendar from '../components/BookingCalendar';
import TimeSlots from '../components/TimeSlots';
import BookingForm from '../components/BookingForm';
import ServiceCard from '../components/ServiceCard';

const Booking = () => {
  const { services } = useShopData();
  const [searchParams] = useSearchParams();
  const initialServiceId = searchParams.get('service') || '';
  
  const [selectedServiceId, setSelectedServiceId] = useState<string>(initialServiceId);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  
  // Reset slot when service or date changes
  useEffect(() => {
    setSelectedSlotId(null);
  }, [selectedServiceId, selectedDate]);
  
  const selectedService = services.find(s => s.id === selectedServiceId);
  
  return (
    <Layout>
      {/* Header */}
      <section className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-3xl font-bold mb-4">Book Your Appointment</h1>
            <p className="text-lg">Schedule an appointment in just a few simple steps</p>
          </div>
        </div>
      </section>
      
      {/* Booking Process */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="service" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="service">1. Select Service</TabsTrigger>
                <TabsTrigger value="datetime" disabled={!selectedServiceId}>2. Date & Time</TabsTrigger>
                <TabsTrigger value="details" disabled={!selectedSlotId}>3. Your Details</TabsTrigger>
              </TabsList>
              
              {/* Step 1: Select Service */}
              <TabsContent value="service">
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Select a Service</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map(service => (
                      <div
                        key={service.id}
                        onClick={() => setSelectedServiceId(service.id)}
                        className={`cursor-pointer transition-all ${
                          selectedServiceId === service.id ? 'ring-2 ring-garage-blue ring-offset-2' : ''
                        }`}
                      >
                        <ServiceCard service={service} showBookButton={false} />
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>
              
              {/* Step 2: Select Date & Time */}
              <TabsContent value="datetime">
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Select Date & Time</h2>
                  
                  {selectedService && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h3 className="font-medium mb-1">Selected Service: {selectedService.name}</h3>
                      <p className="text-sm text-gray-600">Duration: {selectedService.duration} minutes | Price: ${selectedService.price.toFixed(2)}</p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Calendar */}
                    <div>
                      <h3 className="font-medium mb-4">Select a Date:</h3>
                      <BookingCalendar
                        serviceId={selectedServiceId}
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                      />
                    </div>
                    
                    {/* Time Slots */}
                    <div>
                      <TimeSlots
                        date={selectedDate}
                        serviceId={selectedServiceId}
                        selectedSlotId={selectedSlotId}
                        onSelectSlot={setSelectedSlotId}
                      />
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              {/* Step 3: Enter Details */}
              <TabsContent value="details">
                <Card className="p-6">
                  <h2 className="text-2xl font-semibold mb-6">Enter Your Details</h2>
                  
                  {selectedService && selectedDate && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                      <h3 className="font-medium mb-2">Booking Summary</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <p><span className="font-medium">Service:</span> {selectedService.name}</p>
                        <p><span className="font-medium">Price:</span> ${selectedService.price.toFixed(2)}</p>
                        <p><span className="font-medium">Date:</span> {selectedDate.toLocaleDateString()}</p>
                        <p><span className="font-medium">Duration:</span> {selectedService.duration} minutes</p>
                      </div>
                    </div>
                  )}
                  
                  <BookingForm 
                    slotId={selectedSlotId} 
                    serviceId={selectedServiceId}
                  />
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Booking;
