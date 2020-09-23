import { ReactElement, PureComponent } from 'react';
import { observer } from 'mobx-react';
import InputMask from 'react-input-mask';
import classNames from 'classnames';

import style from './RepaymentForm.module.scss';

import { dealNoMask } from '../../config.json';

import { BUTTON_TYPE, INPUT_TYPE } from '../../constants';
import {
  TComponenProps,
  TOnSubmitHandler,
  TOnInputChangeHandler,
} from '../../interfaces';
import { Repayment } from '../Repayment';
import { isProd } from '../../utils';

@observer
export class RepaymentForm extends PureComponent<TComponenProps> {
  public componentDidMount(): void {
    const { repaymentStore } = this.props;
    repaymentStore.initPaymentForm();
  }

  componentWillUnmount(): void {
    const { repaymentStore } = this.props;
    if (repaymentStore) {
      repaymentStore.updatePaymentState(false);
      repaymentStore.initCabinetDeal();
    }
  }

  private onSubmitHandler: TOnSubmitHandler = (event) => {
    event.preventDefault();

    const { repaymentStore } = this.props;

    if (repaymentStore) {
      repaymentStore.getCabinetDeal().then((hasDeal) => {
        if (hasDeal) {
          return repaymentStore.updatePaymentState(true);
        } else {
          return repaymentStore.setValidForm(false);
        }
      });
    }
  };

  private onChangeHandler: TOnInputChangeHandler = ({
    currentTarget: { value },
  }) => {
    const { repaymentStore } = this.props;
    if (repaymentStore) {
      repaymentStore.updateDealNo(value);
      repaymentStore.setValidForm(true);
    }
  };

  render(): ReactElement | null {
    const { repaymentStore } = this.props;
    const { formStatic, repayment, cabinetDeal, validForm } = repaymentStore;

    if (formStatic) {
      const { title, buttonText } = formStatic;

      return (
        <>
          {repayment ? (
            <Repayment className={style.repayment} {...this.props} />
          ) : (
            <form
              onSubmit={this.onSubmitHandler}
              className={style.repaymentForm}
            >
              <h3 className={style.title}>{title}</h3>
              <div className={style.fieldset}>
                <InputMask
                  //name={FIELD_NAME.PHONE_NUMBER}
                  className={classNames(style.input, {
                    [style.error]: !validForm,
                  })}
                  type={INPUT_TYPE.TEL}
                  mask={dealNoMask}
                  value={cabinetDeal.dealInfo.dealNo}
                  placeholder={dealNoMask.replace(/9/g, '*')}
                  onChange={this.onChangeHandler}
                />

                <button
                  className={style.button}
                  type={BUTTON_TYPE.SUBMIT}
                  disabled={isProd}
                >
                  {buttonText}
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
