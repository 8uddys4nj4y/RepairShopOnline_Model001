
import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { useShopData } from '../../contexts/ShopContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { bookings } = useBooking();
  const { services } = useShopData();
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    serviceStats: {} as Record<string, number>,
  });
  
  useEffect(() => {
    // Calculate dashboard stats
    const totalBookings = bookings.length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;
    
    // Count bookings by service
    const serviceStats: Record<string, number> = {};
    bookings.forEach(booking => {
      if (serviceStats[booking.serviceId]) {
        serviceStats[booking.serviceId]++;
      } else {
        serviceStats[booking.serviceId] = 1;
      }
    });
    
    setStats({
      totalBookings,
      pendingBookings,
      confirmedBookings,
      serviceStats,
    });
  }, [bookings]);
  
  // Get today's date and format it
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // Get today's bookings
  const todayBookings = bookings.filter(booking => {
    const bookingDate = booking.slotId.split('-')[0];
    const today = new Date().toISOString().split('T')[0];
    return bookingDate === today;
  });
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Welcome back, {user?.username}!</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Today's Date</div>
            <div className="font-medium">{today}</div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-gray-500 mt-1">All time booking count</p>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pendingBookings}</div>
              <p className="text-xs text-gray-500 mt-1">Awaiting confirmation</p>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Confirmed Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.confirmedBookings}</div>
              <p className="text-xs text-gray-500 mt-1">Ready for service</p>
            </CardContent>
          </Card>
          
          <Card className="dashboard-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Services Offered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{services.length}</div>
              <p className="text-xs text-gray-500 mt-1">Available to customers</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Today's Bookings */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Today's Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {todayBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Customer</th>
                      <th className="text-left p-2">Service</th>
                      <th className="text-left p-2">Time</th>
                      <th className="text-left p-2">Vehicle</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayBookings.map(booking => {
                      // Extract time from slot ID
                      const timeSlot = booking.slotId.split('-')[1];
                      // Find service name
                      const service = services.find(s => s.id === booking.serviceId);
                      
                      return (
                        <tr key={booking.id} className="border-b hover:bg-gray-50">
                          <td className="p-2">
                            <div className="font-medium">{booking.customerName}</div>
                            <div className="text-xs text-gray-500">{booking.customerPhone}</div>
                          </td>
                          <td className="p-2">{service?.name || 'Unknown Service'}</td>
                          <td className="p-2">{timeSlot}</td>
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
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No bookings scheduled for today.
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Service Stats */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle>Service Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats.serviceStats).length > 0 ? (
                Object.entries(stats.serviceStats).map(([serviceId, count]) => {
                  const service = services.find(s => s.id === serviceId);
                  const percentage = (count / stats.totalBookings * 100).toFixed(1);
                  
                  return (
                    <div key={serviceId} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">{service?.name || 'Unknown Service'}</span>
                        <span className="text-gray-500">{count} bookings ({percentage}%)</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full">
                        <div 
                          className="h-full bg-garage-blue rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No booking statistics available yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
