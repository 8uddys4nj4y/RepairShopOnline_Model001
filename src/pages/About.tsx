
import Layout from '../components/layout/Layout';
import { useShopData } from '../contexts/ShopContext';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const { shopInfo } = useShopData();
  
  return (
    <Layout>
      {/* Header */}
      <section className="relative bg-gray-900 text-white py-16">
        <div className="absolute inset-0 z-0">
          <img
            src={shopInfo.images[1]}
            alt="Auto Repair Shop"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-4xl font-bold mb-4">About Our Shop</h1>
            <p className="text-xl">Learn about our team, our history, and our commitment to quality service</p>
          </div>
        </div>
      </section>
      
      {/* Shop History */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                {shopInfo.name} was founded with a simple mission: to provide honest, high-quality auto repair services at fair prices. 
                Since opening our doors, we've built a reputation for excellence in our community.
              </p>
              <p className="text-gray-600 mb-4">
                With decades of combined experience, our team of certified technicians can handle everything from routine maintenance to complex repairs. 
                We pride ourselves on transparent communication, quality workmanship, and exceptional customer service.
              </p>
              <p className="text-gray-600">
                Whether you drive a domestic or import vehicle, our team has the tools, technology, and expertise to get you back on the road safely and quickly.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-xl animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <img 
                src={shopInfo.images[2]} 
                alt="Shop History" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Meet the Team */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our shop is staffed by experienced professionals who are passionate about automotive repair and customer service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Owner */}
            <Card className="overflow-hidden animate-fade-in">
              <div className="h-64 overflow-hidden">
                <img 
                  src={shopInfo.owner.image} 
                  alt={shopInfo.owner.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-1">{shopInfo.owner.name}</h3>
                <p className="text-garage-blue font-medium mb-3">{shopInfo.owner.position}</p>
                <p className="text-gray-600 text-sm">{shopInfo.owner.bio}</p>
              </CardContent>
            </Card>
            
            {/* Staff */}
            {shopInfo.staff.map((staffMember, index) => (
              <Card key={staffMember.id} className="overflow-hidden animate-fade-in" style={{ animationDelay: `${0.2 * (index + 1)}s` }}>
                <div className="h-64 overflow-hidden">
                  <img 
                    src={staffMember.image} 
                    alt={staffMember.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{staffMember.name}</h3>
                  <p className="text-garage-blue font-medium">{staffMember.position}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do at {shopInfo.name}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Integrity */}
            <div className="text-center p-6 bg-white rounded-lg shadow-md animate-fade-in">
              <div className="bg-garage-blue/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-garage-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Integrity</h3>
              <p className="text-gray-600">We're committed to honest recommendations and transparent pricing.</p>
            </div>
            
            {/* Quality */}
            <div className="text-center p-6 bg-white rounded-lg shadow-md animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-garage-blue/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-garage-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality</h3>
              <p className="text-gray-600">We deliver exceptional workmanship and use only quality parts.</p>
            </div>
            
            {/* Customer First */}
            <div className="text-center p-6 bg-white rounded-lg shadow-md animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="bg-garage-blue/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-garage-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Customer First</h3>
              <p className="text-gray-600">Your satisfaction and safety are our top priorities.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Shop Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Facility</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Take a visual tour of our modern, well-equipped auto repair shop
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shopInfo.images.map((image, index) => (
              <div key={index} className="rounded-lg overflow-hidden shadow-md h-64 animate-fade-in" style={{ animationDelay: `${0.1 * index}s` }}>
                <img 
                  src={image} 
                  alt={`Shop Image ${index + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
