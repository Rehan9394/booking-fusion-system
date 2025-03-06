
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency, getRevenueData } from "@/lib/data";

interface RevenueChartProps {
  timeFilter: string;
}

export function RevenueChart({ timeFilter }: RevenueChartProps) {
  const data = getRevenueData(timeFilter);

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
      <h3 className="text-lg font-medium mb-6">Revenue ({getTitle()})</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
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
            tickFormatter={(value) => `$${value}`}
            tick={{ fontSize: 12 }} 
            tickLine={false}
            axisLine={false}
            tickMargin={10}
          />
          <Tooltip 
            formatter={(value) => [formatCurrency(value as number), 'Revenue']}
            contentStyle={{ borderRadius: '0.5rem' }}
          />
          <Bar 
            dataKey="revenue" 
            fill="url(#revenueGradient)" 
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
