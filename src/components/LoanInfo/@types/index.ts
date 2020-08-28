export type TItem = {
  text: string;
  value: string;
  link?: string;
};

export type TLoanInfoProps = {
  title: string;
  tableData: Array<TItem>;
  className?: string;
};
