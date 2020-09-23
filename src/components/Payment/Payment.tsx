import { ReactElement, PureComponent } from 'react';

import style from './Payment.module.scss';

import { BUTTON_TYPE, INPUT_TYPE } from '../../constants';
import { observer } from 'mobx-react';
import { TComponenProps } from '../../interfaces';

@observer
export class Payment extends PureComponent<TComponenProps> {
  componentDidMount(): void {
    const { paymentStore } = this.props;

    paymentStore.initPaymentForm();
  }

  render(): ReactElement | null {
    const {
      paymentStore: { formStatic },
    } = this.props;

    if (formStatic) {
      const { title } = formStatic;

      return (
        <form className={style.payment}>
          <h3 className={style.title}>{title}</h3>
          <div className={style.fieldset}>
            <input className={style.input} type={INPUT_TYPE.TEXT} />
            <button className={style.button} type={BUTTON_TYPE.BUTTON}>
              Thanh Toán Trực Tuyến
            </button>
          </div>
        </form>
      );
    }

    return null;
  }
}
