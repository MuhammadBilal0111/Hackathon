"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { EXPENSE_CATEGORIES, addExpense } from "@/lib/firebase-expenses";
import { toast } from "sonner";
import { DollarSign, Calendar, Tag, FileText } from "lucide-react";

interface ExpenseFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseAdded: () => void;
}

export default function ExpenseFormModal({
  open,
  onOpenChange,
  onExpenseAdded,
}: ExpenseFormModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Get user from localStorage
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        toast.error("Please login to add expenses");
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user.uid;

      if (!formData.amount || !formData.category || !formData.date) {
        toast.error("Please fill in all required fields");
        return;
      }

      const result = await addExpense(userId, {
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: new Date(formData.date),
        description: formData.description || "",
      });

      if (result.success) {
        toast.success("Expense added successfully!");
        setFormData({
          amount: "",
          category: "",
          date: new Date().toISOString().split("T")[0],
          description: "",
        });
        onOpenChange(false);
        onExpenseAdded();
      } else {
        toast.error("Failed to add expense");
      }
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-0 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-green-600" />
            </div>
            Add New Expense
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label
              htmlFor="amount"
              className="text-sm font-semibold text-gray-700 flex items-center gap-2"
            >
              <DollarSign className="h-4 w-4 text-gray-500" />
              Amount *
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
              className="rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="category"
              className="text-sm font-semibold text-gray-700 flex items-center gap-2"
            >
              <Tag className="h-4 w-4 text-gray-500" />
              Category *
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger className="rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 h-12 text-base">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-200">
                {EXPENSE_CATEGORIES.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="rounded-lg cursor-pointer hover:bg-green-50"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="date"
              className="text-sm font-semibold text-gray-700 flex items-center gap-2"
            >
              <Calendar className="h-4 w-4 text-gray-500" />
              Date *
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              required
              className="rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 h-12 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-semibold text-gray-700 flex items-center gap-2"
            >
              <FileText className="h-4 w-4 text-gray-500" />
              Description (Optional)
            </Label>
            <Input
              id="description"
              type="text"
              placeholder="Add a note..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500 h-12 text-base"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-xl border-gray-200 hover:bg-gray-50 font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg shadow-green-600/20 transition-all"
            >
              {loading ? "Adding..." : "Add Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
