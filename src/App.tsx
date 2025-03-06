
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layout/MainLayout";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { BookingsPage } from "./components/bookings/BookingsPage";
import { RoomsPage } from "./components/rooms/RoomsPage";
import { CalendarPage } from "./components/calendar/CalendarPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <MainLayout>
                <DashboardPage />
              </MainLayout>
            } 
          />
          <Route 
            path="/bookings" 
            element={
              <MainLayout>
                <BookingsPage />
              </MainLayout>
            } 
          />
          <Route 
            path="/rooms" 
            element={
              <MainLayout>
                <RoomsPage />
              </MainLayout>
            } 
          />
          <Route 
            path="/calendar" 
            element={
              <MainLayout>
                <CalendarPage />
              </MainLayout>
            } 
          />
          {/* Placeholder routes for future implementation */}
          <Route 
            path="/staff" 
            element={
              <MainLayout>
                <div className="py-20 text-center text-muted-foreground">
                  <h1 className="text-xl font-medium mb-2">Staff Management</h1>
                  <p>This feature will be implemented in the next phase.</p>
                </div>
              </MainLayout>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <MainLayout>
                <div className="py-20 text-center text-muted-foreground">
                  <h1 className="text-xl font-medium mb-2">Reports</h1>
                  <p>This feature will be implemented in the next phase.</p>
                </div>
              </MainLayout>
            } 
          />
          <Route 
            path="/cleaning" 
            element={
              <MainLayout>
                <div className="py-20 text-center text-muted-foreground">
                  <h1 className="text-xl font-medium mb-2">Cleaning Management</h1>
                  <p>This feature will be implemented in the next phase.</p>
                </div>
              </MainLayout>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <MainLayout>
                <div className="py-20 text-center text-muted-foreground">
                  <h1 className="text-xl font-medium mb-2">Settings</h1>
                  <p>This feature will be implemented in the next phase.</p>
                </div>
              </MainLayout>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
