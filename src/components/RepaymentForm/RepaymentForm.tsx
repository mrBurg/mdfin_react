import React, { ReactElement, PureComponent } from 'react';
import { observer } from 'mobx-react';

import style from './RepaymentForm.module.scss';

import { dealNoMask } from '@src/config.json';

import { TStores } from '@stores';
import { WithTracking } from '@components/hocs';
import { Repayment } from '@components/Repayment';
import { ReactInputMaskWidget } from '@components/widgets/ReactInputMaskWidget';
import { TOnSubmitHandler, TOnInputChangeHandler } from '@interfaces';
import { INPUT_TYPE, FIELD_NAME, BUTTON_TYPE } from '@src/constants';
import { AbstractRoles, WidgetRoles } from '@src/roles';
import {
  EFocusEvents,
  EKeyboardEvents,
  EMouseEvents,
} from '@src/trackingConstants';
import { handleErrors } from '@utils';

@observer
export class RepaymentForm extends PureComponent<TStores> {
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
      repaymentStore
        .getCabinetDeal()
        .then((hasDeal) => {
          return hasDeal
            ? repaymentStore.updatePaymentState(true)
            : repaymentStore.setValidForm(false);
        })
        .catch((err) => {
          handleErrors(err);
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
                <WithTracking
                  id={`RepaymentForm-${AbstractRoles.input}-${INPUT_TYPE.NUMBER}`}
                  events={[
                    EFocusEvents.FOCUS,
                    EFocusEvents.BLUR,
                    EKeyboardEvents.KEY_UP,
                  ]}
                >
                  <ReactInputMaskWidget
                    name={FIELD_NAME.PHONE_NUMBER}
                    value={cabinetDeal.dealInfo.dealNo}
                    className={style.input}
                    invalid={!validForm}
                    type={INPUT_TYPE.TEL}
                    mask={dealNoMask}
                    placeholder={dealNoMask.replace(/9/g, '*')}
                    onChange={this.onChangeHandler}
                    role={AbstractRoles.input}
                  />
                </WithTracking>
                <WithTracking
                  id={`RepaymentForm-${WidgetRoles.button}-${BUTTON_TYPE.SUBMIT}`}
                  events={[EMouseEvents.CLICK]}
                >
                  <button
                    className={style.button}
                    type={BUTTON_TYPE.SUBMIT}
                    role={WidgetRoles.button}
                  >
                    {buttonText}
                  </button>
                </WithTracking>
              </div>
            </form>
          )}
        </>
      );
    }

    return null;
  }
}
