
// Mock data for the hotel PMS
import { subDays, addDays, format } from "date-fns";

// Guest statuses
export type BookingStatus = "confirmed" | "checked_in" | "checked_out" | "cancelled" | "no_show";

// Room statuses
export type RoomStatus = "available" | "occupied" | "cleaning" | "maintenance" | "out_of_order";

// Room types
export type RoomType = "standard" | "deluxe" | "suite" | "presidential";

// Guest interface
export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  notes?: string;
}

// Booking interface
export interface Booking {
  id: string;
  roomId: string;
  guestId: string;
  checkIn: string;
  checkOut: string;
  status: BookingStatus;
  totalAmount: number;
  paymentStatus: "paid" | "partially_paid" | "unpaid";
  createdAt: string;
  updatedAt: string;
  adults: number;
  children: number;
  specialRequests?: string;
  guest: Guest;
}

// Room interface
export interface Room {
  id: string;
  number: string;
  type: RoomType;
  status: RoomStatus;
  basePrice: number;
  capacity: number;
  amenities: string[];
  floor: number;
  notes?: string;
}

// Dashboard metrics
export interface DashboardMetrics {
  occupancyRate: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  revenue: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  upcomingBookings: number;
  pendingCleanings: number;
}

// Mock rooms
export const rooms: Room[] = [
  {
    id: "room-1",
    number: "101",
    type: "standard",
    status: "available",
    basePrice: 99,
    capacity: 2,
    amenities: ["WiFi", "TV", "Air conditioning"],
    floor: 1,
  },
  {
    id: "room-2",
    number: "102",
    type: "standard",
    status: "occupied",
    basePrice: 99,
    capacity: 2,
    amenities: ["WiFi", "TV", "Air conditioning"],
    floor: 1,
  },
  {
    id: "room-3",
    number: "103",
    type: "deluxe",
    status: "cleaning",
    basePrice: 149,
    capacity: 2,
    amenities: ["WiFi", "TV", "Air conditioning", "Mini bar", "Ocean view"],
    floor: 1,
  },
  {
    id: "room-4",
    number: "201",
    type: "deluxe",
    status: "available",
    basePrice: 149,
    capacity: 3,
    amenities: ["WiFi", "TV", "Air conditioning", "Mini bar", "Ocean view"],
    floor: 2,
  },
  {
    id: "room-5",
    number: "202",
    type: "suite",
    status: "maintenance",
    basePrice: 249,
    capacity: 4,
    amenities: ["WiFi", "TV", "Air conditioning", "Mini bar", "Ocean view", "Balcony", "Kitchenette"],
    floor: 2,
    notes: "Maintenance scheduled until 07/25",
  },
  {
    id: "room-6",
    number: "301",
    type: "presidential",
    status: "available",
    basePrice: 499,
    capacity: 4,
    amenities: ["WiFi", "TV", "Air conditioning", "Mini bar", "Ocean view", "Balcony", "Kitchenette", "Private pool", "Butler service"],
    floor: 3,
  },
  {
    id: "room-7",
    number: "104",
    type: "standard",
    status: "available",
    basePrice: 99,
    capacity: 2,
    amenities: ["WiFi", "TV", "Air conditioning"],
    floor: 1,
  },
  {
    id: "room-8",
    number: "105",
    type: "standard",
    status: "occupied",
    basePrice: 99,
    capacity: 2,
    amenities: ["WiFi", "TV", "Air conditioning"],
    floor: 1,
  },
  {
    id: "room-9",
    number: "106",
    type: "deluxe",
    status: "out_of_order",
    basePrice: 149,
    capacity: 2,
    amenities: ["WiFi", "TV", "Air conditioning", "Mini bar", "Ocean view"],
    floor: 1,
    notes: "Flood damage, estimated repair completion on 08/15",
  },
  {
    id: "room-10",
    number: "203",
    type: "deluxe",
    status: "available",
    basePrice: 149,
    capacity: 3,
    amenities: ["WiFi", "TV", "Air conditioning", "Mini bar", "Mountain view"],
    floor: 2,
  },
  {
    id: "room-11",
    number: "204",
    type: "suite",
    status: "occupied",
    basePrice: 249,
    capacity: 4,
    amenities: ["WiFi", "TV", "Air conditioning", "Mini bar", "Mountain view", "Balcony", "Kitchenette"],
    floor: 2,
  },
  {
    id: "room-12",
    number: "302",
    type: "presidential",
    status: "available",
    basePrice: 499,
    capacity: 4,
    amenities: ["WiFi", "TV", "Air conditioning", "Mini bar", "Ocean view", "Balcony", "Kitchenette", "Private pool", "Butler service"],
    floor: 3,
  },
];

// Mock guests
export const guests: Guest[] = [
  {
    id: "guest-1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
  },
  {
    id: "guest-2",
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    phone: "+1 (555) 234-5678",
    address: "456 Oak Ave, Los Angeles, CA 90001",
  },
  {
    id: "guest-3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "+1 (555) 345-6789",
  },
  {
    id: "guest-4",
    name: "Sarah Davis",
    email: "sarah.davis@example.com",
    phone: "+1 (555) 456-7890",
    address: "789 Pine St, Chicago, IL 60007",
    notes: "Allergic to nuts, prefers high floor",
  },
  {
    id: "guest-5",
    name: "David Wilson",
    email: "david.wilson@example.com",
    phone: "+1 (555) 567-8901",
  },
  {
    id: "guest-6",
    name: "Jennifer Taylor",
    email: "jennifer.taylor@example.com",
    phone: "+1 (555) 678-9012",
    address: "101 Maple Dr, Miami, FL 33101",
  },
];

// Generate today's date
const today = new Date();

// Mock bookings
export const bookings: Booking[] = [
  {
    id: "booking-1",
    roomId: "room-2",
    guestId: "guest-1",
    checkIn: format(subDays(today, 1), "yyyy-MM-dd"),
    checkOut: format(addDays(today, 2), "yyyy-MM-dd"),
    status: "checked_in",
    totalAmount: 297,
    paymentStatus: "paid",
    createdAt: format(subDays(today, 10), "yyyy-MM-dd"),
    updatedAt: format(today, "yyyy-MM-dd"),
    adults: 2,
    children: 0,
    guest: guests[0],
  },
  {
    id: "booking-2",
    roomId: "room-8",
    guestId: "guest-2",
    checkIn: format(subDays(today, 2), "yyyy-MM-dd"),
    checkOut: format(addDays(today, 1), "yyyy-MM-dd"),
    status: "checked_in",
    totalAmount: 297,
    paymentStatus: "paid",
    createdAt: format(subDays(today, 15), "yyyy-MM-dd"),
    updatedAt: format(today, "yyyy-MM-dd"),
    adults: 2,
    children: 0,
    guest: guests[1],
  },
  {
    id: "booking-3",
    roomId: "room-11",
    guestId: "guest-3",
    checkIn: format(subDays(today, 3), "yyyy-MM-dd"),
    checkOut: format(addDays(today, 3), "yyyy-MM-dd"),
    status: "checked_in",
    totalAmount: 1494,
    paymentStatus: "paid",
    createdAt: format(subDays(today, 20), "yyyy-MM-dd"),
    updatedAt: format(today, "yyyy-MM-dd"),
    adults: 2,
    children: 2,
    specialRequests: "Extra pillows, late checkout",
    guest: guests[2],
  },
  {
    id: "booking-4",
    roomId: "room-1",
    guestId: "guest-4",
    checkIn: format(addDays(today, 1), "yyyy-MM-dd"),
    checkOut: format(addDays(today, 5), "yyyy-MM-dd"),
    status: "confirmed",
    totalAmount: 396,
    paymentStatus: "partially_paid",
    createdAt: format(subDays(today, 5), "yyyy-MM-dd"),
    updatedAt: format(subDays(today, 5), "yyyy-MM-dd"),
    adults: 1,
    children: 0,
    guest: guests[3],
  },
  {
    id: "booking-5",
    roomId: "room-6",
    guestId: "guest-5",
    checkIn: format(addDays(today, 3), "yyyy-MM-dd"),
    checkOut: format(addDays(today, 10), "yyyy-MM-dd"),
    status: "confirmed",
    totalAmount: 3493,
    paymentStatus: "unpaid",
    createdAt: format(subDays(today, 2), "yyyy-MM-dd"),
    updatedAt: format(subDays(today, 2), "yyyy-MM-dd"),
    adults: 2,
    children: 2,
    specialRequests: "Airport pickup, champagne on arrival",
    guest: guests[4],
  },
  {
    id: "booking-6",
    roomId: "room-4",
    guestId: "guest-6",
    checkIn: format(addDays(today, 2), "yyyy-MM-dd"),
    checkOut: format(addDays(today, 4), "yyyy-MM-dd"),
    status: "confirmed",
    totalAmount: 298,
    paymentStatus: "paid",
    createdAt: format(subDays(today, 7), "yyyy-MM-dd"),
    updatedAt: format(subDays(today, 7), "yyyy-MM-dd"),
    adults: 2,
    children: 1,
    guest: guests[5],
  },
  {
    id: "booking-7",
    roomId: "room-3",
    guestId: "guest-1",
    checkIn: format(subDays(today, 7), "yyyy-MM-dd"),
    checkOut: format(subDays(today, 2), "yyyy-MM-dd"),
    status: "checked_out",
    totalAmount: 745,
    paymentStatus: "paid",
    createdAt: format(subDays(today, 30), "yyyy-MM-dd"),
    updatedAt: format(subDays(today, 2), "yyyy-MM-dd"),
    adults: 2,
    children: 0,
    guest: guests[0],
  },
  {
    id: "booking-8",
    roomId: "room-7",
    guestId: "guest-2",
    checkIn: format(subDays(today, 10), "yyyy-MM-dd"),
    checkOut: format(subDays(today, 8), "yyyy-MM-dd"),
    status: "checked_out",
    totalAmount: 198,
    paymentStatus: "paid",
    createdAt: format(subDays(today, 45), "yyyy-MM-dd"),
    updatedAt: format(subDays(today, 8), "yyyy-MM-dd"),
    adults: 1,
    children: 0,
    guest: guests[1],
  },
  {
    id: "booking-9",
    roomId: "room-5",
    guestId: "guest-3",
    checkIn: format(addDays(today, 5), "yyyy-MM-dd"),
    checkOut: format(addDays(today, 12), "yyyy-MM-dd"),
    status: "confirmed",
    totalAmount: 1743,
    paymentStatus: "unpaid",
    createdAt: format(subDays(today, 3), "yyyy-MM-dd"),
    updatedAt: format(subDays(today, 3), "yyyy-MM-dd"),
    adults: 2,
    children: 1,
    specialRequests: "Early check-in requested",
    guest: guests[2],
  },
  {
    id: "booking-10",
    roomId: "room-10",
    guestId: "guest-4",
    checkIn: format(addDays(today, 4), "yyyy-MM-dd"),
    checkOut: format(addDays(today, 6), "yyyy-MM-dd"),
    status: "confirmed",
    totalAmount: 298,
    paymentStatus: "partially_paid",
    createdAt: format(subDays(today, 1), "yyyy-MM-dd"),
    updatedAt: format(subDays(today, 1), "yyyy-MM-dd"),
    adults: 2,
    children: 0,
    guest: guests[3],
  },
];

// Dashboard metrics
export const getDashboardMetrics = (): DashboardMetrics => {
  // Calculate occupancy rates
  const totalRooms = rooms.length;
  const occupiedToday = rooms.filter(room => room.status === "occupied").length;
  const occupancyRateToday = (occupiedToday / totalRooms) * 100;
  
  // Weekly and monthly rates (mocked for this example)
  const occupancyRateWeek = 78.5;
  const occupancyRateMonth = 82.3;
  
  // Calculate revenue (based on current bookings)
  const revenueToday = bookings
    .filter(booking => booking.status === "checked_in" || booking.status === "checked_out")
    .reduce((sum, booking) => sum + booking.totalAmount / 3, 0); // Divide by avg stay length for daily estimate
  
  // Weekly and monthly revenue (mocked with multipliers)
  const revenueWeek = revenueToday * 7;
  const revenueMonth = revenueToday * 30;
  
  // Count upcoming bookings (next 7 days)
  const upcomingBookings = bookings.filter(booking => {
    const checkInDate = new Date(booking.checkIn);
    const sevenDaysFromNow = addDays(today, 7);
    return booking.status === "confirmed" && checkInDate <= sevenDaysFromNow && checkInDate >= today;
  }).length;
  
  // Count pending cleanings
  const pendingCleanings = rooms.filter(room => room.status === "cleaning").length;
  
  return {
    occupancyRate: {
      today: occupancyRateToday,
      thisWeek: occupancyRateWeek,
      thisMonth: occupancyRateMonth,
    },
    revenue: {
      today: revenueToday,
      thisWeek: revenueWeek,
      thisMonth: revenueMonth,
    },
    upcomingBookings,
    pendingCleanings,
  };
};

// Sample occupancy data for charts
export const getOccupancyData = () => {
  const today = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const date = format(subDays(today, 29 - i), "MMM dd");
    // Create some variation in the data
    const occupancyRate = 50 + Math.floor(Math.random() * 40);
    return { date, occupancyRate };
  });
};

// Sample revenue data for charts
export const getRevenueData = () => {
  const today = new Date();
  return Array.from({ length: 30 }, (_, i) => {
    const date = format(subDays(today, 29 - i), "MMM dd");
    // Create some variation in the data with an upward trend
    const baseRevenue = 500 + i * 20;
    const revenue = baseRevenue + Math.floor(Math.random() * 300);
    return { date, revenue };
  });
};

// Helper to get status display name with proper capitalization
export const getStatusDisplayName = (status: BookingStatus | RoomStatus): string => {
  return status.split('_').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Helper to get status color class
export const getStatusColorClass = (status: BookingStatus | RoomStatus): string => {
  switch (status) {
    case "confirmed":
    case "available":
      return "status-success";
    case "checked_in":
    case "occupied":
      return "status-info";
    case "checked_out":
      return "status-neutral";
    case "cancelled":
    case "no_show":
    case "out_of_order":
      return "status-error";
    case "cleaning":
    case "maintenance":
      return "status-warning";
    default:
      return "status-neutral";
  }
};

// Helper to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Helper to get room type display name
export const getRoomTypeDisplayName = (type: RoomType): string => {
  switch (type) {
    case "standard":
      return "Standard Room";
    case "deluxe":
      return "Deluxe Room";
    case "suite":
      return "Suite";
    case "presidential":
      return "Presidential Suite";
    default:
      return type;
  }
};
