
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { MainLayout } from "./components/layout/MainLayout";
import { DashboardPage } from "./components/dashboard/DashboardPage";
import { BookingsPage } from "./components/bookings/BookingsPage";
import { RoomsPage } from "./components/rooms/RoomsPage";
import { CalendarPage } from "./components/calendar/CalendarPage";
import { StaffPage } from "./components/staff/StaffPage";
import { ReportsPage } from "./components/reports/ReportsPage";
import { CleaningPage } from "./components/cleaning/CleaningPage";
import { SettingsPage } from "./components/settings/SettingsPage";
import { ExpensesPage } from "./components/expenses/ExpensesPage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
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
              <Route 
                path="/staff" 
                element={
                  <MainLayout>
                    <StaffPage />
                  </MainLayout>
                } 
              />
              <Route 
                path="/expenses" 
                element={
                  <MainLayout>
                    <ExpensesPage />
                  </MainLayout>
                } 
              />
              <Route 
                path="/reports" 
                element={
                  <MainLayout>
                    <ReportsPage />
                  </MainLayout>
                } 
              />
              <Route 
                path="/cleaning" 
                element={
                  <MainLayout>
                    <CleaningPage />
                  </MainLayout>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <MainLayout>
                    <SettingsPage />
                  </MainLayout>
                } 
              />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
