
import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { getOccupancyData } from "@/lib/data";

interface OccupancyChartProps {
  timeFilter: string;
}

export function OccupancyChart({ timeFilter }: OccupancyChartProps) {
  const data = getOccupancyData(timeFilter);

  const getTitle = () => {
    switch(timeFilter) {
      case "today": return "Today";
      case "yesterday": return "Yesterday";
      case "last7days": return "Last 7 Days";
      case "last30days": return "Last 30 Days";
      case "thisMonth": return "This Month";
      case "lastMonth": return "Last Month";
      default: return "Last 30 Days";
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border/40 h-[400px] animate-fade-in">
      <h3 className="text-lg font-medium mb-6">Occupancy Rate ({getTitle()})</h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="occupancyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickMargin={10}
          />
          <YAxis 
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]} 
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Occupancy Rate']}
            contentStyle={{ borderRadius: '0.5rem' }}
          />
          <Area 
            type="monotone" 
            dataKey="occupancyRate" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2}
            fill="url(#occupancyGradient)"
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
