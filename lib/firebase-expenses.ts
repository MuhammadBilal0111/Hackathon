import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase";

export interface Expense {
  id?: string;
  uid: string;
  amount: number;
  category: string;
  date: Date | Timestamp;
  description: string;
  createdAt?: Date | Timestamp;
}

export const EXPENSE_CATEGORIES = [
  "Seeds",
  "Fertilizer",
  "Pesticides",
  "Labor",
  "Equipment",
  "Irrigation",
  "Transportation",
  "Other",
] as const;

// Add a new expense
export const addExpense = async (
  userId: string,
  expense: Omit<Expense, "id" | "createdAt" | "uid">
) => {
  try {
    const expensesRef = collection(db, "expenses");

    // Clean data object - only include defined values
    const expenseData: any = {
      uid: userId,
      amount: expense.amount,
      category: expense.category,
      date:
        expense.date instanceof Date
          ? Timestamp.fromDate(expense.date)
          : expense.date,
      description: expense.description || "",
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(expensesRef, expenseData);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding expense:", error);
    return { success: false, error };
  }
};

// Get all expenses for a user
export const getExpenses = async (userId: string): Promise<Expense[]> => {
  try {
    const expensesRef = collection(db, "expenses");
    const q = query(expensesRef, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);

    const expenses: Expense[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      // Only include expenses for this user
      if (data.uid === userId) {
        expenses.push({
          id: docSnap.id,
          uid: data.uid,
          amount: data.amount,
          category: data.category,
          date: data.date.toDate(),
          description: data.description || "",
          createdAt: data.createdAt?.toDate(),
        });
      }
    });

    return expenses;
  } catch (error) {
    console.error("Error getting expenses:", error);
    return [];
  }
};

// Update an expense
export const updateExpense = async (
  userId: string,
  expenseId: string,
  updates: Partial<Omit<Expense, "id" | "createdAt" | "uid">>
) => {
  try {
    const expenseRef = doc(db, "expenses", expenseId);
    const updateData: any = { ...updates };

    if (updates.date instanceof Date) {
      updateData.date = Timestamp.fromDate(updates.date);
    }

    // Ensure description is never undefined
    if (updateData.description === undefined) {
      updateData.description = "";
    }

    await updateDoc(expenseRef, updateData);
    return { success: true };
  } catch (error) {
    console.error("Error updating expense:", error);
    return { success: false, error };
  }
};

// Delete an expense
export const deleteExpense = async (userId: string, expenseId: string) => {
  try {
    const expenseRef = doc(db, "expenses", expenseId);
    await deleteDoc(expenseRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting expense:", error);
    return { success: false, error };
  }
};
