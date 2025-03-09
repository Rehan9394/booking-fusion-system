
import React, { useState } from "react";
import { cn, formatDate, formatDateTime } from "@/lib/utils";
import { addDays, format, isSameDay, isSameMonth, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, isBefore } from "date-fns";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Booking, Room, bookings, getStatusColorClass, rooms as allRooms, formatCurrency } from "@/lib/data";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface BookingCalendarProps {
  rooms: Room[];
  bookings: Booking[];
}

export function BookingCalendar({ rooms, bookings }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<"month" | "week">("week");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  
  // Get days to display based on current view
  const getDaysToDisplay = () => {
    if (currentView === "month") {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(currentDate);
      return eachDayOfInterval({ start: monthStart, end: monthEnd });
    } else {
      // Week view: Show 14 days from current date
      return Array.from({ length: 14 }, (_, i) => addDays(currentDate, i));
    }
  };
  
  const days = getDaysToDisplay();
  
  // Navigate to previous/next period
  const navigatePrevious = () => {
    if (currentView === "month") {
      setCurrentDate(addMonths(currentDate, -1));
    } else {
      setCurrentDate(addDays(currentDate, -14));
    }
  };
  
  const navigateNext = () => {
    if (currentView === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addDays(currentDate, 14));
    }
  };
  
  // Check if a room is booked on a specific date
  const getRoomBookingStatus = (roomId: string, date: Date) => {
    const booking = bookings.find(booking => {
      const checkIn = new Date(booking.checkIn);
      const checkOut = new Date(booking.checkOut);
      
      return booking.roomId === roomId && 
             (isSameDay(date, checkIn) || isSameDay(date, checkOut) || 
              (isBefore(checkIn, date) && isBefore(date, checkOut)));
    });
    
    if (booking) {
      return {
        isBooked: true,
        isCheckIn: isSameDay(date, new Date(booking.checkIn)),
        isCheckOut: isSameDay(date, new Date(booking.checkOut)),
        booking
      };
    }
    
    return { isBooked: false };
  };

  // Handle edit booking
  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
  };

  // Handle close edit form
  const handleCloseEdit = () => {
    setSelectedBooking(null);
  };
  
  return (
    <div className="bg-card rounded-lg border border-border p-4 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-medium">
            {currentView === "month" 
              ? format(currentDate, "MMMM yyyy") 
              : `${format(days[0], "MMM d")} - ${format(days[days.length - 1], "MMM d, yyyy")}`}
          </h3>
          <div className="flex border border-border rounded-md overflow-hidden">
            <button
              onClick={() => setCurrentView("week")}
              className={cn(
                "px-3 py-1 text-sm transition-colors",
                currentView === "week" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-card text-foreground hover:bg-muted"
              )}
            >
              Week
            </button>
            <button
              onClick={() => setCurrentView("month")}
              className={cn(
                "px-3 py-1 text-sm transition-colors",
                currentView === "month" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-card text-foreground hover:bg-muted"
              )}
            >
              Month
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={navigatePrevious}
            className="p-1 rounded hover:bg-muted transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm rounded hover:bg-muted transition-colors"
          >
            Today
          </button>
          <button 
            onClick={navigateNext}
            className="p-1 rounded hover:bg-muted transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-max">
          <div className="grid grid-cols-[150px_repeat(14,_minmax(100px,_1fr))] border-b border-border">
            <div className="p-2 font-medium text-sm text-muted-foreground flex items-center justify-start">
              Room
            </div>
            {days.map(day => (
              <div 
                key={day.toString()}
                className={cn(
                  "p-2 font-medium text-center border-l border-border",
                  !isSameMonth(day, currentDate) && "text-muted-foreground bg-muted/30",
                  isSameDay(day, new Date()) && "bg-primary/10"
                )}
              >
                <div className="text-sm">{format(day, "EEE")}</div>
                <div className={cn(
                  "text-sm",
                  isSameDay(day, new Date()) && "text-primary font-bold"
                )}>
                  {format(day, "d")}
                </div>
              </div>
            ))}
          </div>
          
          {rooms.map((room) => (
            <div 
              key={room.id} 
              className="grid grid-cols-[150px_repeat(14,_minmax(100px,_1fr))] border-b border-border hover:bg-muted/20 transition-colors"
            >
              <div className="p-3 font-medium flex flex-col justify-center">
                <div>{room.number}</div>
                <div className="text-xs text-muted-foreground capitalize">{room.type}</div>
              </div>
              
              {days.map(day => {
                const { isBooked, isCheckIn, isCheckOut, booking } = getRoomBookingStatus(room.id, day);
                const isUnavailable = ["maintenance", "out_of_order"].includes(room.status);
                
                return (
                  <div 
                    key={day.toString()}
                    className={cn(
                      "p-1 border-l border-border text-xs min-h-[60px]",
                      !isSameMonth(day, currentDate) && "bg-muted/30",
                      isSameDay(day, new Date()) && "bg-primary/5"
                    )}
                  >
                    {isBooked && booking && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div 
                              onClick={() => handleEditBooking(booking)}
                              className={cn(
                                "h-full rounded p-1 flex flex-col justify-center cursor-pointer hover:brightness-95",
                                getStatusColorClass(booking.status),
                                isCheckIn && "border-l-4 border-primary",
                                isCheckOut && "border-r-4 border-primary",
                              )}
                            >
                              <div className="font-medium truncate">{booking.guest.name}</div>
                              {isCheckIn && <div>Check In</div>}
                              {isCheckOut && <div>Check Out</div>}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-md p-0">
                            <Card className="border-0 shadow-none">
                              <CardHeader className="pb-2">
                                <CardTitle className="text-base">{booking.guest.name}</CardTitle>
                                <CardDescription>
                                  Room {room.number} • {room.type}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="pb-2 space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Check In:</span>
                                  <span className="font-medium">{formatDate(new Date(booking.checkIn))}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Check Out:</span>
                                  <span className="font-medium">{formatDate(new Date(booking.checkOut))}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Status:</span>
                                  <span className="font-medium capitalize">{booking.status.replace('_', ' ')}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Guests:</span>
                                  <span className="font-medium">{booking.adults} adults, {booking.children} children</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Amount:</span>
                                  <span className="font-medium">{formatCurrency(booking.totalAmount)}</span>
                                </div>
                              </CardContent>
                              <CardFooter className="pt-0 text-xs text-muted-foreground">
                                Click to edit booking details
                              </CardFooter>
                            </Card>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    
                    {isUnavailable && !isBooked && (
                      <div className="h-full rounded bg-muted/50 border border-muted p-1 flex items-center justify-center">
                        {room.status === "maintenance" ? "Maintenance" : "Out of Order"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Edit Booking Popover */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md m-4">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Edit Booking</CardTitle>
                <button onClick={handleCloseEdit} className="rounded-full p-1 hover:bg-muted">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <CardDescription>
                Booking #{selectedBooking.id.split('-')[1]} for {selectedBooking.guest.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Check In</label>
                  <div className="border rounded p-2 mt-1">
                    {formatDate(new Date(selectedBooking.checkIn))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Check Out</label>
                  <div className="border rounded p-2 mt-1">
                    {formatDate(new Date(selectedBooking.checkOut))}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Room</label>
                <div className="border rounded p-2 mt-1">
                  {rooms.find(r => r.id === selectedBooking.roomId)?.number || 'Unknown'} - 
                  {rooms.find(r => r.id === selectedBooking.roomId)?.type || 'Unknown'}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="border rounded p-2 mt-1 capitalize">
                    {selectedBooking.status.replace('_', ' ')}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Payment</label>
                  <div className="border rounded p-2 mt-1 capitalize">
                    {selectedBooking.paymentStatus.replace('_', ' ')}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Adults</label>
                  <div className="border rounded p-2 mt-1">
                    {selectedBooking.adults}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Children</label>
                  <div className="border rounded p-2 mt-1">
                    {selectedBooking.children}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Guest Information</label>
                <div className="border rounded p-2 mt-1 space-y-1">
                  <div>{selectedBooking.guest.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedBooking.guest.email}</div>
                  <div className="text-sm text-muted-foreground">{selectedBooking.guest.phone}</div>
                  {selectedBooking.guest.address && (
                    <div className="text-sm text-muted-foreground">{selectedBooking.guest.address}</div>
                  )}
                </div>
              </div>
              
              {selectedBooking.specialRequests && (
                <div>
                  <label className="text-sm font-medium">Special Requests</label>
                  <div className="border rounded p-2 mt-1 text-sm">
                    {selectedBooking.specialRequests}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm font-medium">
                Total: {formatCurrency(selectedBooking.totalAmount)}
              </div>
              <div className="text-xs text-muted-foreground">
                Created: {formatDateTime(selectedBooking.createdAt)}
              </div>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
