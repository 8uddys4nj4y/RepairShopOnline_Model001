
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useBooking } from '../contexts/BookingContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

interface BookingFormProps {
  slotId: string | null;
  serviceId: string;
}

const bookingSchema = z.object({
  customerName: z.string().min(2, {
    message: 'Name must be at least 2 characters',
  }),
  customerEmail: z.string().email({
    message: 'Please enter a valid email address',
  }),
  customerPhone: z.string().min(7, {
    message: 'Phone number must be at least 7 digits',
  }),
  vehicleMake: z.string().min(1, {
    message: 'Vehicle make is required',
  }),
  vehicleModel: z.string().min(1, {
    message: 'Vehicle model is required',
  }),
  vehicleYear: z.string()
    .regex(/^\d{4}$/, {
      message: 'Please enter a valid year (4 digits)',
    }),
  additionalNotes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const BookingForm = ({ slotId, serviceId }: BookingFormProps) => {
  const { makeBooking } = useBooking();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: '',
      additionalNotes: '',
    },
  });
  
  const onSubmit = async (data: BookingFormValues) => {
    if (!slotId) {
      toast({
        title: 'Error',
        description: 'Please select a date and time slot first',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const bookingData = {
        slotId,
        serviceId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        vehicleMake: data.vehicleMake,
        vehicleModel: data.vehicleModel,
        vehicleYear: data.vehicleYear,
        additionalNotes: data.additionalNotes,
        status: 'pending' as const,
      };
      
      const bookingId = makeBooking(bookingData);
      
      toast({
        title: 'Booking successful!',
        description: 'Your appointment has been booked. We will confirm shortly.',
      });
      
      // Redirect to thank you page or home
      setTimeout(() => {
        navigate('/', { state: { bookingSuccess: true } });
      }, 1500);
    } catch (error) {
      console.error('Error making booking:', error);
      toast({
        title: 'Booking failed',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Customer Information</h3>
            
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customerPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Vehicle Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Vehicle Information</h3>
            
            <FormField
              control={form.control}
              name="vehicleMake"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make</FormLabel>
                  <FormControl>
                    <Input placeholder="Toyota" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="vehicleModel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="Camry" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="vehicleYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input placeholder="2020" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Additional Notes */}
        <FormField
          control={form.control}
          name="additionalNotes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please provide any additional information about your service needs..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button
          type="submit"
          className="w-full bg-garage-blue hover:bg-garage-darkBlue"
          disabled={!slotId || isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Confirm Booking'}
        </Button>
      </form>
    </Form>
  );
};

export default BookingForm;
