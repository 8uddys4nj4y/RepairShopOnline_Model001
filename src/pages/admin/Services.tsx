
import { useState } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { useShopData, Service } from '../../contexts/ShopContext';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const Services = () => {
  const { services, updateService, addService, deleteService } = useShopData();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [formData, setFormData] = useState<Omit<Service, 'id'>>({
    name: '',
    description: '',
    price: 0,
    duration: 0,
    image: '',
  });
  
  // Filter services based on search
  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(search.toLowerCase()) ||
    service.description.toLowerCase().includes(search.toLowerCase())
  );
  
  const openNewServiceDialog = () => {
    setIsEditMode(false);
    setSelectedService(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      duration: 30,
      image: 'https://images.unsplash.com/photo-1637612151903-30498e3e002c?q=80&w=1287&auto=format&fit=crop',
    });
    setIsDialogOpen(true);
  };
  
  const openEditServiceDialog = (service: Service) => {
    setIsEditMode(true);
    setSelectedService(service);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      image: service.image,
    });
    setIsDialogOpen(true);
  };
  
  const handleSaveService = () => {
    try {
      if (isEditMode && selectedService) {
        updateService({
          id: selectedService.id,
          ...formData,
        });
        
        toast({
          title: 'Service Updated',
          description: `${formData.name} has been updated successfully`,
        });
      } else {
        addService({
          id: `service-${Date.now()}`,
          ...formData,
        });
        
        toast({
          title: 'Service Added',
          description: `${formData.name} has been added to your services`,
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save the service. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleDeleteService = (serviceId: string, serviceName: string) => {
    if (window.confirm(`Are you sure you want to delete ${serviceName}?`)) {
      deleteService(serviceId);
      
      toast({
        title: 'Service Deleted',
        description: `${serviceName} has been removed from your services`,
      });
    }
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Service Management</h1>
            <p className="text-gray-500">Add, edit or delete your service offerings</p>
          </div>
          <Button
            onClick={openNewServiceDialog}
            className="bg-garage-blue hover:bg-garage-darkBlue"
          >
            Add New Service
          </Button>
        </div>
        
        {/* Search */}
        <Input
          placeholder="Search services..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        
        {/* Services Table */}
        <Card>
          <CardHeader>
            <CardTitle>Services ({filteredServices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {filteredServices.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Service</th>
                      <th className="text-left p-2">Description</th>
                      <th className="text-right p-2">Price</th>
                      <th className="text-right p-2">Duration</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.map(service => (
                      <tr key={service.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          <div className="font-medium">{service.name}</div>
                        </td>
                        <td className="p-2">
                          <div className="truncate max-w-xs">{service.description}</div>
                        </td>
                        <td className="p-2 text-right">${service.price.toFixed(2)}</td>
                        <td className="p-2 text-right">{service.duration} min</td>
                        <td className="p-2">
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openEditServiceDialog(service)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:border-red-200"
                              onClick={() => handleDeleteService(service.id, service.name)}
                            >
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No services match your search criteria.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Service Dialog (Add/Edit) */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {isEditMode ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? 'Update service details below. Changes will be immediately visible to customers.'
                  : 'Fill in the details for your new service offering.'
                }
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Service Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Oil Change"
                  required
                />
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what's included in this service..."
                  required
                />
              </div>
              
              {/* Price & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="5"
                    step="5"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
              </div>
              
              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image && (
                  <div className="mt-2 rounded-md overflow-hidden h-24 w-full">
                    <img
                      src={formData.image}
                      alt="Service Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1637612151903-30498e3e002c?q=80&w=1287&auto=format&fit=crop';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveService}
                disabled={!formData.name || !formData.description || formData.price <= 0 || formData.duration <= 0}
                className="bg-garage-blue hover:bg-garage-darkBlue"
              >
                {isEditMode ? 'Update Service' : 'Add Service'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default Services;
