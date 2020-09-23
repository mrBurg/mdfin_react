import React, { PureComponent, ReactElement, MouseEvent } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import _ from 'lodash';

import style from './Client.module.scss';

import { AboutMyself, Addresses, Work, Documents } from './steps';
import { TComponenProps } from '../../interfaces';
import { CLIENT_STEP } from '../../routes';

type TSwitchNextStepHendler = {
  (event: MouseEvent<HTMLButtonElement>): void;
};

export type TClientStepProps = {
  switchNextStepHendler: TSwitchNextStepHendler;
};

@observer
export class Client extends PureComponent<TComponenProps> {
  componentDidMount(): void {
    const { userStore } = this.props;
    userStore.initUserForm();
  }

  private switchNextStepHendler: TSwitchNextStepHendler = (): void => {
    const { userStore } = this.props;
    userStore.setNextStep();
  };

  private renderSteps() {
    const {
      userStore: { formStatic, currentStep, userData },
    } = this.props;

    if (_.size(formStatic) && _.size(userData)) {
      const { aboutMyself, addresses, work, documents } = formStatic;

      switch (currentStep) {
        case CLIENT_STEP.obligatory:
          return (
            <AboutMyself
              staticData={aboutMyself}
              userData={userData}
              switchNextStepHendler={this.switchNextStepHendler}
            />
          );
        case CLIENT_STEP.address:
          return (
            <Addresses
              {...addresses}
              switchNextStepHendler={this.switchNextStepHendler}
            />
          );
        case CLIENT_STEP.job:
          return (
            <Work
              {...work}
              switchNextStepHendler={this.switchNextStepHendler}
            />
          );
        case CLIENT_STEP.attachment_account:
          return (
            <Documents
              {...documents}
              switchNextStepHendler={this.switchNextStepHendler}
            />
          );
      }
    }
  }

  public render(): ReactElement {
    const {
      userStore: { formStatic, currentStep },
    } = this.props;

    return (
      <div className={style.client}>
        <ul className={style.steps}>
          {_.map(formStatic, (_item: string, index: string) => {
            return (
              <li
                key={index}
                className={classNames(style.step, {
                  [style.step_current]: index == currentStep,
                })}
              />
            );
          })}
        </ul>
        {this.renderSteps()}
      </div>
    );
  }
}
