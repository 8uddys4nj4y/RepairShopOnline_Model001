
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminBookings from "./pages/admin/Bookings";
import AdminServices from "./pages/admin/Services";
import AdminSettings from "./pages/admin/Settings";
import AdminChatbot from "./pages/admin/Chatbot";
import { ShopDataProvider } from "./contexts/ShopContext";
import { BookingProvider } from "./contexts/BookingContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ShopDataProvider>
          <BookingProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/booking" element={<Booking />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Admin Routes */}
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/bookings" 
                    element={
                      <ProtectedRoute>
                        <AdminBookings />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/services" 
                    element={
                      <ProtectedRoute>
                        <AdminServices />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/settings" 
                    element={
                      <ProtectedRoute>
                        <AdminSettings />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/chatbot" 
                    element={
                      <ProtectedRoute>
                        <AdminChatbot />
                      </ProtectedRoute>
                    } 
                  />
                  
                  {/* Catch-all Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </BookingProvider>
        </ShopDataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
