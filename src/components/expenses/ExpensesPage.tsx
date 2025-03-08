
import React, { useState } from "react";
import { 
  Plus, Search, FileText, DollarSign, Filter, SlidersHorizontal, Calendar 
} from "lucide-react";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/data";

// Define expense types
type ExpenseCategory = 
  | "maintenance" 
  | "supplies" 
  | "utilities" 
  | "staff" 
  | "marketing" 
  | "taxes" 
  | "other";

interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  paymentMethod: string;
  receipt?: string;
}

// Sample data
const sampleExpenses: Expense[] = [
  {
    id: "exp-1",
    date: "2025-03-01",
    category: "maintenance",
    amount: 450,
    description: "Plumbing repairs for rooms 101-105",
    paymentMethod: "credit_card"
  },
  {
    id: "exp-2",
    date: "2025-02-28",
    category: "supplies",
    amount: 320.50,
    description: "Guest toiletries and cleaning supplies",
    paymentMethod: "bank_transfer"
  },
  {
    id: "exp-3",
    date: "2025-02-25",
    category: "utilities",
    amount: 1280.75,
    description: "Electricity bill for February",
    paymentMethod: "direct_debit"
  },
  {
    id: "exp-4",
    date: "2025-02-20",
    category: "staff",
    amount: 7500,
    description: "Staff salaries for February",
    paymentMethod: "bank_transfer"
  },
  {
    id: "exp-5",
    date: "2025-02-15",
    category: "marketing",
    amount: 950,
    description: "Social media advertising campaign",
    paymentMethod: "credit_card"
  }
];

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    date: new Date().toISOString().split('T')[0],
    category: "other",
    amount: 0,
    description: "",
    paymentMethod: "credit_card"
  });

  // Filter expenses based on search and category
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      searchQuery === "" || 
      expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Calculate total expenses
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Handle input changes for new expense
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewExpense(prev => ({
      ...prev,
      [name]: name === "amount" ? parseFloat(value) || 0 : value
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setNewExpense(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new expense
  const handleAddExpense = () => {
    if (!newExpense.description || newExpense.amount <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please provide a description and a valid amount.",
        variant: "destructive"
      });
      return;
    }

    const expenseToAdd: Expense = {
      id: `exp-${Date.now()}`,
      date: newExpense.date || new Date().toISOString().split('T')[0],
      category: (newExpense.category as ExpenseCategory) || "other",
      amount: newExpense.amount || 0,
      description: newExpense.description || "",
      paymentMethod: newExpense.paymentMethod || "credit_card"
    };

    setExpenses(prev => [expenseToAdd, ...prev]);
    setIsAddExpenseOpen(false);
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      category: "other",
      amount: 0,
      description: "",
      paymentMethod: "credit_card"
    });

    toast({
      title: "Expense Added",
      description: "The expense has been successfully added."
    });
  };

  // Get display name for category
  const getCategoryDisplayName = (category: ExpenseCategory) => {
    const categoryMap: Record<ExpenseCategory, string> = {
      maintenance: "Maintenance",
      supplies: "Supplies",
      utilities: "Utilities",
      staff: "Staff",
      marketing: "Marketing",
      taxes: "Taxes",
      other: "Other"
    };
    return categoryMap[category] || category;
  };

  // Get display name for payment method
  const getPaymentMethodDisplayName = (method: string) => {
    const methodMap: Record<string, string> = {
      credit_card: "Credit Card",
      debit_card: "Debit Card",
      cash: "Cash",
      bank_transfer: "Bank Transfer",
      direct_debit: "Direct Debit",
      check: "Check",
      other: "Other"
    };
    return methodMap[method] || method;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
        <Button 
          onClick={() => setIsAddExpenseOpen(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add Expense
        </Button>
      </div>

      <div className="bg-card rounded-lg p-4 shadow-sm border border-border/40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-background rounded-md p-4 border border-border/60">
            <div className="text-sm text-muted-foreground">Total Expenses</div>
            <div className="text-2xl font-bold mt-1">{formatCurrency(totalExpenses)}</div>
            <div className="text-xs text-muted-foreground mt-1">Based on current filters</div>
          </div>
          <div className="bg-background rounded-md p-4 border border-border/60">
            <div className="text-sm text-muted-foreground">Top Category</div>
            <div className="text-2xl font-bold mt-1">Utilities</div>
            <div className="text-xs text-muted-foreground mt-1">36% of total expenses</div>
          </div>
          <div className="bg-background rounded-md p-4 border border-border/60">
            <div className="text-sm text-muted-foreground">This Month</div>
            <div className="text-2xl font-bold mt-1">{formatCurrency(10501.25)}</div>
            <div className="text-xs text-muted-foreground mt-1">+12% from last month</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <Input
            type="text"
            placeholder="Search expenses..."
            className="w-full pl-10 pr-4 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="supplies">Supplies</SelectItem>
              <SelectItem value="utilities">Utilities</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="taxes">Taxes</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Date Range</span>
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/40">
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Description</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Payment Method</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Amount</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-sm">{new Date(expense.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                      {getCategoryDisplayName(expense.category)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{expense.description}</td>
                  <td className="px-4 py-3 text-sm">{getPaymentMethodDisplayName(expense.paymentMethod)}</td>
                  <td className="px-4 py-3 text-sm text-right font-medium">{formatCurrency(expense.amount)}</td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex justify-end space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <DollarSign className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No expenses found. Try adjusting your filters or add a new expense.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Dialog */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newExpense.date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    className="pl-7"
                    value={newExpense.amount || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newExpense.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="supplies">Supplies</SelectItem>
                    <SelectItem value="utilities">Utilities</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="taxes">Taxes</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select
                  value={newExpense.paymentMethod}
                  onValueChange={(value) => handleSelectChange("paymentMethod", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="debit_card">Debit Card</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="direct_debit">Direct Debit</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newExpense.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="receipt">Receipt (Optional)</Label>
              <Input id="receipt" type="file" accept="image/*,.pdf" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)}>Cancel</Button>
            <Button onClick={handleAddExpense}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
