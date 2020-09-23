export type TListProps = Array<string>;

export type TItemProps = {
  title: string;
  list: TListProps;
};

export type TContactsProps = {
  [key: string]: TItemProps;
};

export type TIndex = number | string;
