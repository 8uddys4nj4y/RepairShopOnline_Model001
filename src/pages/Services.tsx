
import Layout from '../components/layout/Layout';
import ServiceCard from '../components/ServiceCard';
import { useShopData } from '../contexts/ShopContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Services = () => {
  const { services } = useShopData();
  
  return (
    <Layout>
      {/* Header */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl font-bold mb-6">Our Services</h1>
            <p className="text-xl">
              Comprehensive automotive repair services performed by certified technicians
            </p>
          </div>
        </div>
      </section>
      
      {/* Services List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={service.id} className="animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Service Process */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Service Process</h2>
            <p className="text-gray-600">
              We follow a straightforward process to ensure your vehicle receives the best care possible
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative animate-fade-in">
              <div className="bg-white p-6 rounded-lg shadow-md text-center h-full">
                <div className="bg-garage-blue/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-garage-blue">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Book Appointment</h3>
                <p className="text-gray-600">Schedule a convenient time online or by phone for your service</p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M39.5303 6.53033C39.8232 6.23744 39.8232 5.76256 39.5303 5.46967L34.7574 0.696699C34.4645 0.403806 33.9896 0.403806 33.6967 0.696699C33.4038 0.989593 33.4038 1.46447 33.6967 1.75736L37.9393 6L33.6967 10.2426C33.4038 10.5355 33.4038 11.0104 33.6967 11.3033C33.9896 11.5962 34.4645 11.5962 34.7574 11.3033L39.5303 6.53033ZM-1.09278e-07 6.75L39 6.75L39 5.25L1.09278e-07 5.25L-1.09278e-07 6.75Z" fill="#CCCCCC"/>
                </svg>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-white p-6 rounded-lg shadow-md text-center h-full">
                <div className="bg-garage-blue/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-garage-blue">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Diagnostic</h3>
                <p className="text-gray-600">Our technicians perform a comprehensive inspection of your vehicle</p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M39.5303 6.53033C39.8232 6.23744 39.8232 5.76256 39.5303 5.46967L34.7574 0.696699C34.4645 0.403806 33.9896 0.403806 33.6967 0.696699C33.4038 0.989593 33.4038 1.46447 33.6967 1.75736L37.9393 6L33.6967 10.2426C33.4038 10.5355 33.4038 11.0104 33.6967 11.3033C33.9896 11.5962 34.4645 11.5962 34.7574 11.3033L39.5303 6.53033ZM-1.09278e-07 6.75L39 6.75L39 5.25L1.09278e-07 5.25L-1.09278e-07 6.75Z" fill="#CCCCCC"/>
                </svg>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="relative animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="bg-white p-6 rounded-lg shadow-md text-center h-full">
                <div className="bg-garage-blue/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-garage-blue">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Repair Service</h3>
                <p className="text-gray-600">Our team fixes the issues using quality parts and expert techniques</p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M39.5303 6.53033C39.8232 6.23744 39.8232 5.76256 39.5303 5.46967L34.7574 0.696699C34.4645 0.403806 33.9896 0.403806 33.6967 0.696699C33.4038 0.989593 33.4038 1.46447 33.6967 1.75736L37.9393 6L33.6967 10.2426C33.4038 10.5355 33.4038 11.0104 33.6967 11.3033C33.9896 11.5962 34.4645 11.5962 34.7574 11.3033L39.5303 6.53033ZM-1.09278e-07 6.75L39 6.75L39 5.25L1.09278e-07 5.25L-1.09278e-07 6.75Z" fill="#CCCCCC"/>
                </svg>
              </div>
            </div>
            
            {/* Step 4 */}
            <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="bg-white p-6 rounded-lg shadow-md text-center h-full">
                <div className="bg-garage-blue/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-garage-blue">4</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Check</h3>
                <p className="text-gray-600">Final inspection to ensure everything works perfectly before delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 bg-garage-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 animate-fade-in">Ready to book your service?</h2>
          <p className="text-xl mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>Schedule an appointment today and experience our quality service</p>
          <Button asChild size="lg" variant="outline" className="bg-white text-garage-blue hover:bg-gray-100 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/booking">Book Appointment</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
