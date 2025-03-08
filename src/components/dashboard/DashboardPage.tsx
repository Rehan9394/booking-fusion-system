
import React, { useState } from "react";
import { ArrowDownRight, ArrowUpRight, BadgePercent, Banknote, CalendarClock, CheckCircle, Clock, Tool, AlertCircle, Zap } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { OccupancyChart } from "./OccupancyChart";
import { RevenueChart } from "./RevenueChart";
import { formatCurrency, getDashboardMetrics, bookings } from "@/lib/data";
import { format, isFuture, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";

type TimeFilter = "today" | "yesterday" | "last7days" | "last30days" | "thisMonth" | "lastMonth";

// Sample user activity data
const userActivityData = [
  { id: 1, user: "John Doe", action: "Checked in guest", time: "10 minutes ago" },
  { id: 2, user: "Sarah Johnson", action: "Added new booking", time: "25 minutes ago" },
  { id: 3, user: "Mike Wilson", action: "Updated room status", time: "45 minutes ago" },
  { id: 4, user: "Emma Roberts", action: "Processed payment", time: "1 hour ago" },
  { id: 5, user: "David Lee", action: "Checked out guest", time: "2 hours ago" },
];

// Sample cleaning status data
const cleaningStatusData = [
  { id: 1, room: "101", status: "completed", cleaner: "Alice Brown", time: "09:15 AM" },
  { id: 2, room: "203", status: "in_progress", cleaner: "Tom Smith", time: "10:30 AM" },
  { id: 3, room: "305", status: "pending", cleaner: "Maria Garcia", time: "11:45 AM" },
  { id: 4, room: "410", status: "completed", cleaner: "James Wilson", time: "08:20 AM" },
  { id: 5, room: "512", status: "pending", cleaner: "Emily Chen", time: "01:00 PM" },
];

export function DashboardPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("today");
  const metrics = getDashboardMetrics(timeFilter);
  
  // Get upcoming bookings for the widget
  const upcomingBookingsData = bookings
    .filter(booking => isFuture(parseISO(booking.checkIn)) && booking.status === "confirmed")
    .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime())
    .slice(0, 5);

  const handleTimeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeFilter(e.target.value as TimeFilter);
  };

  // Format title based on the selected time filter
  const getTimeFilterTitle = () => {
    switch(timeFilter) {
      case "today": return "Today";
      case "yesterday": return "Yesterday";
      case "last7days": return "Last 7 Days";
      case "last30days": return "Last 30 Days";
      case "thisMonth": return "This Month";
      case "lastMonth": return "Last Month";
      default: return "Today";
    }
  };

  // Get status icon and color for cleaning status
  const getCleaningStatusInfo = (status: string) => {
    switch(status) {
      case "completed":
        return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, text: "Completed" };
      case "in_progress":
        return { icon: <Clock className="h-4 w-4 text-blue-500" />, text: "In Progress" };
      case "pending":
        return { icon: <AlertCircle className="h-4 w-4 text-amber-500" />, text: "Pending" };
      default:
        return { icon: <AlertCircle className="h-4 w-4 text-gray-500" />, text: "Unknown" };
    }
  };

  // Format occupancy rate to remove decimal places
  const formattedOccupancyRate = Math.round(metrics.occupancyRate);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex space-x-2">
          <select 
            className="px-3 py-2 bg-card text-foreground border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={timeFilter}
            onChange={handleTimeFilterChange}
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="lastMonth">Last Month</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title={`Occupancy Rate (${getTimeFilterTitle()})`}
          value={`${formattedOccupancyRate}%`}
          icon={<BadgePercent className="h-5 w-5" />}
          description={`${getTimeFilterTitle()}'s room occupancy`}
          trend={metrics.occupancyRateTrend}
          className="animate-slide-in-up"
          />
        <MetricCard
          title={`Revenue (${getTimeFilterTitle()})`}
          value={formatCurrency(metrics.revenue)}
          icon={<Banknote className="h-5 w-5" />}
          description={`${getTimeFilterTitle()}'s revenue`}
          trend={metrics.revenueTrend}
          className="animate-slide-in-up [animation-delay:100ms]"
        />
        <MetricCard
          title="Upcoming Bookings"
          value={metrics.upcomingBookings}
          icon={<CalendarClock className="h-5 w-5" />}
          description="Next 7 days"
          trend={metrics.upcomingBookingsTrend}
          className="animate-slide-in-up [animation-delay:200ms]"
        />
        <MetricCard
          title="Pending Cleanings"
          value={metrics.pendingCleanings}
          icon={<CheckCircle className="h-5 w-5" />}
          description="Rooms to be cleaned"
          trend={metrics.pendingCleaningsTrend}
          className="animate-slide-in-up [animation-delay:300ms]"
        />
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-card rounded-lg p-6 border border-border/40 animate-fade-in">
        <Button className="bg-primary/10 text-primary hover:bg-primary/20 flex flex-col items-center justify-center h-24 space-y-2">
          <CalendarClock className="h-6 w-6" />
          <span>New Booking</span>
        </Button>
        <Button className="bg-primary/10 text-primary hover:bg-primary/20 flex flex-col items-center justify-center h-24 space-y-2">
          <CheckCircle className="h-6 w-6" />
          <span>Room Cleaning</span>
        </Button>
        <Button className="bg-primary/10 text-primary hover:bg-primary/20 flex flex-col items-center justify-center h-24 space-y-2">
          <Tool className="h-6 w-6" />
          <span>Maintenance</span>
        </Button>
        <Button className="bg-primary/10 text-primary hover:bg-primary/20 flex flex-col items-center justify-center h-24 space-y-2">
          <Zap className="h-6 w-6" />
          <span>Daily Report</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OccupancyChart timeFilter={timeFilter} />
        <RevenueChart timeFilter={timeFilter} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg shadow-card border border-border/40 lg:col-span-1 animate-fade-in">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Recent User Activity</h3>
            <div className="space-y-4">
              {userActivityData.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-border last:border-0 last:pb-0">
                  <div className="bg-muted rounded-full p-2 mt-0.5">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-card border border-border/40 lg:col-span-1 animate-fade-in">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Room Cleaning Status</h3>
            <div className="space-y-4">
              {cleaningStatusData.map((cleaning) => (
                <div key={cleaning.id} className="flex items-start space-x-3 pb-3 border-b border-border last:border-0 last:pb-0">
                  <div className="bg-muted rounded-full p-2 mt-0.5">
                    {getCleaningStatusInfo(cleaning.status).icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="font-medium text-sm">Room {cleaning.room}</p>
                      <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                        {getCleaningStatusInfo(cleaning.status).text}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{cleaning.cleaner}</p>
                    <p className="text-xs text-muted-foreground mt-1">{cleaning.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-card border border-border/40 animate-fade-in">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Upcoming Bookings</h3>
            <div className="overflow-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left pb-3 px-2 text-muted-foreground font-medium text-sm">Guest</th>
                    <th className="text-left pb-3 px-2 text-muted-foreground font-medium text-sm">Room</th>
                    <th className="text-left pb-3 px-2 text-muted-foreground font-medium text-sm">Check In</th>
                    <th className="text-left pb-3 px-2 text-muted-foreground font-medium text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingBookingsData.map((booking) => (
                    <tr 
                      key={booking.id} 
                      className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
                    >
                      <td className="py-3 px-2">{booking.guest.name}</td>
                      <td className="py-3 px-2">Room {booking.roomId.replace('room-', '')}</td>
                      <td className="py-3 px-2">{format(new Date(booking.checkIn), 'MMM dd, yyyy')}</td>
                      <td className="py-3 px-2">
                        <span className="status status-info">
                          {booking.status === 'confirmed' ? 'Confirmed' : booking.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {upcomingBookingsData.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-muted-foreground">
                        No upcoming bookings
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {upcomingBookingsData.length > 0 && (
              <div className="mt-4">
                <button className="text-sm text-primary hover:underline transition-all">
                  View all bookings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
