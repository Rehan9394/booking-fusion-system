
import React from "react";
import { cn } from "@/lib/utils";
import { Room, getStatusColorClass, getStatusDisplayName, getRoomTypeDisplayName, formatCurrency } from "@/lib/data";
import { BedDouble, Check, AlertCircle, Clock, Ban, Edit, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoomListProps {
  rooms: Room[];
  onViewDetails: (room: Room) => void;
  onEditRoom: (room: Room) => void;
}

export function RoomList({ rooms, onViewDetails, onEditRoom }: RoomListProps) {
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
    <div className="bg-card rounded-lg border border-border overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/40">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Room #</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Capacity</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Floor</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr 
                key={room.id}
                className="border-t border-border hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 text-sm font-medium">{room.number}</td>
                <td className="px-4 py-3 text-sm">{getRoomTypeDisplayName(room.type)}</td>
                <td className="px-4 py-3 text-sm">{room.capacity} {room.capacity === 1 ? 'person' : 'people'}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium", getStatusColorClass(room.status))}>
                    {getStatusIcon(room.status)}
                    {getStatusDisplayName(room.status)}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{room.floor}</td>
                <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(room.basePrice)}</td>
                <td className="px-4 py-3 text-sm text-right">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => onViewDetails(room)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => onEditRoom(room)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  No rooms found. Try adjusting your filters or add a new room.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
