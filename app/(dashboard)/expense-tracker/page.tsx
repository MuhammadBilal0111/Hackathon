"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Wallet, RefreshCw } from "lucide-react";
import ExpenseFormModal from "./components/expense-form-modal";
import ExpenseChart from "./components/expense-chart";
import ExpenseList from "./components/expense-list";
import { Expense } from "./types";
import {
  getExpenses,
  Expense as FirebaseExpense,
} from "@/lib/firebase-expenses";
import { toast } from "sonner";

export default function ExpenseTrackerPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem("user");

      if (!userStr) {
        toast.error("Please login to view expenses");
        setExpenses([]);
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user.uid;

      const data = await getExpenses(userId);
      // Convert Firestore data to component type
      const convertedData: Expense[] = data.map((expense) => ({
        id: expense.id,
        uid: expense.uid,
        amount: expense.amount,
        category: expense.category,
        date: expense.date instanceof Date ? expense.date : new Date(),
        description: expense.description || "",
        createdAt:
          expense.createdAt instanceof Date ? expense.createdAt : undefined,
      }));
      setExpenses(convertedData);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-linear-to-br from-green-500 to-green-600 rounded-2xl shadow-lg shadow-green-500/30">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Expense Tracker
              </h1>
              <p className="text-gray-500 mt-1">
                Manage and monitor your farming expenses
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={fetchExpenses}
              disabled={loading}
              className="h-12 px-6 rounded-xl border-gray-200 hover:bg-white shadow-sm"
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              onClick={() => setModalOpen(true)}
              className="h-12 px-6 rounded-xl bg-linear-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold shadow-lg shadow-green-500/30 transition-all"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>

        {loading && expenses.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-3">
              <RefreshCw className="h-12 w-12 text-green-600 animate-spin mx-auto" />
              <p className="text-gray-500 font-medium">Loading expenses...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Chart */}
            <ExpenseChart expenses={expenses} />

            {/* Expense List */}
            <ExpenseList expenses={expenses} onExpenseDeleted={fetchExpenses} />
          </>
        )}

        {/* Add Expense Modal */}
        <ExpenseFormModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          onExpenseAdded={fetchExpenses}
        />
      </div>
    </div>
  );
}
