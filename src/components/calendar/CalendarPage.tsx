
import React, { useState } from "react";
import { BookingCalendar } from "./BookingCalendar";
import { Filter, Plus, Eye, Calendar, User, Home } from "lucide-react";
import { bookings, rooms as allRooms } from "@/lib/data";
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

export function CalendarPage() {
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>("all");
  const [floorFilter, setFloorFilter] = useState<string>("all");
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  const [isViewLegendOpen, setIsViewLegendOpen] = useState(false);
  
  // New booking form state
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
  
  // Apply filters to the rooms
  const filteredRooms = allRooms.filter(room => {
    const matchesType = roomTypeFilter === "all" || room.type === roomTypeFilter;
    const matchesFloor = floorFilter === "all" || room.floor.toString() === floorFilter;
    return matchesType && matchesFloor;
  });

  // Get unique floor values
  const floors = [...new Set(allRooms.map(room => room.floor))].sort();
  
  // Handle new booking button click
  const handleNewBookingClick = () => {
    setIsNewBookingOpen(true);
  };

  // Handle input changes for the booking form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewBooking(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle select changes for the booking form
  const handleSelectChange = (name: string, value: any) => {
    setNewBooking(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle date changes for the booking form
  const handleDateChange = (name: 'checkIn' | 'checkOut', date: Date | undefined) => {
    if (date) {
      setNewBooking(prev => ({
        ...prev,
        [name]: date
      }));
    }
  };

  // Handle form submission
  const handleAddBooking = () => {
    if (!newBooking.guestName || !newBooking.guestEmail || !newBooking.roomId || !newBooking.checkIn || !newBooking.checkOut) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill all required fields.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "New Booking Created",
      description: "The booking has been successfully created."
    });
    setIsNewBookingOpen(false);
    // Reset form
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
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Availability Calendar</h1>
        <Button 
          variant="default"
          onClick={handleNewBookingClick}
        >
          <Plus className="h-4 w-4 mr-2" /> New Booking
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
        <Select value={roomTypeFilter} onValueChange={setRoomTypeFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Room Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Room Types</SelectItem>
            <SelectItem value="standard">Standard</SelectItem>
            <SelectItem value="deluxe">Deluxe</SelectItem>
            <SelectItem value="suite">Suite</SelectItem>
            <SelectItem value="presidential">Presidential</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={floorFilter} onValueChange={setFloorFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Floors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Floors</SelectItem>
            {floors.map(floor => (
              <SelectItem key={floor} value={floor.toString()}>
                Floor {floor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="h-4 w-4 mr-2" /> More Filters
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full sm:w-auto ml-auto"
          onClick={() => setIsViewLegendOpen(true)}
        >
          <Eye className="h-4 w-4 mr-2" /> Legend
        </Button>
      </div>
      
      <BookingCalendar rooms={filteredRooms} bookings={bookings} />

      {/* New Booking Dialog */}
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
      
      {/* Legend Dialog */}
      <Dialog open={isViewLegendOpen} onOpenChange={setIsViewLegendOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Calendar Legend</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-green-100 border border-green-500"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-blue-100 border border-blue-500"></div>
              <span>Confirmed Booking</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-purple-100 border border-purple-500"></div>
              <span>Checked In</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-gray-100 border border-gray-500"></div>
              <span>Checked Out</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-yellow-100 border border-yellow-500"></div>
              <span>Cleaning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-red-100 border border-red-500"></div>
              <span>Maintenance/Out of Order</span>
            </div>
            <div className="flex items-center space-x-2 border-t pt-4">
              <div className="w-4 h-10 bg-white border-l-4 border-primary"></div>
              <span>Check-in Date</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-10 bg-white border-r-4 border-primary"></div>
              <span>Check-out Date</span>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setIsViewLegendOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
