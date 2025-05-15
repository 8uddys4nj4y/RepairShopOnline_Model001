
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import AdminLayout from '../../components/layout/AdminLayout';
import { useShopData, ShopInfo, ShopHours } from '../../contexts/ShopContext';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

const shopInfoSchema = z.object({
  name: z.string().min(2, { message: 'Shop name must be at least 2 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  address: z.string().min(5, { message: 'Address is required' }),
  phone: z.string().min(7, { message: 'Valid phone number is required' }),
  email: z.string().email({ message: 'Valid email address is required' }),
  
  owner: z.object({
    name: z.string().min(2, { message: 'Owner name is required' }),
    position: z.string().min(2, { message: 'Position is required' }),
    bio: z.string().min(10, { message: 'Bio must be at least 10 characters' }),
    image: z.string().url({ message: 'Valid image URL is required' }),
  }),
  
  staff: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(2, { message: 'Staff name is required' }),
      position: z.string().min(2, { message: 'Position is required' }),
      image: z.string().url({ message: 'Valid image URL is required' }),
    })
  ),
  
  images: z.array(
    z.string().url({ message: 'Valid image URL is required' })
  ).min(1, { message: 'At least one shop image is required' }),
});

const hoursSchema = z.array(
  z.object({
    day: z.string(),
    open: z.string(),
    close: z.string(),
    isOpen: z.boolean(),
  })
);

type ShopInfoFormValues = z.infer<typeof shopInfoSchema>;
type HoursFormValues = z.infer<typeof hoursSchema>;

const Settings = () => {
  const { shopInfo, hours, updateShopInfo, updateHours } = useShopData();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('shop-info');
  const [shopHours, setShopHours] = useState<ShopHours[]>(hours);
  
  // Shop Info Form
  const shopInfoForm = useForm<ShopInfoFormValues>({
    resolver: zodResolver(shopInfoSchema),
    defaultValues: shopInfo,
  });
  
  // Update form values when shopInfo changes
  useEffect(() => {
    shopInfoForm.reset(shopInfo);
  }, [shopInfo, shopInfoForm]);
  
  // Handle shop info submission
  const onShopInfoSubmit = (values: ShopInfoFormValues) => {
    updateShopInfo(values);
    
    toast({
      title: 'Shop Information Updated',
      description: 'Your changes have been saved successfully',
    });
  };
  
  // Handle hours toggle change
  const handleToggleDay = (index: number) => {
    const updatedHours = [...shopHours];
    updatedHours[index].isOpen = !updatedHours[index].isOpen;
    setShopHours(updatedHours);
  };
  
  // Handle hours change
  const handleHoursChange = (index: number, field: 'open' | 'close', value: string) => {
    const updatedHours = [...shopHours];
    updatedHours[index][field] = value;
    setShopHours(updatedHours);
  };
  
  // Save hours
  const saveHours = () => {
    updateHours(shopHours);
    
    toast({
      title: 'Business Hours Updated',
      description: 'Your shop hours have been saved successfully',
    });
  };
  
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-500">Manage your shop information and operating hours</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="shop-info">Shop Information</TabsTrigger>
            <TabsTrigger value="hours">Business Hours</TabsTrigger>
          </TabsList>
          
          {/* Shop Info Tab */}
          <TabsContent value="shop-info" className="space-y-6 pt-4">
            <Form {...shopInfoForm}>
              <form onSubmit={shopInfoForm.handleSubmit(onShopInfoSubmit)} className="space-y-8">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={shopInfoForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shop Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={shopInfoForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shop Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              className="min-h-32 resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={shopInfoForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={shopInfoForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={shopInfoForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                {/* Owner Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Owner Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={shopInfoForm.control}
                        name="owner.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Owner Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={shopInfoForm.control}
                        name="owner.position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={shopInfoForm.control}
                      name="owner.bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              className="min-h-24 resize-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={shopInfoForm.control}
                      name="owner.image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          {field.value && (
                            <div className="h-20 w-20 rounded overflow-hidden mt-2">
                              <img 
                                src={field.value} 
                                alt="Owner" 
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://images.unsplash.com/photo-1637612151903-30498e3e002c?q=80&w=1287&auto=format&fit=crop';
                                }}
                              />
                            </div>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                
                {/* Shop Images */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shop Images</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {shopInfoForm.watch('images')?.map((image, index) => (
                        <FormField
                          key={index}
                          control={shopInfoForm.control}
                          name={`images.${index}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Image URL #{index + 1}</FormLabel>
                              <div className="flex gap-2">
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => {
                                    const currentImages = shopInfoForm.getValues('images');
                                    if (currentImages.length > 1) {
                                      shopInfoForm.setValue(
                                        'images', 
                                        currentImages.filter((_, i) => i !== index)
                                      );
                                    } else {
                                      toast({
                                        title: 'Cannot Remove',
                                        description: 'You must have at least one shop image',
                                        variant: 'destructive',
                                      });
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  Remove
                                </Button>
                              </div>
                              {field.value && (
                                <div className="h-32 rounded overflow-hidden mt-2">
                                  <img 
                                    src={field.value} 
                                    alt={`Shop ${index + 1}`} 
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = 'https://images.unsplash.com/photo-1637612151903-30498e3e002c?q=80&w=1287&auto=format&fit=crop';
                                    }}
                                  />
                                </div>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          const currentImages = shopInfoForm.getValues('images');
                          shopInfoForm.setValue('images', [
                            ...currentImages,
                            'https://images.unsplash.com/photo-1637612151903-30498e3e002c?q=80&w=1287&auto=format&fit=crop',
                          ]);
                        }}
                      >
                        Add Image
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Button type="submit" className="bg-garage-blue hover:bg-garage-darkBlue">
                  Save Changes
                </Button>
              </form>
            </Form>
          </TabsContent>
          
          {/* Hours Tab */}
          <TabsContent value="hours" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-500 pb-2 border-b">
                    <div>Day</div>
                    <div>Open</div>
                    <div>Close</div>
                    <div>Status</div>
                  </div>
                  
                  {shopHours.map((day, index) => (
                    <div key={day.day} className="grid grid-cols-4 gap-4 items-center">
                      <div className="font-medium">{day.day}</div>
                      <div>
                        <Input
                          type="time"
                          value={day.open}
                          onChange={(e) => handleHoursChange(index, 'open', e.target.value)}
                          disabled={!day.isOpen}
                        />
                      </div>
                      <div>
                        <Input
                          type="time"
                          value={day.close}
                          onChange={(e) => handleHoursChange(index, 'close', e.target.value)}
                          disabled={!day.isOpen}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={day.isOpen}
                          onCheckedChange={() => handleToggleDay(index)}
                          id={`day-toggle-${index}`}
                        />
                        <span className={day.isOpen ? 'text-green-600' : 'text-red-600'}>
                          {day.isOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    onClick={saveHours}
                    className="mt-6 bg-garage-blue hover:bg-garage-darkBlue"
                  >
                    Save Business Hours
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
