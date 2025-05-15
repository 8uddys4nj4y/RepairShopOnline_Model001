
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ServiceCard from '../components/ServiceCard';
import { useShopData } from '../contexts/ShopContext';
import { useToast } from '@/components/ui/use-toast';

const Home = () => {
  const { services, shopInfo, hours } = useShopData();
  const { toast } = useToast();
  const location = useLocation();
  
  // Check if user was redirected after successful booking
  useEffect(() => {
    if (location.state?.bookingSuccess) {
      toast({
        title: 'Booking Confirmed!',
        description: 'Thank you for booking with us. We will be in touch soon!',
      });
      
      // Clear the state so toast doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state, toast]);
  
  // Get today's hours
  const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, ...
  const todayHours = hours[today === 0 ? 6 : today - 1]; // Adjust for array index
  
  // Featured services (first 3)
  const featuredServices = services.slice(0, 3);
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 z-0">
          <img
            src={shopInfo.images[0]}
            alt="Auto Repair Shop"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Professional Auto Repairs You Can Trust</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">Expert technicians, quality service, and competitive pricing at {shopInfo.name}.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-garage-blue hover:bg-garage-darkBlue animate-fade-in">
                <Link to="/booking">Book an Appointment</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-white/10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <Link to="/services">View Our Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Quick Info Section */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Hours */}
            <Card className="animate-fade-in shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-garage-blue/10 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-garage-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Today's Hours</h3>
                    <p className="text-sm text-gray-600">
                      {todayHours.isOpen ? (
                        <>Open: {todayHours.open} - {todayHours.close}</>
                      ) : (
                        <>Closed Today</>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Phone */}
            <Card className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-garage-blue/10 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-garage-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Call Us</h3>
                    <p className="text-sm text-gray-600">{shopInfo.phone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Address */}
            <Card className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-garage-blue/10 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-garage-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Our Location</h3>
                    <p className="text-sm text-gray-600">{shopInfo.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Featured Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We offer a comprehensive range of automotive repair and maintenance services to keep your vehicle running at its best.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredServices.map((service, index) => (
              <div key={service.id} className="animate-fade-in" style={{ animationDelay: `${0.2 * index}s` }}>
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button asChild variant="outline" className="animate-fade-in">
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We pride ourselves on providing exceptional auto repair services with honesty, expertise, and customer satisfaction.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Certified Technicians */}
            <div className="text-center p-6 animate-fade-in">
              <div className="bg-garage-blue/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-garage-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Certified Technicians</h3>
              <p className="text-gray-600">Our team consists of ASE-certified technicians with years of experience.</p>
            </div>
            
            {/* Quality Parts */}
            <div className="text-center p-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-garage-blue/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-garage-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Parts</h3>
              <p className="text-gray-600">We only use high-quality OEM and aftermarket parts for all repairs.</p>
            </div>
            
            {/* Warranty */}
            <div className="text-center p-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="bg-garage-blue/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-garage-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Service Warranty</h3>
              <p className="text-gray-600">We stand behind our work with a comprehensive service warranty.</p>
            </div>
            
            {/* Fair Pricing */}
            <div className="text-center p-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="bg-garage-blue/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-garage-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Fair Pricing</h3>
              <p className="text-gray-600">Transparent pricing with no hidden fees or unnecessary upsells.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials (could be added in a future iteration) */}
      
      {/* CTA Section */}
      <section className="bg-garage-blue py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 animate-fade-in">Ready to schedule your appointment?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>Book your appointment today and experience our exceptional service firsthand.</p>
          <Button asChild size="lg" variant="outline" className="bg-white text-garage-blue hover:bg-gray-100 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/booking">Book Now</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
