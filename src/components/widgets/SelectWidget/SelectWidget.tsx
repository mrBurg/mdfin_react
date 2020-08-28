import { PureComponent } from 'react';
import { Select } from 'semantic-ui-react';
import classNames from 'classnames';

import style from './SelectWidget.module.scss';
import { TSelectWidgetProps } from './@types';

export class SelectWidget extends PureComponent<TSelectWidgetProps> {
  render() {
    const { className, ...props } = this.props;

    return (
      <Select className={classNames(style.select, className)} {...props} />
    );
  }
}
