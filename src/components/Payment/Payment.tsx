import { ReactElement, PureComponent } from 'react';

import style from './Payment.module.scss';

import { BUTTON_TYPE, INPUT_TYPE } from '../../constants';
import { inject, observer } from 'mobx-react';
import { STORE_IDS } from '../../stores';
import PaymentStore from '../../stores/paymentStore';

type TPaymentProps = {
  paymentStore?: PaymentStore;
};

@inject(STORE_IDS.PAYMENT_STORE)
@observer
export class Payment extends PureComponent<TPaymentProps> {
  formData = null;
  public readonly state = {};

  componentDidMount(): void {
    const { paymentStore } = this.props;

    if (paymentStore) paymentStore.initPaymentForm();
  }

  render(): ReactElement | null {
    const { paymentStore } = this.props;

    if (paymentStore) {
      const { formData } = paymentStore;

      if (formData) {
        const { title, buttonText } = formData;

        return (
          <form className={style.payment}>
            <h3>{title}</h3>
            <fieldset className={style.fieldset}>
              <input className={style.input} type={INPUT_TYPE.TEXT} />
              <button className={style.button} type={BUTTON_TYPE.BUTTON}>
                {buttonText}
              </button>
            </fieldset>
          </form>
        );
      }
    }

    return null;
  }
}
