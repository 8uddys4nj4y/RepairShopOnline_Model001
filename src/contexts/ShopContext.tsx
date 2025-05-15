
import React, { createContext, useState, useContext, useEffect } from 'react';

// Define types
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
}

export interface ShopHours {
  day: string;
  open: string;
  close: string;
  isOpen: boolean;
}

export interface ShopInfo {
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  images: string[];
  owner: {
    name: string;
    position: string;
    bio: string;
    image: string;
  };
  staff: Array<{
    id: string;
    name: string;
    position: string;
    image: string;
  }>;
}

interface ShopContextProps {
  services: Service[];
  hours: ShopHours[];
  shopInfo: ShopInfo;
  updateService: (service: Service) => void;
  addService: (service: Service) => void;
  deleteService: (id: string) => void;
  updateHours: (hours: ShopHours[]) => void;
  updateShopInfo: (info: ShopInfo) => void;
  loading: boolean;
}

// Create context
const ShopDataContext = createContext<ShopContextProps | undefined>(undefined);

// Sample data
const initialServices: Service[] = [
  {
    id: '1',
    name: 'Oil Change',
    description: 'Complete oil change with filter replacement',
    price: 49.99,
    duration: 30,
    image: 'https://images.unsplash.com/photo-1635006459244-fd685a8ef8b0?q=80&w=1287&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Brake Service',
    description: 'Inspection, repair or replacement of brake pads, rotors and calipers',
    price: 199.99,
    duration: 90,
    image: 'https://images.unsplash.com/photo-1581112877049-09a7e8690206?q=80&w=1287&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Engine Diagnostic',
    description: 'Complete computer diagnostic of engine performance issues',
    price: 89.99,
    duration: 60,
    image: 'https://images.unsplash.com/photo-1563213126-a4273aed2016?q=80&w=1287&auto=format&fit=crop'
  },
  {
    id: '4',
    name: 'Tire Rotation',
    description: 'Tire rotation and balancing service',
    price: 39.99,
    duration: 45,
    image: 'https://images.unsplash.com/photo-1602898809661-8998d701be97?q=80&w=1310&auto=format&fit=crop'
  }
];

const initialHours: ShopHours[] = [
  { day: 'Monday', open: '08:00', close: '18:00', isOpen: true },
  { day: 'Tuesday', open: '08:00', close: '18:00', isOpen: true },
  { day: 'Wednesday', open: '08:00', close: '18:00', isOpen: true },
  { day: 'Thursday', open: '08:00', close: '18:00', isOpen: true },
  { day: 'Friday', open: '08:00', close: '17:00', isOpen: true },
  { day: 'Saturday', open: '09:00', close: '15:00', isOpen: true },
  { day: 'Sunday', open: '00:00', close: '00:00', isOpen: false }
];

const initialShopInfo: ShopInfo = {
  name: 'SP AUTO WORKS',
  description: 'We are a full-service auto repair shop dedicated to providing high-quality vehicle repair and maintenance services. This shop had a certified technician uses the latest diagnostic equipment to deliver reliable service and quick turnaround.',
  address: '1234 Repair Lane, Autoville, CA 90210',
  phone: '(+81) 95660 20537',
  email: 'spautoservice01@gmail.com',
  images: [
    'https://images.unsplash.com/photo-1503434396599-58ba8a18d932?q=80&w=1374&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1613214150384-4fbc6e82e130?q=80&w=1950&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1604754742629-3e0474ce5900?q=80&w=1320&auto=format&fit=crop'
  ],
  owner: {
    name: 'Michael Johnson',
    position: 'Owner & Master Technician',
    bio: 'With over 20 years of experience in the automotive industry, Michael founded AutoFix Pro to provide honest, high-quality repairs to the community.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1287&auto=format&fit=crop'
  },
  staff: [
    {
      id: '1',
      name: 'Sarah Williams',
      position: 'Senior Technician',
      image: 'https://images.unsplash.com/photo-1654922207993-2952fec328ae?q=80&w=1287&auto=format&fit=crop'
    },
    {
      id: '2',
      name: 'David Chen',
      position: 'Diagnostic Specialist',
      image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=1287&auto=format&fit=crop'
    }
  ]
};

// Provider component
export const ShopDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [hours, setHours] = useState<ShopHours[]>(initialHours);
  const [shopInfo, setShopInfo] = useState<ShopInfo>(initialShopInfo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data from localStorage if available
    const savedServices = localStorage.getItem('services');
    const savedHours = localStorage.getItem('hours');
    const savedShopInfo = localStorage.getItem('shopInfo');

    if (savedServices) setServices(JSON.parse(savedServices));
    if (savedHours) setHours(JSON.parse(savedHours));
    if (savedShopInfo) setShopInfo(JSON.parse(savedShopInfo));

    setLoading(false);
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('services', JSON.stringify(services));
      localStorage.setItem('hours', JSON.stringify(hours));
      localStorage.setItem('shopInfo', JSON.stringify(shopInfo));
    }
  }, [services, hours, shopInfo, loading]);

  const updateService = (updatedService: Service) => {
    setServices(services.map(service => 
      service.id === updatedService.id ? updatedService : service
    ));
  };

  const addService = (newService: Service) => {
    setServices([...services, newService]);
  };

  const deleteService = (id: string) => {
    setServices(services.filter(service => service.id !== id));
  };

  const updateHours = (updatedHours: ShopHours[]) => {
    setHours(updatedHours);
  };

  const updateShopInfo = (updatedInfo: ShopInfo) => {
    setShopInfo(updatedInfo);
  };

  return (
    <ShopDataContext.Provider value={{
      services,
      hours,
      shopInfo,
      updateService,
      addService,
      deleteService,
      updateHours,
      updateShopInfo,
      loading
    }}>
      {children}
    </ShopDataContext.Provider>
  );
};

// Custom hook
export const useShopData = () => {
  const context = useContext(ShopDataContext);
  if (context === undefined) {
    throw new Error('useShopData must be used within a ShopDataProvider');
  }
  return context;
};
