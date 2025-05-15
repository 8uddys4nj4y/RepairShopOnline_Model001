
import { Service } from '../contexts/ShopContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  service: Service;
  showBookButton?: boolean;
}

const ServiceCard = ({ service, showBookButton = true }: ServiceCardProps) => {
  return (
    <Card className="service-card overflow-hidden h-full flex flex-col">
      <div className="h-48 overflow-hidden">
        <img 
          src={service.image} 
          alt={service.name} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold">{service.name}</h3>
          <span className="bg-garage-blue text-white px-2 py-1 rounded text-sm font-medium">${service.price.toFixed(2)}</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <p className="text-gray-600 text-sm mb-4">{service.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            <span className="mr-1">⏱️</span> {service.duration} min
          </span>
          {showBookButton && (
            <Button asChild variant="outline" className="hover:bg-garage-blue hover:text-white">
              <Link to={`/booking?service=${service.id}`}>Book Now</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
