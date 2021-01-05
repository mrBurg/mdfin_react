import React, { ReactElement, PureComponent } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { observer } from 'mobx-react';

import style from './Inprocess.module.scss';

import { refreshViewTime } from '@src/config.json';
import { Attachments } from '@components/Attachments';
import { TInprocessProps } from './@types';
import { TDocumentUnit } from '@stores-types/loanStore';

@observer
export class Inprocess extends PureComponent<TInprocessProps> {
  componentDidMount(): void {
    const { loanStore } = this.props;

    loanStore.getCabinetApplication();
    this.refreshView();

    setInterval(async () => {
      this.refreshView();
    }, refreshViewTime);
  }

  private async refreshView() {
    const { userStore } = this.props;
    if (userStore) userStore.getClientNextStep();
  }

  render(): ReactElement | null {
    const {
      className,
      loanStore: {
        attachmentsFormStatic,
        cabinetApplication: { documentUnits, notification },
      },
    } = this.props;

    if (attachmentsFormStatic && documentUnits) {
      return (
        <>
          <h2 className={style.title}>{notification}</h2>

          <div className={classNames(style.inprocess, className)}>
            {_.map(documentUnits, (item: TDocumentUnit, key) => (
              <Attachments
                key={key}
                locales={attachmentsFormStatic}
                {...item}
              />
            ))}
          </div>
        </>
      );
    }

    return null;
  }
}
