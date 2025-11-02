"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Expense, ExpenseFilters, ExpenseSorting } from "../types";
import { EXPENSE_CATEGORIES, deleteExpense } from "@/lib/firebase-expenses";
import { toast } from "sonner";
import {
  Trash2,
  Calendar,
  DollarSign,
  Filter,
  ArrowUpDown,
  Tag,
  FileText,
  AlertCircle,
} from "lucide-react";

interface ExpenseListProps {
  expenses: Expense[];
  onExpenseDeleted: () => void;
}

export default function ExpenseList({
  expenses,
  onExpenseDeleted,
}: ExpenseListProps) {
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [sorting, setSorting] = useState<ExpenseSorting>({
    field: "date",
    order: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);

  const filteredAndSortedExpenses = useMemo(() => {
    let filtered = [...expenses];

    // Apply filters
    if (filters.dateFrom) {
      filtered = filtered.filter(
        (expense) => new Date(expense.date) >= new Date(filters.dateFrom!)
      );
    }
    if (filters.dateTo) {
      filtered = filtered.filter(
        (expense) => new Date(expense.date) <= new Date(filters.dateTo!)
      );
    }
    if (filters.amountMin !== undefined) {
      filtered = filtered.filter(
        (expense) => expense.amount >= filters.amountMin!
      );
    }
    if (filters.amountMax !== undefined) {
      filtered = filtered.filter(
        (expense) => expense.amount <= filters.amountMax!
      );
    }
    if (filters.category) {
      filtered = filtered.filter(
        (expense) => expense.category === filters.category
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sorting.field === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sorting.field === "amount") {
        comparison = a.amount - b.amount;
      }
      return sorting.order === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [expenses, filters, sorting]);

  const handleDelete = async (expenseId: string) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        toast.error("Please login");
        return;
      }

      const user = JSON.parse(userStr);
      const result = await deleteExpense(user.uid, expenseId);

      if (result.success) {
        toast.success("Expense deleted successfully!");
        onExpenseDeleted();
      } else {
        toast.error("Failed to delete expense");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error("An error occurred");
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Seeds: "bg-amber-100 text-amber-700",
      Fertilizer: "bg-green-100 text-green-700",
      Pesticides: "bg-red-100 text-red-700",
      Labor: "bg-blue-100 text-blue-700",
      Equipment: "bg-purple-100 text-purple-700",
      Irrigation: "bg-cyan-100 text-cyan-700",
      Transportation: "bg-orange-100 text-orange-700",
      Other: "bg-gray-100 text-gray-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  const totalFiltered = useMemo(() => {
    return filteredAndSortedExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
  }, [filteredAndSortedExpenses]);

  return (
    <Card className="bg-white rounded-2xl border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Expense History
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                {filteredAndSortedExpenses.length} expenses · Total: $
                {totalFiltered.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-xl border-gray-200 hover:bg-gray-50 h-10"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Select
              value={`${sorting.field}-${sorting.order}`}
              onValueChange={(value) => {
                const [field, order] = value.split("-") as [
                  "date" | "amount",
                  "asc" | "desc"
                ];
                setSorting({ field, order });
              }}
            >
              <SelectTrigger className="w-[180px] rounded-xl border-gray-200 h-10">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem
                  value="date-desc"
                  className="rounded-lg cursor-pointer"
                >
                  Date (Newest)
                </SelectItem>
                <SelectItem
                  value="date-asc"
                  className="rounded-lg cursor-pointer"
                >
                  Date (Oldest)
                </SelectItem>
                <SelectItem
                  value="amount-desc"
                  className="rounded-lg cursor-pointer"
                >
                  Amount (High to Low)
                </SelectItem>
                <SelectItem
                  value="amount-asc"
                  className="rounded-lg cursor-pointer"
                >
                  Amount (Low to High)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {showFilters && (
          <div className="mt-6 p-6 bg-gray-50 rounded-xl space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Date From
                </Label>
                <Input
                  type="date"
                  value={filters.dateFrom?.toISOString().split("T")[0] || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      dateFrom: e.target.value
                        ? new Date(e.target.value)
                        : undefined,
                    })
                  }
                  className="rounded-xl border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Date To
                </Label>
                <Input
                  type="date"
                  value={filters.dateTo?.toISOString().split("T")[0] || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      dateTo: e.target.value
                        ? new Date(e.target.value)
                        : undefined,
                    })
                  }
                  className="rounded-xl border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Category
                </Label>
                <Select
                  value={filters.category || "all"}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      category: value === "all" ? undefined : value,
                    })
                  }
                >
                  <SelectTrigger className="rounded-xl border-gray-200">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem
                      value="all"
                      className="rounded-lg cursor-pointer"
                    >
                      All categories
                    </SelectItem>
                    {EXPENSE_CATEGORIES.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                        className="rounded-lg cursor-pointer"
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Min Amount
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={filters.amountMin || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      amountMin: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  className="rounded-xl border-gray-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">
                  Max Amount
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={filters.amountMax || ""}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      amountMax: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                  className="rounded-xl border-gray-200"
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="w-full rounded-xl border-gray-200 hover:bg-white"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {filteredAndSortedExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No expenses found</p>
            <p className="text-sm text-gray-400 mt-1">
              {expenses.length > 0
                ? "Try adjusting your filters"
                : "Add your first expense to get started"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex flex-col items-center gap-1">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Calendar className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {new Date(expense.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                          expense.category
                        )}`}
                      >
                        <Tag className="h-3 w-3" />
                        {expense.category}
                      </span>
                    </div>
                    {expense.description && (
                      <p className="text-sm text-gray-600 truncate">
                        {expense.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-xl font-bold text-gray-900">
                        <DollarSign className="h-5 w-5" />
                        {expense.amount.toFixed(2)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => expense.id && handleDelete(expense.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
