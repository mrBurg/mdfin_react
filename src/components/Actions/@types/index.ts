export type TActionsProps = {
  className?: string;
} & TActionsState;

export type TActionsState = {
  amount: string;
  extensionAmount: number;
  closingAmount: number;
};
