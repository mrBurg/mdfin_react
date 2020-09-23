import { ReactElement, PureComponent } from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import { observer } from 'mobx-react';

import style from './Inprocess.module.scss';

import { TInprocessProps } from './@types';
import { Attachments } from '../Attachments';
import { TDocumentUnit } from '../../stores/@types/loanStore';
import { refreshViewTime } from './../../config.json';

@observer
export class Inprocess extends PureComponent<TInprocessProps> {
  componentDidMount() {
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

  render(): ReactElement {
    const {
      className,
      loanStore: {
        cabinetApplication: { documentUnits, notification },
      },
    } = this.props;

    return (
      <>
        <h2 className={style.title}>{notification}</h2>

        <div className={classNames(style.inprocess, className)}>
          {_.map(documentUnits, (item: TDocumentUnit, key) => {
            let { documents, full, type, type_id } = item;

            return (
              <Attachments
                key={key}
                title={type}
                documents={documents}
                type={type_id}
                full={full}
              />
            );
          })}
        </div>
      </>
    );
  }
}
