
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Booking, formatCurrency, getStatusColorClass, getStatusDisplayName } from "@/lib/data";
import { format } from "date-fns";
import { CheckCircle, XCircle, Clock, ArrowUpDown } from "lucide-react";

interface BookingTableProps {
  bookings: Booking[];
}

export function BookingTable({ bookings }: BookingTableProps) {
  const [sortField, setSortField] = useState<keyof Booking>("checkIn");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: keyof Booking) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedBookings = [...bookings].sort((a, b) => {
    // Special handling for dates and nested objects
    if (sortField === "checkIn" || sortField === "checkOut") {
      const dateA = new Date(a[sortField]);
      const dateB = new Date(b[sortField]);
      return sortDirection === "asc" 
        ? dateA.getTime() - dateB.getTime() 
        : dateB.getTime() - dateA.getTime();
    } 
    
    if (sortField === "guestId") {
      const nameA = a.guest.name;
      const nameB = b.guest.name;
      return sortDirection === "asc" 
        ? nameA.localeCompare(nameB) 
        : nameB.localeCompare(nameA);
    }
    
    // Handle other fields
    if (typeof a[sortField] === "string" && typeof b[sortField] === "string") {
      return sortDirection === "asc" 
        ? (a[sortField] as string).localeCompare(b[sortField] as string) 
        : (b[sortField] as string).localeCompare(a[sortField] as string);
    }
    
    // Handle numeric fields
    if (typeof a[sortField] === "number" && typeof b[sortField] === "number") {
      return sortDirection === "asc" 
        ? (a[sortField] as number) - (b[sortField] as number) 
        : (b[sortField] as number) - (a[sortField] as number);
    }
    
    return 0;
  });

  const getSortIcon = (field: keyof Booking) => {
    if (sortField === field) {
      return <ArrowUpDown className={cn(
        "ml-1 h-4 w-4 transition-transform duration-200",
        sortDirection === "desc" ? "rotate-180" : ""
      )} />;
    }
    return <ArrowUpDown className="ml-1 h-4 w-4 opacity-20" />;
  };

  const getActionButton = (booking: Booking) => {
    switch (booking.status) {
      case "confirmed":
        return (
          <button 
            className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Check In
          </button>
        );
      case "checked_in":
        return (
          <button 
            className="px-3 py-1 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 transition-colors"
          >
            Check Out
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border border-border overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th 
                className="text-left py-3 px-4 font-medium text-muted-foreground text-sm cursor-pointer hover:text-foreground"
                onClick={() => handleSort("guestId")}
              >
                <div className="flex items-center">
                  Guest {getSortIcon("guestId")}
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-muted-foreground text-sm cursor-pointer hover:text-foreground"
                onClick={() => handleSort("roomId")}
              >
                <div className="flex items-center">
                  Room {getSortIcon("roomId")}
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-muted-foreground text-sm cursor-pointer hover:text-foreground"
                onClick={() => handleSort("checkIn")}
              >
                <div className="flex items-center">
                  Check In {getSortIcon("checkIn")}
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-muted-foreground text-sm cursor-pointer hover:text-foreground"
                onClick={() => handleSort("checkOut")}
              >
                <div className="flex items-center">
                  Check Out {getSortIcon("checkOut")}
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-muted-foreground text-sm cursor-pointer hover:text-foreground"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status {getSortIcon("status")}
                </div>
              </th>
              <th 
                className="text-left py-3 px-4 font-medium text-muted-foreground text-sm cursor-pointer hover:text-foreground"
                onClick={() => handleSort("totalAmount")}
              >
                <div className="flex items-center">
                  Amount {getSortIcon("totalAmount")}
                </div>
              </th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-muted/50 transition-colors">
                <td className="py-3 px-4 whitespace-nowrap">
                  <div>
                    <p className="font-medium">{booking.guest.name}</p>
                    <p className="text-sm text-muted-foreground">{booking.guest.email}</p>
                  </div>
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  Room {booking.roomId.replace('room-', '')}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {format(new Date(booking.checkIn), "MMM dd, yyyy")}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {format(new Date(booking.checkOut), "MMM dd, yyyy")}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className={cn("status", getStatusColorClass(booking.status))}>
                    {getStatusDisplayName(booking.status)}
                  </span>
                </td>
                <td className="py-3 px-4 whitespace-nowrap font-medium">
                  {formatCurrency(booking.totalAmount)}
                </td>
                <td className="py-3 px-4 whitespace-nowrap">
                  {getActionButton(booking)}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={7} className="py-6 text-center text-muted-foreground">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
