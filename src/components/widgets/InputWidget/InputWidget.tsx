import React, { ReactElement, useEffect, useState } from 'react';
import classNames from 'classnames';

import style from './InputWidget.module.scss';
import { WithTracking } from '@components/hocs';
import { TOnInputChangeHandler } from '@interfaces';
import { AbstractRoles } from '@src/roles';
import {
  EFocusEvents,
  EFormEvents,
  EKeyboardEvents,
} from '@src/trackingConstants';
import { TInputWidgetProps } from './@types';

export const InputWidget = (props: TInputWidgetProps): ReactElement => {
  const {
    className,
    inputClassName,
    symbolClassName,
    symbol,
    // transformer,
    // onChange,
    value,
    ...restData
  } = props;

  useEffect(() => {
    console.info('useEffect');
    setState(value);
  }, [value]);

  //onInputHandler

  // let inputValue = value;

  // if (transformer) inputValue = transformer(inputValue);

  const [state, setState] = useState(value);

  const onChangeHandler: TOnInputChangeHandler = (event) => {
    const inputData = event.target.value;

    console.info(inputData);

    /* if (transformer) {
      inputData = transformer(inputData);

      console.info(inputData);
    } */
    // const inputData = transformer(event.target.value)

    setState(inputData);
    //   if (onChange) onChange(event, state);
  };

  // const onKeyUpHandler = (event) => {
  //   let inputData = event.target.value;

  //   setState(inputData);

  // (event) => {
  // const target = event.target as HTMLInputElement;
  // console.info(event.key, 'key');
  // console.info(event.code, 'code');
  // console.info(event.keyIdentifier, 'keyIdentifier');
  // console.info(event.keyCode, 'keyCode');
  // console.info(event.charCode, 'charCode');
  /* if (event.code == 37 && event.code == 39) {
              return;
            } */
  //   // target.value = target.value.replace(/\D/, '');
  //   // console.info(target.value);
  // }
  // };

  return (
    <>
      <div>{value}</div>
      <div className={classNames(style.inputWidget, className)}>
        <WithTracking
          id={`InputWidget-${AbstractRoles.input}`}
          events={[
            EFocusEvents.FOCUS,
            EFocusEvents.BLUR,
            EFormEvents.CHANGE,
            EKeyboardEvents.KEY_PRESS,
          ]}
        >
          <input
            className={inputClassName}
            onChange={onChangeHandler}
            // value={state}
            value={state}
            // onKeyUp={onKeyUpHandler}
            role={AbstractRoles.input}
            {...restData}
          />
        </WithTracking>
        {symbol && <span className={symbolClassName}>{symbol}</span>}
      </div>
    </>
  );
};
