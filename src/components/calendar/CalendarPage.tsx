
import React, { useState } from "react";
import { BookingCalendar } from "./BookingCalendar";
import { Filter, Plus, Eye } from "lucide-react";
import { bookings, rooms as allRooms } from "@/lib/data";

export function CalendarPage() {
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>("all");
  const [floorFilter, setFloorFilter] = useState<string>("all");
  
  // Apply filters to the rooms
  const filteredRooms = allRooms.filter(room => {
    const matchesType = roomTypeFilter === "all" || room.type === roomTypeFilter;
    const matchesFloor = floorFilter === "all" || room.floor.toString() === floorFilter;
    return matchesType && matchesFloor;
  });

  // Get unique floor values
  const floors = [...new Set(allRooms.map(room => room.floor))].sort();
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Availability Calendar</h1>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2">
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
    </div>
  );
}
