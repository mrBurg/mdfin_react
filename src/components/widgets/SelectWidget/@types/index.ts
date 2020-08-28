import { DropdownItemProps, StrictDropdownProps } from 'semantic-ui-react';

export type TSelectWidgetProps = {
  name: string;
  options: DropdownItemProps;
} & StrictDropdownProps;
