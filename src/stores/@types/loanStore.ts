export type TProductSelectorData = {
  productId?: number;
  amount?: number;
  term?: number;
};

export type TLoanData = {
  totalAmount?: number;
  dateTo?: string;
} & TProductSelectorData;
