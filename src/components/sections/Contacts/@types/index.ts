export type TContactsItem = {
  list: string[];
  title: string;
  main: number;
};

export type TContactsProps = {
  phones: TContactsItem;
  emails: TContactsItem;
};
