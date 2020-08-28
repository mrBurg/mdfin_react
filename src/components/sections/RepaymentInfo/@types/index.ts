export type TData = {
  text?: string;
  list?: Array<string>;
};

export type TDataList = {
  title: string;
} & TData;

export type TRepaymentInfoProps = {
  dataList: Array<TDataList>;
};
