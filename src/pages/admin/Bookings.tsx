
import { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useBooking } from '../../contexts/BookingContext';
import { useShopData } from '../../contexts/ShopContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Bookings = () => {
  const { bookings, updateBookingStatus, cancelBooking } = useBooking();
  const { services } = useShopData();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  
  // Filter bookings based on search and status
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customerName.toLowerCase().includes(search.toLowerCase()) ||
      booking.vehicleMake.toLowerCase().includes(search.toLowerCase()) ||
      booking.vehicleModel.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = filter === 'all' || booking.status === filter;
    
    return matchesSearch && matchesFilter;
  });
  
  // Sort bookings by date (newest first)
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  
  const handleStatusChange = (bookingId: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    updateBookingStatus(bookingId, status);
    
    toast({
      title: 'Status Updated',
      description: `Booking status changed to ${status}`,
    });
  };
  
  const handleCancelBooking = (bookingId: string) => {
    cancelBooking(bookingId);
    
    toast({
      title: 'Booking Cancelled',
      description: 'The booking has been cancelled and the slot is now available',
    });
  };
  
  // Find booking details
  const bookingDetails = selectedBooking ? bookings.find(b => b.id === selectedBooking) : null;
  const bookingService = bookingDetails ? services.find(s => s.id === bookingDetails.serviceId) : null;
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Booking Management</h1>
          <p className="text-gray-500">View and manage all customer bookings</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search by customer or vehicle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs"
          />
          
          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as typeof filter)}
          >
            <SelectTrigger className="sm:max-w-xs">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Bookings</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings ({sortedBookings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {sortedBookings.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Customer</th>
                      <th className="text-left p-2">Service</th>
                      <th className="text-left p-2">Date/Time</th>
                      <th className="text-left p-2">Vehicle</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedBookings.map(booking => {
                      // Extract date and time from slot ID
                      const [date, time] = booking.slotId.split('-');
                      // Format date
                      const formattedDate = new Date(date).toLocaleDateString();
                      // Find service name
                      const service = services.find(s => s.id === booking.serviceId);
                      
                      return (
                        <tr key={booking.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <div className="font-medium">{booking.customerName}</div>
                            <div className="text-xs text-gray-500">{booking.customerPhone}</div>
                          </td>
                          <td className="p-2">{service?.name || 'Unknown Service'}</td>
                          <td className="p-2">
                            <div>{formattedDate}</div>
                            <div className="text-xs text-gray-500">{time}</div>
                          </td>
                          <td className="p-2">{`${booking.vehicleYear} ${booking.vehicleMake} ${booking.vehicleModel}`}</td>
                          <td className="p-2">
                            <span 
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                booking.status === 'pending' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : booking.status === 'confirmed' 
                                    ? 'bg-green-100 text-green-800'
                                    : booking.status === 'cancelled'
                                      ? 'bg-red-100 text-red-800'
                                      : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-2">
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedBooking(booking.id)}
                              >
                                View
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={booking.status === 'cancelled'}
                                className="text-red-500 hover:text-red-700 hover:border-red-200"
                              >
                                Cancel
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No bookings match your search criteria.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Booking Details Dialog */}
        <Dialog open={!!selectedBooking} onOpenChange={(open) => !open && setSelectedBooking(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>
                Complete information about this booking
              </DialogDescription>
            </DialogHeader>
            
            {bookingDetails && (
              <div className="space-y-4">
                {/* Customer Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-medium">Name</p>
                      <p>{bookingDetails.customerName}</p>
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p>{bookingDetails.customerPhone}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-medium">Email</p>
                      <p>{bookingDetails.customerEmail}</p>
                    </div>
                  </div>
                </div>
                
                {/* Vehicle Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Vehicle Information</h3>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="font-medium">Make</p>
                      <p>{bookingDetails.vehicleMake}</p>
                    </div>
                    <div>
                      <p className="font-medium">Model</p>
                      <p>{bookingDetails.vehicleModel}</p>
                    </div>
                    <div>
                      <p className="font-medium">Year</p>
                      <p>{bookingDetails.vehicleYear}</p>
                    </div>
                  </div>
                </div>
                
                {/* Service Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Service Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-medium">Service</p>
                      <p>{bookingService?.name}</p>
                    </div>
                    <div>
                      <p className="font-medium">Price</p>
                      <p>${bookingService?.price.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="font-medium">Duration</p>
                      <p>{bookingService?.duration} minutes</p>
                    </div>
                    <div>
                      <p className="font-medium">Date/Time</p>
                      <p>
                        {new Date(bookingDetails.slotId.split('-')[0]).toLocaleDateString()} at{' '}
                        {bookingDetails.slotId.split('-')[1]}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Additional Notes */}
                {bookingDetails.additionalNotes && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Additional Notes</h3>
                    <p className="text-sm bg-gray-50 p-3 rounded border">{bookingDetails.additionalNotes}</p>
                  </div>
                )}
                
                {/* Update Status */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Update Status</h3>
                  <div className="flex space-x-2">
                    <Button
                      variant={bookingDetails.status === 'pending' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(bookingDetails.id, 'pending')}
                      disabled={bookingDetails.status === 'cancelled'}
                      className="flex-1"
                    >
                      Pending
                    </Button>
                    <Button
                      variant={bookingDetails.status === 'confirmed' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(bookingDetails.id, 'confirmed')}
                      disabled={bookingDetails.status === 'cancelled'}
                      className="flex-1"
                    >
                      Confirm
                    </Button>
                    <Button
                      variant={bookingDetails.status === 'completed' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleStatusChange(bookingDetails.id, 'completed')}
                      disabled={bookingDetails.status === 'cancelled'}
                      className="flex-1"
                    >
                      Complete
                    </Button>
                    <Button
                      variant={bookingDetails.status === 'cancelled' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleCancelBooking(bookingDetails.id)}
                      className="flex-1 text-red-500 hover:text-red-700 hover:border-red-200"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Bookings;
