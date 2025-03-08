import React, { useState, useEffect } from "react";
import { Search, Filter, Plus, SlidersHorizontal, Calendar, User, Home } from "lucide-react";
import { BookingTable } from "./BookingTable";
import { Booking, Room, bookings as mockBookings, rooms as allRooms } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>(mockBookings);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  
  const [newBooking, setNewBooking] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    roomId: "",
    checkIn: new Date(),
    checkOut: addDays(new Date(), 3),
    adults: 1,
    children: 0,
    specialRequests: "",
    status: "confirmed" as const
  });

  useEffect(() => {
    let filtered = [...bookings];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (booking) =>
          booking.guest.name.toLowerCase().includes(query) ||
          booking.guest.email.toLowerCase().includes(query) ||
          booking.roomId.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [bookings, searchQuery, statusFilter]);

  const handleNewBookingClick = () => {
    setIsNewBookingOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewBooking(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setNewBooking(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name: 'checkIn' | 'checkOut', date: Date | undefined) => {
    if (date) {
      setNewBooking(prev => ({
        ...prev,
        [name]: date
      }));
    }
  };

  const handleAddBooking = () => {
    if (!newBooking.guestName || !newBooking.guestEmail || !newBooking.roomId || !newBooking.checkIn || !newBooking.checkOut) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newBookingObj: Booking = {
      id: `booking-${Date.now()}`,
      guest: {
        id: `guest-${Date.now()}`,
        name: newBooking.guestName,
        email: newBooking.guestEmail,
        phone: newBooking.guestPhone || "Not provided"
      },
      guestId: `guest-${Date.now()}`,
      roomId: newBooking.roomId,
      checkIn: format(newBooking.checkIn, 'yyyy-MM-dd'),
      checkOut: format(newBooking.checkOut, 'yyyy-MM-dd'),
      status: newBooking.status,
      totalAmount: 850.00,
      paymentStatus: "unpaid",
      createdAt: format(new Date(), 'yyyy-MM-dd'),
      updatedAt: format(new Date(), 'yyyy-MM-dd'),
      adults: newBooking.adults,
      children: newBooking.children,
      specialRequests: newBooking.specialRequests
    };

    setBookings(prev => [newBookingObj, ...prev]);
    
    setIsNewBookingOpen(false);
    setNewBooking({
      guestName: "",
      guestEmail: "",
      guestPhone: "",
      roomId: "",
      checkIn: new Date(),
      checkOut: addDays(new Date(), 3),
      adults: 1,
      children: 0,
      specialRequests: "",
      status: "confirmed"
    });

    toast({
      title: "Booking Added",
      description: "The booking has been successfully created."
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
        <button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
          onClick={handleNewBookingClick}
        >
          <Plus className="h-4 w-4" /> New Booking
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search guest name, email or room..."
            className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select
            className="px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="checked_out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
          <button className="px-3 py-2 text-gray-700 border border-input bg-background rounded-md hover:bg-muted transition-colors flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
        </div>
      </div>

      <BookingTable bookings={filteredBookings} />

      <Dialog open={isNewBookingOpen} onOpenChange={setIsNewBookingOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Booking</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Guest Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="guestName">Name <span className="text-red-500">*</span></Label>
                <Input
                  id="guestName"
                  name="guestName"
                  placeholder="Guest name"
                  value={newBooking.guestName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="guestEmail">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="guestEmail"
                  name="guestEmail"
                  type="email"
                  placeholder="guest@example.com"
                  value={newBooking.guestEmail}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="guestPhone">Phone Number</Label>
                <Input
                  id="guestPhone"
                  name="guestPhone"
                  placeholder="+1 234 567 8900"
                  value={newBooking.guestPhone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Booking Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="roomId">Room <span className="text-red-500">*</span></Label>
                <Select onValueChange={(value) => handleSelectChange("roomId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {allRooms
                      .filter(room => room.status === "available")
                      .map(room => (
                        <SelectItem key={room.id} value={room.id}>
                          Room {room.number} - {room.type.charAt(0).toUpperCase() + room.type.slice(1)}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Check-in Date <span className="text-red-500">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newBooking.checkIn && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {newBooking.checkIn ? format(newBooking.checkIn, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={newBooking.checkIn}
                        onSelect={(date) => handleDateChange('checkIn', date)}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-2">
                  <Label>Check-out Date <span className="text-red-500">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newBooking.checkOut && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {newBooking.checkOut ? format(newBooking.checkOut, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={newBooking.checkOut}
                        onSelect={(date) => handleDateChange('checkOut', date)}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adults">Adults</Label>
                  <Select 
                    defaultValue={newBooking.adults.toString()} 
                    onValueChange={(value) => handleSelectChange("adults", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="No. of adults" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="children">Children</Label>
                  <Select 
                    defaultValue={newBooking.children.toString()} 
                    onValueChange={(value) => handleSelectChange("children", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="No. of children" />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                name="specialRequests"
                placeholder="Any special requirements or notes for this booking"
                rows={3}
                value={newBooking.specialRequests}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsNewBookingOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBooking}>
              Create Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
