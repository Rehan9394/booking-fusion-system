
import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrency, getRevenueData } from "@/lib/data";

export function RevenueChart() {
  const data = getRevenueData();

  return (
    <div className="bg-card rounded-lg p-6 shadow-card border border-border/40 h-[400px] animate-fade-in">
      <h3 className="text-lg font-medium mb-6">Revenue (Last 30 Days)</h3>
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
