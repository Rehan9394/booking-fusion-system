
import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

// Sample data for expense trends
const data = [
  {
    name: "May",
    Maintenance: 4000,
    Utilities: 2400,
    Supplies: 1200,
    Salary: 8000,
    Marketing: 1800,
    Other: 1000,
  },
  {
    name: "Jun",
    Maintenance: 3500,
    Utilities: 2000,
    Supplies: 1400,
    Salary: 8000,
    Marketing: 2000,
    Other: 800,
  },
  {
    name: "Jul",
    Maintenance: 4200,
    Utilities: 2700,
    Supplies: 1100,
    Salary: 8200,
    Marketing: 1500,
    Other: 1200,
  },
  {
    name: "Aug",
    Maintenance: 3800,
    Utilities: 2300,
    Supplies: 1300,
    Salary: 8000,
    Marketing: 1200,
    Other: 900,
  },
  {
    name: "Sep",
    Maintenance: 4100,
    Utilities: 2500,
    Supplies: 1500,
    Salary: 8500,
    Marketing: 1700,
    Other: 1100,
  },
  {
    name: "Oct",
    Maintenance: 4250,
    Utilities: 2650,
    Supplies: 1350,
    Salary: 8500,
    Marketing: 1900,
    Other: 850,
  },
];

// Define colors for each category
const colors = {
  Maintenance: "#8884d8",
  Utilities: "#82ca9d",
  Supplies: "#ffc658",
  Salary: "#ff8042",
  Marketing: "#0088fe",
  Other: "#00C49F",
};

export function ExpensesChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value: number) => [`$${value.toFixed(2)}`, ""]}
            labelFormatter={(label) => `Month: ${label}`}
          />
          <Legend />
          <Bar dataKey="Maintenance" stackId="a" fill={colors.Maintenance} />
          <Bar dataKey="Utilities" stackId="a" fill={colors.Utilities} />
          <Bar dataKey="Supplies" stackId="a" fill={colors.Supplies} />
          <Bar dataKey="Salary" stackId="a" fill={colors.Salary} />
          <Bar dataKey="Marketing" stackId="a" fill={colors.Marketing} />
          <Bar dataKey="Other" stackId="a" fill={colors.Other} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
