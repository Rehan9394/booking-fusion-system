
import React, { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Plus, List, Grid as GridIcon, FileText, Edit } from "lucide-react";
import { RoomGrid } from "./RoomGrid";
import { RoomList } from "./RoomList";
import { Room, Bed, rooms as mockRooms } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { RoomDetails } from "./RoomDetails";

export function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>(mockRooms);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isRoomDetailsOpen, setIsRoomDetailsOpen] = useState(false);
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  
  // New room form state
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    number: "",
    type: "standard",
    capacity: 2,
    basePrice: 0,
    status: "available",
    floor: 1,
    amenities: [],
    description: "",
    size: 0,
    beds: []
  });

  useEffect(() => {
    let filtered = [...rooms];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (room) =>
          room.number.toLowerCase().includes(query) ||
          room.type.toLowerCase().includes(query) ||
          room.amenities.some(amenity => amenity.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((room) => room.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((room) => room.type === typeFilter);
    }

    setFilteredRooms(filtered);
  }, [rooms, searchQuery, statusFilter, typeFilter]);

  // Handle room details view
  const handleViewRoomDetails = (room: Room) => {
    setSelectedRoom(room);
    setIsRoomDetailsOpen(true);
  };

  // Handle room edit
  const handleEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setNewRoom({
      ...room
    });
    setIsEditRoomOpen(true);
  };

  // Handle input changes for the room form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRoom(prev => ({
      ...prev,
      [name]: name === "basePrice" || name === "size" || name === "capacity" || name === "floor" ? 
        parseFloat(value) || 0 : value
    }));
  };

  // Handle select changes for the room form
  const handleSelectChange = (name: string, value: any) => {
    setNewRoom(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle amenities selection
  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setNewRoom(prev => ({
        ...prev,
        amenities: [...(prev.amenities || []), value]
      }));
    } else {
      setNewRoom(prev => ({
        ...prev,
        amenities: (prev.amenities || []).filter(amenity => amenity !== value)
      }));
    }
  };

  // Add new room
  const handleAddRoom = () => {
    // Validate required fields
    if (!newRoom.number || !newRoom.type || newRoom.basePrice === undefined || newRoom.basePrice <= 0) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill all required fields with valid values.",
        variant: "destructive"
      });
      return;
    }

    // Check if room number already exists
    if (rooms.some(room => room.number === newRoom.number && (isAddRoomOpen || room.id !== selectedRoom?.id))) {
      toast({
        title: "Room Number Already Exists",
        description: "Please use a different room number.",
        variant: "destructive"
      });
      return;
    }

    if (isAddRoomOpen) {
      // Create new room
      const newRoomObj: Room = {
        id: `room-${Date.now()}`,
        number: newRoom.number || "",
        type: newRoom.type || "standard",
        capacity: newRoom.capacity || 2,
        basePrice: newRoom.basePrice || 0,
        status: newRoom.status || "available",
        floor: newRoom.floor || 1,
        amenities: newRoom.amenities || [],
        size: newRoom.size || 0,
        beds: newRoom.beds || [],
        description: newRoom.description || "",
        images: []
      };

      // Add to rooms list
      setRooms(prev => [...prev, newRoomObj]);
      
      toast({
        title: "Room Added",
        description: "The room has been successfully added."
      });
    } else if (isEditRoomOpen && selectedRoom) {
      // Update existing room
      setRooms(prev => 
        prev.map(room => 
          room.id === selectedRoom.id ? { 
            ...room, 
            number: newRoom.number || room.number,
            type: newRoom.type || room.type,
            capacity: newRoom.capacity || room.capacity,
            basePrice: newRoom.basePrice || room.basePrice,
            status: newRoom.status || room.status,
            floor: newRoom.floor || room.floor,
            amenities: newRoom.amenities || room.amenities,
            size: newRoom.size,
            beds: newRoom.beds,
            description: newRoom.description
          } : room
        )
      );
      
      toast({
        title: "Room Updated",
        description: "The room has been successfully updated."
      });
    }

    // Close dialog and reset form
    setIsAddRoomOpen(false);
    setIsEditRoomOpen(false);
    setNewRoom({
      number: "",
      type: "standard",
      capacity: 2,
      basePrice: 0,
      status: "available",
      floor: 1,
      amenities: [],
      size: 0,
      beds: [],
      description: ""
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Rooms</h1>
        <button 
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
          onClick={() => setIsAddRoomOpen(true)}
        >
          <Plus className="h-4 w-4" /> Add Room
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search room number, type or amenities..."
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
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="cleaning">Cleaning</option>
            <option value="maintenance">Maintenance</option>
            <option value="out_of_order">Out of Order</option>
          </select>

          <select
            className="px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="standard">Standard</option>
            <option value="deluxe">Deluxe</option>
            <option value="suite">Suite</option>
            <option value="presidential">Presidential</option>
          </select>

          <div className="flex rounded-md overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 flex items-center transition-colors ${
                viewMode === "grid"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <GridIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 flex items-center transition-colors ${
                viewMode === "list"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <RoomGrid 
          rooms={filteredRooms} 
          onViewDetails={handleViewRoomDetails}
          onEditRoom={handleEditRoom}
        />
      ) : (
        <RoomList 
          rooms={filteredRooms} 
          onViewDetails={handleViewRoomDetails}
          onEditRoom={handleEditRoom}
        />
      )}

      {/* Add/Edit Room Dialog */}
      <Dialog 
        open={isAddRoomOpen || isEditRoomOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setIsAddRoomOpen(false);
            setIsEditRoomOpen(false);
          }
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{isAddRoomOpen ? "Add New Room" : "Edit Room"}</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Basic Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="number">Room Number <span className="text-red-500">*</span></Label>
                <Input
                  id="number"
                  name="number"
                  placeholder="e.g. 101"
                  value={newRoom.number}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Room Type <span className="text-red-500">*</span></Label>
                <Select 
                  value={newRoom.type} 
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="deluxe">Deluxe</SelectItem>
                    <SelectItem value="suite">Suite</SelectItem>
                    <SelectItem value="presidential">Presidential</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price (per night) <span className="text-red-500">*</span></Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="basePrice"
                    name="basePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    className="pl-7"
                    placeholder="0.00"
                    value={newRoom.basePrice || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newRoom.status} 
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="occupied">Occupied</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="out_of_order">Out of Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Room Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Room Details</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="floor">Floor</Label>
                  <Input
                    id="floor"
                    name="floor"
                    type="number"
                    min="1"
                    value={newRoom.floor || ""}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    min="1"
                    value={newRoom.capacity || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="size">Size (sq ft)</Label>
                <Input
                  id="size"
                  name="size"
                  type="number"
                  min="0"
                  value={newRoom.size || ""}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={newRoom.description || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            {/* Amenities */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-lg font-medium border-b pb-2">Amenities</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  "Wi-Fi", "TV", "Air conditioning", "Mini bar", "Safe", "Balcony",
                  "Ocean view", "Bathtub", "Shower", "Coffee machine", "Fridge", "Iron"
                ].map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`amenity-${amenity}`}
                      value={amenity}
                      checked={(newRoom.amenities || []).includes(amenity)}
                      onChange={handleAmenitiesChange}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor={`amenity-${amenity}`} className="text-sm">{amenity}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => {
              setIsAddRoomOpen(false);
              setIsEditRoomOpen(false);
            }}>
              Cancel
            </Button>
            <Button onClick={handleAddRoom}>
              {isAddRoomOpen ? "Add Room" : "Update Room"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Room Details Dialog */}
      {selectedRoom && (
        <RoomDetails
          room={selectedRoom}
          isOpen={isRoomDetailsOpen}
          onClose={() => setIsRoomDetailsOpen(false)}
          onEdit={() => {
            setIsRoomDetailsOpen(false);
            handleEditRoom(selectedRoom);
          }}
        />
      )}
    </div>
  );
}
