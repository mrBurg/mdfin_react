import React, { PureComponent, ReactElement } from 'react';
import _ from 'lodash';
import { observer, inject } from 'mobx-react';

import style from './AttachmentsForm.module.scss';
import { Attachments } from '@components/Attachments';
import { STORE_IDS } from '@stores';
import { TAttachmentsFormProps } from './@types';
import { TDocumentUnit } from '@stores-types/loanStore';

@inject(STORE_IDS.LOAN_STORE)
@observer
export class AttachmentsForm extends PureComponent<TAttachmentsFormProps> {
  public componentDidMount(): void {
    const { loanStore } = this.props;

    if (loanStore) {
      loanStore.initAttachmentsForm();
    }
  }

  public render(): ReactElement | null {
    const { loanStore } = this.props;

    if (loanStore) {
      const {
        attachmentsFormStatic,
        cabinetApplication: { documentUnits },
      } = loanStore;

      if (attachmentsFormStatic && documentUnits) {
        const { isPresent } = attachmentsFormStatic;

        return (
          <form className={style.attachments}>
            <h2 className={style.title}>{isPresent.title}</h2>
            <div className={style.buttons}>
              {_.map(documentUnits, (item: TDocumentUnit, key) => (
                <Attachments
                  key={key}
                  locales={attachmentsFormStatic}
                  {...item}
                />
              ))}
            </div>
          </form>
        );
      }
    }

    return null;
  }
}
