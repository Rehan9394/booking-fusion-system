
import React from "react";
import { Room, getStatusDisplayName, getRoomTypeDisplayName, formatCurrency } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BedDouble, Wifi, Tv, Coffee, ShowerHead, MapPin, Thermometer, CheckCircle } from "lucide-react";

interface RoomDetailsProps {
  room: Room;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export function RoomDetails({ room, isOpen, onClose, onEdit }: RoomDetailsProps) {
  // Function to get icon for amenity
  const getAmenityIcon = (amenity: string) => {
    const amenityLower = amenity.toLowerCase();
    if (amenityLower.includes('wifi')) return <Wifi className="h-4 w-4" />;
    if (amenityLower.includes('tv')) return <Tv className="h-4 w-4" />;
    if (amenityLower.includes('coffee')) return <Coffee className="h-4 w-4" />;
    if (amenityLower.includes('shower') || amenityLower.includes('bathtub')) return <ShowerHead className="h-4 w-4" />;
    if (amenityLower.includes('view')) return <MapPin className="h-4 w-4" />;
    if (amenityLower.includes('air') || amenityLower.includes('heat')) return <Thermometer className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Room {room.number} Details</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div>
            <div className="bg-muted/30 rounded-lg p-6 h-40 flex items-center justify-center">
              <BedDouble className="h-16 w-16 text-muted-foreground" />
            </div>
            
            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-lg font-medium">Overview</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Room Type</p>
                    <p className="font-medium">{getRoomTypeDisplayName(room.type)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">{getStatusDisplayName(room.status)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Floor</p>
                    <p className="font-medium">{room.floor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Size</p>
                    <p className="font-medium">{room.size} sq ft</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium">Capacity & Pricing</h3>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-medium">{room.capacity} Guests</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">{formatCurrency(room.basePrice)}/night</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Description</h3>
              <p className="text-sm mt-2">
                {room.description || "No description available for this room."}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Amenities</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {room.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {getAmenityIcon(amenity)}
                    <span className="text-sm">{amenity}</span>
                  </div>
                ))}
                {room.amenities.length === 0 && (
                  <p className="text-sm text-muted-foreground">No amenities listed.</p>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Bed Configuration</h3>
              <div className="mt-2">
                {room.beds && room.beds.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {room.beds.map((bed, index) => (
                      <li key={index} className="text-sm">
                        {bed.type} ({bed.count})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">Bed configuration not specified.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit}>
            Edit Room
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
