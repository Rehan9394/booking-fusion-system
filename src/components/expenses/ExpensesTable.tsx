
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Edit, FileText, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Sample data for expenses
const expenses = [
  {
    id: "EXP-001",
    title: "Room Maintenance",
    amount: 450.75,
    category: "Maintenance",
    date: "2023-10-15",
    status: "approved",
    approvedBy: "John Smith",
  },
  {
    id: "EXP-002",
    title: "Cleaning Supplies",
    amount: 325.50,
    category: "Supplies",
    date: "2023-10-18",
    status: "approved",
    approvedBy: "Jane Doe",
  },
  {
    id: "EXP-003",
    title: "Electricity Bill",
    amount: 1250.00,
    category: "Utilities",
    date: "2023-10-20",
    status: "pending",
    approvedBy: null,
  },
  {
    id: "EXP-004",
    title: "Internet Service",
    amount: 199.99,
    category: "Utilities",
    date: "2023-10-22",
    status: "pending",
    approvedBy: null,
  },
  {
    id: "EXP-005",
    title: "Staff Salaries",
    amount: 8500.00,
    category: "Salary",
    date: "2023-10-25",
    status: "approved",
    approvedBy: "John Smith",
  },
  {
    id: "EXP-006",
    title: "Facebook Ads",
    amount: 750.00,
    category: "Marketing",
    date: "2023-10-28",
    status: "pending",
    approvedBy: null,
  },
];

interface ExpensesTableProps {
  filter?: "all" | "recent" | "pending" | "approved";
}

export function ExpensesTable({ filter = "all" }: ExpensesTableProps) {
  // Filter expenses based on the filter type
  const filteredExpenses = React.useMemo(() => {
    switch (filter) {
      case "recent":
        return [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
      case "pending":
        return expenses.filter((expense) => expense.status === "pending");
      case "approved":
        return expenses.filter((expense) => expense.status === "approved");
      default:
        return expenses;
    }
  }, [filter]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredExpenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                No expenses found
              </TableCell>
            </TableRow>
          ) : (
            filteredExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.id}</TableCell>
                <TableCell>{expense.title}</TableCell>
                <TableCell>${expense.amount.toFixed(2)}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell>{formatDate(new Date(expense.date))}</TableCell>
                <TableCell>
                  <Badge 
                    variant={expense.status === "approved" ? "outline" : "secondary"}
                    className={
                      expense.status === "approved" 
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }
                  >
                    {expense.status === "approved" ? "Approved" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" title="View Receipt">
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Edit">
                    <Edit className="h-4 w-4" />
                  </Button>
                  {expense.status === "pending" && (
                    <Button variant="ghost" size="icon" title="Approve">
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
