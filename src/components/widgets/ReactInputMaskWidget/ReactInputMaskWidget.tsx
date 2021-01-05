import React, { Component, ReactElement } from 'react';
import InputMask from 'react-input-mask';
import classNames from 'classnames';

import style from './reactInputMaskWidget.module.scss';
import { TReactInputMaskWidgetProps } from './@types';

export class ReactInputMaskWidget extends Component<TReactInputMaskWidgetProps> {
  render(): ReactElement {
    const { invalid, className, ...restProps } = this.props;

    return (
      <InputMask
        className={classNames(style.input, className, {
          [style.error]: invalid,
        })}
        {...restProps}
      />
    );
  }
}
