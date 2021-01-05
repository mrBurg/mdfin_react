export type TData = {
  text?: string;
};

export type TDataList = {
  title: string;
} & TData;

export type TRepaymentInfoProps = {
  dataList: TDataList[];
};
