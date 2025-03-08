
import React, { useState } from "react";
import { BookingCalendar } from "./BookingCalendar";
import { Filter, Plus, Eye } from "lucide-react";
import { bookings, rooms as allRooms } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export function CalendarPage() {
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>("all");
  const [floorFilter, setFloorFilter] = useState<string>("all");
  const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
  
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

  // Handle form submission
  const handleAddBooking = () => {
    toast({
      title: "New Booking",
      description: "This would create a new booking in a real application."
    });
    setIsNewBookingOpen(false);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Availability Calendar</h1>
        <button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
          onClick={handleNewBookingClick}
        >
          <Plus className="h-4 w-4" /> New Booking
        </button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <select
          className="px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          value={roomTypeFilter}
          onChange={(e) => setRoomTypeFilter(e.target.value)}
        >
          <option value="all">All Room Types</option>
          <option value="standard">Standard</option>
          <option value="deluxe">Deluxe</option>
          <option value="suite">Suite</option>
          <option value="presidential">Presidential</option>
        </select>
        
        <select
          className="px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          value={floorFilter}
          onChange={(e) => setFloorFilter(e.target.value)}
        >
          <option value="all">All Floors</option>
          {floors.map(floor => (
            <option key={floor} value={floor.toString()}>
              Floor {floor}
            </option>
          ))}
        </select>
        
        <button className="px-3 py-2 text-foreground border border-input bg-background rounded-md hover:bg-muted transition-colors flex items-center gap-2">
          <Filter className="h-4 w-4" /> More Filters
        </button>
        
        <button className="px-3 py-2 text-foreground border border-input bg-background rounded-md hover:bg-muted transition-colors flex items-center gap-2 ml-auto">
          <Eye className="h-4 w-4" /> Legend
        </button>
      </div>
      
      <BookingCalendar rooms={filteredRooms} bookings={bookings} />

      {/* New Booking Dialog */}
      <Dialog open={isNewBookingOpen} onOpenChange={setIsNewBookingOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create New Booking</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p>This is a placeholder for the booking form. In a real application, this would contain a form to create a new booking.</p>
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
