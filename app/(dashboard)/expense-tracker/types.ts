export interface Expense {
  id?: string;
  uid: string;
  amount: number;
  category: string;
  date: Date;
  description: string;
  createdAt?: Date;
}

export interface ExpenseFilters {
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
  category?: string;
}

export type SortField = "date" | "amount";
export type SortOrder = "asc" | "desc";

export interface ExpenseSorting {
  field: SortField;
  order: SortOrder;
}
