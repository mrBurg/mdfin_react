export type TDirectoryItem = {
  text: string;
  value: string | number;
  index: number;
  manual_input?: string;
  disabled?: boolean;
};

export type TDirectory = Array<TDirectoryItem>;
