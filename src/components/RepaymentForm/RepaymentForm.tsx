import { ReactElement, PureComponent } from 'react';
import { observer } from 'mobx-react';

import style from './RepaymentForm.module.scss';

import { BUTTON_TYPE, INPUT_TYPE } from '../../constants';
import { TComponenProps, TOnSubmitHandler } from '../../interfaces';
import { Repayment } from '../Repayment';

@observer
export class RepaymentForm extends PureComponent<TComponenProps> {
  public componentDidMount(): void {
    const { repaymentStore } = this.props;

    repaymentStore.initPaymentForm();
  }

  private onSubmitHandler: TOnSubmitHandler = (event) => {
    event.preventDefault();

    const { repaymentStore } = this.props;

    repaymentStore.updatePaymentState(true);
    console.info('Payment Form submitted');
  };

  render(): ReactElement | null {
    const { repaymentStore } = this.props;
    const { formStatic, repayment } = repaymentStore;

    if (formStatic) {
      const { title } = formStatic;

      return (
        <>
          {repayment ? (
            <Repayment className={style.repayment} />
          ) : (
            <form
              onSubmit={this.onSubmitHandler}
              className={style.repaymentForm}
            >
              <h3 className={style.title}>{title}</h3>
              <div className={style.fieldset}>
                <input className={style.input} type={INPUT_TYPE.TEXT} />
                <button className={style.button} type={BUTTON_TYPE.SUBMIT}>
                  Thanh Toán Trực Tuyến
                </button>
              </div>
            </form>
          )}
        </>
      );
    }

    return null;
  }
}
