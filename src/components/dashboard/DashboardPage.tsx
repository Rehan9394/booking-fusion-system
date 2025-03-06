
import React, { useState } from "react";
import { ArrowDownRight, ArrowUpRight, BadgePercent, Banknote, CalendarClock, CheckCircle } from "lucide-react";
import { MetricCard } from "./MetricCard";
import { OccupancyChart } from "./OccupancyChart";
import { RevenueChart } from "./RevenueChart";
import { formatCurrency, getDashboardMetrics, bookings } from "@/lib/data";
import { format, isFuture, parseISO } from "date-fns";

type TimeFilter = "today" | "yesterday" | "last7days" | "last30days" | "thisMonth" | "lastMonth";

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
          value={`${metrics.occupancyRate.toFixed(1)}%`}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OccupancyChart timeFilter={timeFilter} />
        <RevenueChart timeFilter={timeFilter} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg shadow-card border border-border/40 lg:col-span-2 animate-fade-in">
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

        <div className="bg-card rounded-lg shadow-card border border-border/40 p-6 animate-fade-in">
          <h3 className="text-lg font-medium mb-4">Monthly Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-muted-foreground">Occupancy Rate</span>
              <span className="font-medium">{metrics.occupancyRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-muted-foreground">Total Revenue</span>
              <span className="font-medium">{formatCurrency(metrics.revenue)}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <span className="text-muted-foreground">Avg. Daily Rate</span>
              <span className="font-medium">{formatCurrency(metrics.revenue / 30)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Total Bookings</span>
              <span className="font-medium">35</span>
            </div>
          </div>
          <div className="mt-6">
            <button className="text-sm text-primary hover:underline transition-all">
              View full report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
