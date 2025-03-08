
import React from "react";
import { cn } from "@/lib/utils";
import { Room, getStatusColorClass, getStatusDisplayName, getRoomTypeDisplayName, formatCurrency } from "@/lib/data";
import { BedDouble, Check, AlertCircle, Clock, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoomGridProps {
  rooms: Room[];
  onViewDetails: (room: Room) => void;
  onEditRoom: (room: Room) => void;
}

export function RoomGrid({ rooms, onViewDetails, onEditRoom }: RoomGridProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <Check className="h-4 w-4" />;
      case "occupied":
        return <BedDouble className="h-4 w-4" />;
      case "cleaning":
        return <Clock className="h-4 w-4" />;
      case "maintenance":
        return <AlertCircle className="h-4 w-4" />;
      case "out_of_order":
        return <Ban className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
      {rooms.map((room) => (
        <div 
          key={room.id}
          className={cn(
            "bg-card rounded-lg border border-border overflow-hidden transition-all duration-300 hover:shadow-lg",
            "hover:translate-y-[-2px]"
          )}
        >
          <div className="p-5 border-b border-border">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">Room {room.number}</h3>
              <span className={cn("status flex gap-1 items-center", getStatusColorClass(room.status))}>
                {getStatusIcon(room.status)}
                {getStatusDisplayName(room.status)}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">{getRoomTypeDisplayName(room.type)}</p>
          </div>
          
          <div className="p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Capacity</p>
                <p className="font-medium">{room.capacity} Guests</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-medium">{formatCurrency(room.basePrice)}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-1">Amenities</p>
              <div className="flex flex-wrap gap-1">
                {room.amenities.slice(0, 3).map((amenity, index) => (
                  <span 
                    key={index} 
                    className="inline-block px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
                {room.amenities.length > 3 && (
                  <span className="inline-block px-2 py-0.5 text-xs bg-secondary text-secondary-foreground rounded-full">
                    +{room.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {room.notes && (
              <div className="text-sm text-muted-foreground">
                <p className="text-xs uppercase tracking-wider mb-1">Notes</p>
                <p className="italic">{room.notes}</p>
              </div>
            )}
            
            <div className="mt-4 flex space-x-2">
              <Button 
                className="flex-1 px-3 py-1.5 text-xs bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors"
                onClick={() => onViewDetails(room)}
              >
                Details
              </Button>
              <Button 
                className="flex-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                onClick={() => onEditRoom(room)}
              >
                Edit
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
