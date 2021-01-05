import { TDirectoryItem } from '@stores-types/pageStore';

export type TSelectData = { name: string; value: string };

export type TReactSelectWidgetProps = {
  className: string;
  invalid?: boolean;
  disabled?: boolean;
  value?: string | number;
  isSearchable?: boolean;
  onBlur?: (data: TSelectData) => void;
  onChange: (data: TSelectData) => void;
  name: string;
  placeholder: string;
  options: TDirectoryItem[];
};

export type TOption = {
  label: string;
  value?: number | string;
  id?: number;
  isDisabled?: boolean;
  manual_input?: string;
};
